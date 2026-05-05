import { Router } from 'express';
import pool from '../db.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

// Helpers ---------------------------------------------------------------
async function attachVariantsAndImages(products) {
  if (!products.length) return products;
  const ids = products.map(p => p.id);
  const placeholders = ids.map(() => '?').join(',');

  const [imgs] = await pool.query(
    `SELECT product_id, url, alt, sort_order, is_primary FROM product_images
     WHERE product_id IN (${placeholders}) ORDER BY sort_order`,
    ids
  );
  const [vars] = await pool.query(
    `SELECT id, product_id, size, color_name_ar, color_name_en, color_hex, stock, price_override
     FROM product_variants WHERE product_id IN (${placeholders})`,
    ids
  );

  const byProductImgs = {};
  for (const i of imgs) (byProductImgs[i.product_id] ??= []).push(i);
  const byProductVars = {};
  for (const v of vars) (byProductVars[v.product_id] ??= []).push(v);

  for (const p of products) {
    p.images   = byProductImgs[p.id] || [];
    p.variants = byProductVars[p.id] || [];
    p.image    = p.images[0]?.url || null;
    p.colors   = [...new Map(p.variants.map(v => [v.color_name_en, { name_ar: v.color_name_ar, name_en: v.color_name_en, hex: v.color_hex }])).values()];
    p.sizes    = [...new Set(p.variants.map(v => v.size))];
    p.in_stock = p.variants.some(v => v.stock > 0);
  }
  return products;
}

// GET /api/products?category=men&sub=men-shirts&size=L&color=Black&min=100&max=2000&sort=newest&q=&page=1&limit=24
router.get('/', ah(async (req, res) => {
  const {
    category, sub, gender, size, color, min, max, q,
    sort = 'newest', page = 1, limit = 24, featured, isNew, brand
  } = req.query;

  const where = ['p.is_active = 1'];
  const params = [];

  if (category || sub) {
    const slug = sub || category;
    where.push(`(c.slug = ? OR parent_cat.slug = ?)`);
    params.push(slug, slug);
  }
  if (gender)  { where.push('p.gender = ?');   params.push(gender); }
  if (q)       { where.push('(p.name_ar LIKE ? OR p.name_en LIKE ? OR p.brand LIKE ? OR p.sku LIKE ?)'); const v = `%${q}%`; params.push(v, v, v, v); }
  if (min)     { where.push('p.price >= ?');   params.push(Number(min)); }
  if (max)     { where.push('p.price <= ?');   params.push(Number(max)); }
  if (featured === '1') where.push('p.is_featured = 1');
  if (isNew === '1')    where.push('p.is_new = 1');
  if (brand)   { where.push('p.brand = ?');    params.push(brand); }

  if (size || color) {
    const sub2 = ['SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id'];
    if (size)  { sub2.push('AND pv.size = ?'); params.push(size); }
    if (color) { sub2.push('AND pv.color_name_en = ?'); params.push(color); }
    where.push(`EXISTS (${sub2.join(' ')})`);
  }

  const sortMap = {
    newest:     'p.created_at DESC',
    oldest:     'p.created_at ASC',
    'price-asc':  'p.price ASC',
    'price-desc': 'p.price DESC',
    bestseller:   'p.sales_count DESC',
    rating:       'p.rating_avg DESC',
  };
  const orderBy = sortMap[sort] || sortMap.newest;

  const lim = Math.min(Number(limit) || 24, 60);
  const off = (Math.max(Number(page), 1) - 1) * lim;

  const baseSql = `
    FROM products p
    JOIN categories c ON c.id = p.category_id
    LEFT JOIN categories parent_cat ON parent_cat.id = c.parent_id
    WHERE ${where.join(' AND ')}
  `;

  const [countRows] = await pool.query(`SELECT COUNT(*) AS total ${baseSql}`, params);
  const total = countRows[0].total;

  const [rows] = await pool.query(
    `SELECT p.id, p.slug, p.sku, p.name_ar, p.name_en, p.brand, p.gender, p.price, p.compare_at_price,
            p.rating_avg, p.rating_count, p.is_featured, p.is_new, p.sales_count,
            c.slug AS category_slug, c.name_ar AS category_name_ar, c.name_en AS category_name_en
     ${baseSql}
     ORDER BY ${orderBy}
     LIMIT ? OFFSET ?`,
    [...params, lim, off]
  );

  await attachVariantsAndImages(rows);

  res.json({
    products: rows,
    pagination: { page: Number(page), limit: lim, total, pages: Math.ceil(total / lim) }
  });
}));

// GET /api/products/featured
router.get('/featured', ah(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT p.id, p.slug, p.sku, p.name_ar, p.name_en, p.brand, p.gender, p.price, p.compare_at_price,
            p.rating_avg, p.rating_count, p.is_featured, p.is_new,
            c.slug AS category_slug
     FROM products p JOIN categories c ON c.id = p.category_id
     WHERE p.is_active = 1 AND p.is_featured = 1
     ORDER BY p.created_at DESC LIMIT 12`
  );
  await attachVariantsAndImages(rows);
  res.json({ products: rows });
}));

// GET /api/products/new
router.get('/new', ah(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT p.id, p.slug, p.sku, p.name_ar, p.name_en, p.brand, p.gender, p.price, p.compare_at_price,
            p.rating_avg, p.rating_count, p.is_featured, p.is_new,
            c.slug AS category_slug
     FROM products p JOIN categories c ON c.id = p.category_id
     WHERE p.is_active = 1 AND p.is_new = 1
     ORDER BY p.created_at DESC LIMIT 8`
  );
  await attachVariantsAndImages(rows);
  res.json({ products: rows });
}));

// GET /api/products/bestsellers
router.get('/bestsellers', ah(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT p.id, p.slug, p.sku, p.name_ar, p.name_en, p.brand, p.gender, p.price, p.compare_at_price,
            p.rating_avg, p.rating_count, p.is_featured, p.is_new, p.sales_count,
            c.slug AS category_slug
     FROM products p JOIN categories c ON c.id = p.category_id
     WHERE p.is_active = 1
     ORDER BY p.sales_count DESC, p.rating_avg DESC LIMIT 8`
  );
  await attachVariantsAndImages(rows);
  res.json({ products: rows });
}));

// GET /api/products/:slug
router.get('/:slug', ah(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, c.slug AS category_slug, c.name_ar AS category_name_ar, c.name_en AS category_name_en
     FROM products p JOIN categories c ON c.id = p.category_id
     WHERE p.slug = ? AND p.is_active = 1`,
    [req.params.slug]
  );
  if (!rows.length) return res.status(404).json({ error: 'Product not found' });
  await attachVariantsAndImages(rows);

  // Reviews
  const [reviews] = await pool.query(
    `SELECT r.id, r.rating, r.title, r.comment, r.created_at, u.name AS user_name
     FROM reviews r JOIN users u ON u.id = r.user_id
     WHERE r.product_id = ? AND r.is_approved = 1
     ORDER BY r.created_at DESC LIMIT 20`,
    [rows[0].id]
  );

  // Related products in same category
  const [related] = await pool.query(
    `SELECT p.id, p.slug, p.name_ar, p.name_en, p.price, p.compare_at_price, p.rating_avg
     FROM products p WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1
     ORDER BY RAND() LIMIT 8`,
    [rows[0].category_id, rows[0].id]
  );
  await attachVariantsAndImages(related);

  res.json({ product: rows[0], reviews, related });
}));

export default router;
