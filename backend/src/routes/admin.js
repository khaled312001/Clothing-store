import { Router } from 'express';
import pool from '../db.js';
import { authRequired, adminRequired } from '../middleware/auth.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();
router.use(authRequired, adminRequired);

// ===== DASHBOARD =====
router.get('/stats', ah(async (_req, res) => {
  const [[counts]] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM products WHERE is_active = 1) AS products,
      (SELECT COUNT(*) FROM orders) AS orders,
      (SELECT COUNT(*) FROM users WHERE role = 'customer') AS customers,
      (SELECT COALESCE(SUM(total),0) FROM orders WHERE status NOT IN ('cancelled','refunded')) AS revenue,
      (SELECT COUNT(*) FROM orders WHERE status = 'pending') AS pending_orders,
      (SELECT COUNT(*) FROM product_variants WHERE stock < 5) AS low_stock_variants
  `);
  const [topProducts] = await pool.query(`
    SELECT p.id, p.slug, p.name_ar, p.name_en, p.price, p.sales_count,
      (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) AS image
    FROM products p ORDER BY sales_count DESC LIMIT 5
  `);
  const [recentOrders] = await pool.query(`
    SELECT o.id, o.order_number, o.status, o.payment_method, o.total, o.created_at, u.name AS customer_name
    FROM orders o JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC LIMIT 8
  `);
  const [salesByDay] = await pool.query(`
    SELECT DATE(created_at) AS day, SUM(total) AS revenue, COUNT(*) AS orders
    FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      AND status NOT IN ('cancelled','refunded')
    GROUP BY DATE(created_at) ORDER BY day
  `);
  res.json({ counts, topProducts, recentOrders, salesByDay });
}));

// ===== PRODUCTS =====
router.get('/products', ah(async (req, res) => {
  const { q, page = 1, limit = 30 } = req.query;
  const where = [];
  const params = [];
  if (q) { where.push('(p.name_ar LIKE ? OR p.name_en LIKE ? OR p.sku LIKE ?)'); const v = `%${q}%`; params.push(v, v, v); }
  const wsql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const lim = Number(limit), off = (Number(page) - 1) * lim;

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM products p ${wsql}`, params);
  const [products] = await pool.query(
    `SELECT p.id, p.sku, p.slug, p.name_ar, p.name_en, p.price, p.compare_at_price,
            p.is_active, p.is_featured, p.is_new, p.sales_count, p.rating_avg, p.rating_count,
            c.name_en AS category_name_en, c.slug AS category_slug,
            (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) AS image,
            (SELECT SUM(stock) FROM product_variants WHERE product_id = p.id) AS total_stock
     FROM products p JOIN categories c ON c.id = p.category_id
     ${wsql} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
    [...params, lim, off]
  );
  res.json({ products, pagination: { page: Number(page), limit: lim, total, pages: Math.ceil(total / lim) } });
}));

router.put('/products/:id', ah(async (req, res) => {
  const f = req.body;
  await pool.query(
    `UPDATE products SET
       name_ar = COALESCE(?, name_ar), name_en = COALESCE(?, name_en),
       description_ar = COALESCE(?, description_ar), description_en = COALESCE(?, description_en),
       price = COALESCE(?, price), compare_at_price = COALESCE(?, compare_at_price),
       brand = COALESCE(?, brand), is_active = COALESCE(?, is_active),
       is_featured = COALESCE(?, is_featured), is_new = COALESCE(?, is_new)
     WHERE id = ?`,
    [f.name_ar, f.name_en, f.description_ar, f.description_en, f.price, f.compare_at_price,
     f.brand, f.is_active, f.is_featured, f.is_new, req.params.id]
  );
  res.json({ ok: true });
}));

router.delete('/products/:id', ah(async (req, res) => {
  await pool.query('UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

// ===== ORDERS =====
router.get('/orders', ah(async (req, res) => {
  const { status, q, page = 1, limit = 30 } = req.query;
  const where = [];
  const params = [];
  if (status) { where.push('o.status = ?'); params.push(status); }
  if (q) { where.push('(o.order_number LIKE ? OR u.name LIKE ? OR u.email LIKE ?)'); const v = `%${q}%`; params.push(v, v, v); }
  const wsql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const lim = Number(limit), off = (Number(page) - 1) * lim;

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM orders o JOIN users u ON u.id = o.user_id ${wsql}`, params);
  const [orders] = await pool.query(
    `SELECT o.id, o.order_number, o.status, o.payment_method, o.payment_status,
            o.total, o.created_at, u.name AS customer_name, u.email AS customer_email
     FROM orders o JOIN users u ON u.id = o.user_id
     ${wsql} ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
    [...params, lim, off]
  );
  res.json({ orders, pagination: { page: Number(page), limit: lim, total, pages: Math.ceil(total / lim) } });
}));

router.get('/orders/:id', ah(async (req, res) => {
  const [orderRows] = await pool.query(
    `SELECT o.*, u.name AS customer_name, u.email AS customer_email, u.phone AS customer_phone
     FROM orders o JOIN users u ON u.id = o.user_id WHERE o.id = ?`,
    [req.params.id]
  );
  if (!orderRows.length) return res.status(404).json({ error: 'Order not found' });
  const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
  res.json({ order: orderRows[0], items });
}));

router.put('/orders/:id', ah(async (req, res) => {
  const { status, payment_status, tracking_number } = req.body;
  await pool.query(
    `UPDATE orders SET status = COALESCE(?, status), payment_status = COALESCE(?, payment_status),
                       tracking_number = COALESCE(?, tracking_number) WHERE id = ?`,
    [status, payment_status, tracking_number, req.params.id]
  );
  res.json({ ok: true });
}));

// ===== CUSTOMERS =====
router.get('/customers', ah(async (req, res) => {
  const { q, page = 1, limit = 30 } = req.query;
  const where = ["u.role = 'customer'"];
  const params = [];
  if (q) { where.push('(u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)'); const v = `%${q}%`; params.push(v, v, v); }
  const wsql = `WHERE ${where.join(' AND ')}`;
  const lim = Number(limit), off = (Number(page) - 1) * lim;

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM users u ${wsql}`, params);
  const [customers] = await pool.query(
    `SELECT u.id, u.name, u.email, u.phone, u.created_at,
            (SELECT COUNT(*) FROM orders WHERE user_id = u.id) AS orders_count,
            (SELECT COALESCE(SUM(total),0) FROM orders WHERE user_id = u.id AND status != 'cancelled') AS total_spent
     FROM users u ${wsql} ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
    [...params, lim, off]
  );
  res.json({ customers, pagination: { page: Number(page), limit: lim, total, pages: Math.ceil(total / lim) } });
}));

// ===== COUPONS =====
router.get('/coupons', ah(async (_req, res) => {
  const [coupons] = await pool.query('SELECT * FROM coupons ORDER BY created_at DESC');
  res.json({ coupons });
}));

router.post('/coupons', ah(async (req, res) => {
  const c = req.body;
  if (!c.code || !c.value) return res.status(400).json({ error: 'code and value required' });
  await pool.query(
    `INSERT INTO coupons (code, description_ar, description_en, type, value, min_order, max_discount, usage_limit, expires_at, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [c.code.toUpperCase(), c.description_ar || null, c.description_en || null,
     c.type || 'percentage', c.value, c.min_order || 0, c.max_discount || null,
     c.usage_limit || null, c.expires_at || null, c.is_active ? 1 : 1]
  );
  res.json({ ok: true });
}));

router.delete('/coupons/:id', ah(async (req, res) => {
  await pool.query('DELETE FROM coupons WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

// ===== REVIEWS MODERATION =====
router.get('/reviews', ah(async (_req, res) => {
  const [reviews] = await pool.query(
    `SELECT r.*, p.name_en AS product_name, u.name AS user_name
     FROM reviews r JOIN products p ON p.id = r.product_id JOIN users u ON u.id = r.user_id
     ORDER BY r.created_at DESC LIMIT 100`
  );
  res.json({ reviews });
}));

router.put('/reviews/:id', ah(async (req, res) => {
  const { is_approved } = req.body;
  await pool.query('UPDATE reviews SET is_approved = ? WHERE id = ?', [is_approved ? 1 : 0, req.params.id]);
  res.json({ ok: true });
}));

router.delete('/reviews/:id', ah(async (req, res) => {
  await pool.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

export default router;
