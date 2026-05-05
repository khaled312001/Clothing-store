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
      (SELECT COUNT(*) FROM product_variants WHERE stock < 5) AS low_stock_variants,
      (SELECT COUNT(*) FROM reviews WHERE is_approved = 0) AS pending_reviews,
      (SELECT COALESCE(AVG(total),0) FROM orders WHERE status NOT IN ('cancelled','refunded')) AS aov,
      (SELECT COUNT(*) FROM users WHERE role = 'customer' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) AS new_customers_7d,
      (SELECT COALESCE(SUM(total),0) FROM orders WHERE status NOT IN ('cancelled','refunded') AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) AS revenue_7d
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

// Get a single product (with variants & images) for editing
router.get('/products/:id', ah(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  const [images]   = await pool.query('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order', [req.params.id]);
  const [variants] = await pool.query('SELECT * FROM product_variants WHERE product_id = ? ORDER BY size, color_name_en', [req.params.id]);
  res.json({ product: rows[0], images, variants });
}));

// Create product (with variants + images)
router.post('/products', ah(async (req, res) => {
  const f = req.body;
  if (!f.name_ar || !f.name_en || !f.sku || !f.price || !f.category_id) {
    return res.status(400).json({ error: 'name_ar, name_en, sku, price, category_id required' });
  }
  const slug = (f.slug || f.name_en).toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80) + '-' + f.sku.toLowerCase();

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.query(
      `INSERT INTO products (category_id, slug, sku, name_ar, name_en, description_ar, description_en,
                             brand, material_ar, material_en, gender, age_group, price, compare_at_price,
                             is_featured, is_new, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [f.category_id, slug, f.sku, f.name_ar, f.name_en, f.description_ar || null, f.description_en || null,
       f.brand || null, f.material_ar || null, f.material_en || null,
       f.gender || 'unisex', f.age_group || 'adult', f.price, f.compare_at_price || null,
       f.is_featured ? 1 : 0, f.is_new ? 1 : 0, f.is_active === 0 ? 0 : 1]
    );
    const pid = r.insertId;
    if (Array.isArray(f.images)) {
      for (let i = 0; i < f.images.length; i++) {
        const img = f.images[i];
        await conn.query(
          `INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)`,
          [pid, typeof img === 'string' ? img : img.url, typeof img === 'object' ? (img.alt || f.name_en) : f.name_en, i, i === 0 ? 1 : 0]
        );
      }
    }
    if (Array.isArray(f.variants)) {
      for (const v of f.variants) {
        await conn.query(
          `INSERT INTO product_variants (product_id, size, color_name_ar, color_name_en, color_hex, stock) VALUES (?, ?, ?, ?, ?, ?)`,
          [pid, v.size, v.color_name_ar, v.color_name_en, v.color_hex, Number(v.stock) || 0]
        );
      }
    }
    await conn.commit();
    res.status(201).json({ id: pid, slug });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally { conn.release(); }
}));

// Update product (and optionally replace images / variants if provided)
router.put('/products/:id', ah(async (req, res) => {
  const f = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      `UPDATE products SET
         category_id = COALESCE(?, category_id),
         name_ar = COALESCE(?, name_ar), name_en = COALESCE(?, name_en),
         description_ar = COALESCE(?, description_ar), description_en = COALESCE(?, description_en),
         price = COALESCE(?, price), compare_at_price = ?,
         brand = COALESCE(?, brand),
         material_ar = COALESCE(?, material_ar), material_en = COALESCE(?, material_en),
         gender = COALESCE(?, gender), age_group = COALESCE(?, age_group),
         is_active = COALESCE(?, is_active),
         is_featured = COALESCE(?, is_featured), is_new = COALESCE(?, is_new)
       WHERE id = ?`,
      [f.category_id, f.name_ar, f.name_en, f.description_ar, f.description_en, f.price,
       f.compare_at_price === '' ? null : f.compare_at_price, f.brand,
       f.material_ar, f.material_en, f.gender, f.age_group,
       f.is_active, f.is_featured, f.is_new, req.params.id]
    );

    if (Array.isArray(f.images)) {
      await conn.query('DELETE FROM product_images WHERE product_id = ?', [req.params.id]);
      for (let i = 0; i < f.images.length; i++) {
        const img = f.images[i];
        const url = typeof img === 'string' ? img : img.url;
        if (!url) continue;
        await conn.query(
          `INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)`,
          [req.params.id, url, typeof img === 'object' ? (img.alt || '') : '', i, i === 0 ? 1 : 0]
        );
      }
    }
    if (Array.isArray(f.variants)) {
      await conn.query('DELETE FROM product_variants WHERE product_id = ?', [req.params.id]);
      for (const v of f.variants) {
        if (!v.size || !v.color_name_en) continue;
        await conn.query(
          `INSERT INTO product_variants (product_id, size, color_name_ar, color_name_en, color_hex, stock) VALUES (?, ?, ?, ?, ?, ?)`,
          [req.params.id, v.size, v.color_name_ar || v.color_name_en, v.color_name_en, v.color_hex || '#000000', Number(v.stock) || 0]
        );
      }
    }
    await conn.commit();
    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally { conn.release(); }
}));

router.delete('/products/:id', ah(async (req, res) => {
  await pool.query('UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

// ===== REPORTS =====
// GET /api/admin/reports?period=7d|30d|90d|1y
router.get('/reports', ah(async (req, res) => {
  const period = req.query.period || '30d';
  const days = period === '7d' ? 7 : period === '90d' ? 90 : period === '1y' ? 365 : 30;

  // Compare current period vs previous period of same length
  const [[totals]] = await pool.query(`
    SELECT
      (SELECT COALESCE(SUM(total),0) FROM orders
        WHERE status NOT IN ('cancelled','refunded') AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)) AS revenue_now,
      (SELECT COALESCE(SUM(total),0) FROM orders
        WHERE status NOT IN ('cancelled','refunded')
          AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
          AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)) AS revenue_prev,
      (SELECT COUNT(*) FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)) AS orders_now,
      (SELECT COUNT(*) FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)) AS orders_prev,
      (SELECT COUNT(DISTINCT user_id) FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)) AS customers_now,
      (SELECT COUNT(*) FROM users WHERE role = 'customer' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)) AS new_customers,
      (SELECT COALESCE(AVG(total),0) FROM orders WHERE status NOT IN ('cancelled','refunded') AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)) AS aov
  `, [days, days*2, days, days, days*2, days, days, days, days]);

  const pct = (cur, prev) => {
    if (!prev || prev == 0) return cur > 0 ? 100 : 0;
    return Math.round(((cur - prev) / prev) * 100);
  };

  // Sales over time (one row per day)
  const [salesByDay] = await pool.query(`
    SELECT DATE(created_at) AS day, COALESCE(SUM(total),0) AS revenue, COUNT(*) AS orders
    FROM orders
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND status NOT IN ('cancelled','refunded')
    GROUP BY DATE(created_at) ORDER BY day
  `, [days]);

  // Sales by category (top-level)
  const [byCategory] = await pool.query(`
    SELECT
      COALESCE(parent.name_ar, c.name_ar) AS name_ar,
      COALESCE(parent.name_en, c.name_en) AS name_en,
      COALESCE(parent.slug, c.slug) AS slug,
      COUNT(DISTINCT oi.order_id) AS orders,
      SUM(oi.subtotal) AS revenue,
      SUM(oi.quantity) AS units
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    JOIN categories c ON c.id = p.category_id
    LEFT JOIN categories parent ON parent.id = c.parent_id
    WHERE o.status NOT IN ('cancelled','refunded')
      AND o.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY COALESCE(parent.id, c.id)
    ORDER BY revenue DESC
  `, [days]);

  // Sales by payment method
  const [byPayment] = await pool.query(`
    SELECT payment_method AS method, COUNT(*) AS orders, COALESCE(SUM(total),0) AS revenue
    FROM orders
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND status NOT IN ('cancelled','refunded')
    GROUP BY payment_method
    ORDER BY revenue DESC
  `, [days]);

  // Sales by status (current period)
  const [byStatus] = await pool.query(`
    SELECT status, COUNT(*) AS count, COALESCE(SUM(total),0) AS revenue
    FROM orders
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY status
  `, [days]);

  // Top selling products
  const [topProducts] = await pool.query(`
    SELECT p.id, p.slug, p.name_ar, p.name_en, p.price,
           SUM(oi.quantity) AS units_sold, SUM(oi.subtotal) AS revenue,
           (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) AS image
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE o.status NOT IN ('cancelled','refunded')
      AND o.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY p.id ORDER BY units_sold DESC LIMIT 10
  `, [days]);

  // Top customers (VIP)
  const [topCustomers] = await pool.query(`
    SELECT u.id, u.name, u.email, u.phone,
           COUNT(o.id) AS orders_count, COALESCE(SUM(o.total),0) AS total_spent,
           MAX(o.created_at) AS last_order
    FROM users u JOIN orders o ON o.user_id = u.id
    WHERE u.role = 'customer' AND o.status NOT IN ('cancelled','refunded')
      AND o.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY u.id ORDER BY total_spent DESC LIMIT 10
  `, [days]);

  // Hourly distribution (when orders happen) — last 30 days regardless
  const [byHour] = await pool.query(`
    SELECT HOUR(created_at) AS hour, COUNT(*) AS orders
    FROM orders
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY HOUR(created_at) ORDER BY hour
  `);

  res.json({
    period,
    totals: {
      revenue: { value: Number(totals.revenue_now), change: pct(totals.revenue_now, totals.revenue_prev) },
      orders:  { value: totals.orders_now,          change: pct(totals.orders_now, totals.orders_prev) },
      customers: { value: totals.customers_now },
      newCustomers: { value: totals.new_customers },
      aov: { value: Math.round(Number(totals.aov)) },
    },
    salesByDay,
    byCategory,
    byPayment,
    byStatus,
    topProducts,
    topCustomers,
    byHour,
  });
}));

// ===== INVENTORY =====
// GET /api/admin/inventory?lowOnly=1
router.get('/inventory', ah(async (req, res) => {
  const lowOnly = req.query.lowOnly === '1';
  const threshold = Number(req.query.threshold) || 5;

  const [rows] = await pool.query(`
    SELECT pv.id, pv.product_id, pv.size, pv.color_name_ar, pv.color_name_en, pv.color_hex, pv.stock,
           p.sku, p.name_ar, p.name_en, p.price,
           c.name_en AS category_name_en,
           (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) AS image
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    JOIN categories c ON c.id = p.category_id
    ${lowOnly ? `WHERE pv.stock < ?` : ''}
    ORDER BY pv.stock ASC, p.name_en
    LIMIT 200
  `, lowOnly ? [threshold] : []);

  const [[summary]] = await pool.query(`
    SELECT
      COUNT(*) AS total_variants,
      SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) AS out_of_stock,
      SUM(CASE WHEN stock > 0 AND stock < ? THEN 1 ELSE 0 END) AS low_stock,
      SUM(stock) AS total_units
    FROM product_variants
  `, [threshold]);

  res.json({ variants: rows, summary });
}));

// PUT /api/admin/inventory/:variantId  → quick stock update
router.put('/inventory/:variantId', ah(async (req, res) => {
  const stock = Number(req.body.stock);
  if (!Number.isFinite(stock) || stock < 0) return res.status(400).json({ error: 'Invalid stock' });
  await pool.query('UPDATE product_variants SET stock = ? WHERE id = ?', [stock, req.params.variantId]);
  res.json({ ok: true });
}));

// ===== POS — walk-in sale =====
function genPosOrderNumber() {
  return 'POS-' + Date.now().toString().slice(-7) + '-' + Math.floor(Math.random() * 90 + 10);
}

// POST /api/admin/pos/sale
// body: { items: [{ variant_id, quantity }], payment_method, paid_amount, customer_name?, customer_phone?, discount?, notes? }
router.post('/pos/sale', ah(async (req, res) => {
  const {
    items = [],
    payment_method = 'cash',
    paid_amount = 0,
    customer_name = 'عميل نقدي',
    customer_phone = '',
    discount = 0,
    notes = '',
  } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items provided' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Resolve variants & validate stock
    const placeholders = items.map(() => '?').join(',');
    const variantIds = items.map(i => i.variant_id);
    const [vrows] = await conn.query(
      `SELECT pv.id, pv.product_id, pv.size, pv.color_name_ar, pv.color_name_en, pv.color_hex, pv.stock,
              p.name_ar, p.name_en, p.price,
              (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) AS image
       FROM product_variants pv JOIN products p ON p.id = pv.product_id
       WHERE pv.id IN (${placeholders}) FOR UPDATE`,
      variantIds
    );
    const byId = Object.fromEntries(vrows.map(v => [v.id, v]));

    let subtotal = 0;
    const validatedItems = [];
    for (const it of items) {
      const v = byId[it.variant_id];
      if (!v) { await conn.rollback(); return res.status(400).json({ error: `Variant ${it.variant_id} not found` }); }
      const qty = Number(it.quantity) || 1;
      if (v.stock < qty) { await conn.rollback(); return res.status(400).json({ error: `Insufficient stock for ${v.name_en}` }); }
      const lineSub = Number(v.price) * qty;
      subtotal += lineSub;
      validatedItems.push({ variant: v, quantity: qty, lineSub });
    }

    const disc = Math.min(Number(discount) || 0, subtotal);
    const total = subtotal - disc;
    const paid = Number(paid_amount) || 0;
    const change = Math.max(0, paid - total);

    // POS uses the admin user as the "customer"
    const [or] = await conn.query(
      `INSERT INTO orders
       (order_number, user_id, status, payment_method, payment_status, subtotal, shipping_fee, discount, tax, total,
        shipping_full_name, shipping_phone, shipping_governorate, shipping_city, shipping_street, shipping_notes)
       VALUES (?, ?, 'delivered', ?, 'paid', ?, 0, ?, 0, ?, ?, ?, 'POS', 'POS', 'POS', ?)`,
      [
        genPosOrderNumber(), req.user.id, payment_method,
        subtotal, disc, total,
        customer_name, customer_phone, notes
      ]
    );
    const orderId = or.insertId;

    for (const { variant: v, quantity, lineSub } of validatedItems) {
      await conn.query(
        `INSERT INTO order_items
         (order_id, product_id, variant_id, product_name_ar, product_name_en, size,
          color_name_ar, color_name_en, color_hex, image_url, unit_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, v.product_id, v.id, v.name_ar, v.name_en, v.size,
         v.color_name_ar, v.color_name_en, v.color_hex, v.image, v.price, quantity, lineSub]
      );
      await conn.query('UPDATE product_variants SET stock = stock - ? WHERE id = ?', [quantity, v.id]);
      await conn.query('UPDATE products SET sales_count = sales_count + ? WHERE id = ?', [quantity, v.product_id]);
    }

    await conn.commit();

    const [orderRows] = await conn.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const [orderItems] = await conn.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    res.status(201).json({ order: orderRows[0], items: orderItems, change });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally { conn.release(); }
}));

// GET /api/admin/pos/products?q=...
// Lightweight product search for POS (returns variants flattened for quick add)
router.get('/pos/products', ah(async (req, res) => {
  const q = (req.query.q || '').trim();
  const params = [];
  let where = "p.is_active = 1";
  if (q) {
    where += " AND (p.name_ar LIKE ? OR p.name_en LIKE ? OR p.sku LIKE ? OR p.brand LIKE ?)";
    const v = `%${q}%`;
    params.push(v, v, v, v);
  }
  const [rows] = await pool.query(
    `SELECT p.id, p.slug, p.sku, p.name_ar, p.name_en, p.brand, p.price,
            (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) AS image
     FROM products p WHERE ${where}
     ORDER BY p.sales_count DESC, p.created_at DESC LIMIT 40`,
    params
  );
  if (rows.length) {
    const ids = rows.map(r => r.id);
    const ph = ids.map(() => '?').join(',');
    const [vars] = await pool.query(
      `SELECT id, product_id, size, color_name_ar, color_name_en, color_hex, stock
       FROM product_variants WHERE product_id IN (${ph}) AND stock > 0`,
      ids
    );
    const byProduct = {};
    for (const v of vars) (byProduct[v.product_id] ??= []).push(v);
    for (const p of rows) p.variants = byProduct[p.id] || [];
  }
  res.json({ products: rows.filter(p => p.variants?.length > 0) });
}));

// ===== CATEGORIES (admin) =====
router.get('/categories', ah(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT c.id, c.parent_id, c.slug, c.name_ar, c.name_en, c.image_url, c.icon, c.sort_order, c.is_active,
            (SELECT COUNT(*) FROM products WHERE category_id = c.id) AS products_count,
            p.name_en AS parent_name
     FROM categories c LEFT JOIN categories p ON p.id = c.parent_id
     ORDER BY COALESCE(c.parent_id, c.id), c.sort_order, c.id`
  );
  res.json({ categories: rows });
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
