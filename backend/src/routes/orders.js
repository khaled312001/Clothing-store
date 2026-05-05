import { Router } from 'express';
import pool from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

function genOrderNumber() {
  return 'BMG-' + Date.now().toString().slice(-7) + '-' + Math.floor(Math.random() * 90 + 10);
}

// GET /api/orders  →  customer's orders
router.get('/', authRequired, ah(async (req, res) => {
  const [orders] = await pool.query(
    `SELECT id, order_number, status, payment_method, payment_status, total, created_at
     FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    [req.user.id]
  );
  res.json({ orders });
}));

// POST /api/orders/:id/payment-proof — customer uploads transfer screenshot
router.post('/:id/payment-proof', authRequired, ah(async (req, res) => {
  const { payment_proof_url, payment_reference, payment_notes } = req.body;
  if (!payment_proof_url) return res.status(400).json({ error: 'payment_proof_url required' });
  const [r] = await pool.query(
    `UPDATE orders SET payment_proof_url = ?, payment_reference = ?, payment_notes = ?
     WHERE id = ? AND user_id = ?`,
    [payment_proof_url, payment_reference || null, payment_notes || null, req.params.id, req.user.id]
  );
  if (!r.affectedRows) return res.status(404).json({ error: 'Order not found' });
  res.json({ ok: true });
}));

// GET /api/orders/:id
router.get('/:id', authRequired, ah(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
    [req.params.id, req.user.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Order not found' });

  const [items] = await pool.query(
    `SELECT * FROM order_items WHERE order_id = ?`, [req.params.id]
  );
  res.json({ order: rows[0], items });
}));

// POST /api/orders  → checkout
router.post('/', authRequired, ah(async (req, res) => {
  const {
    payment_method = 'cod',
    coupon_code,
    shipping_full_name,
    shipping_phone,
    shipping_governorate,
    shipping_city,
    shipping_street,
    shipping_building,
    shipping_apartment,
    shipping_notes,
    payment_proof_url,
    payment_reference,
    payment_notes,
  } = req.body;

  if (!shipping_full_name || !shipping_phone || !shipping_governorate || !shipping_city || !shipping_street) {
    return res.status(400).json({ error: 'Missing shipping fields' });
  }

  // Electronic methods require proof of transfer
  const requiresProof = ['fawry','paymob','vodafone_cash','instapay','card'].includes(payment_method);
  if (requiresProof && !payment_proof_url) {
    return res.status(400).json({ error: 'Payment proof (transfer screenshot) is required' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Lock cart and get items with product/variant info
    const [items] = await conn.query(
      `SELECT ci.id AS cart_id, ci.product_id, ci.variant_id, ci.quantity,
              p.name_ar, p.name_en, p.price,
              v.size, v.color_name_ar, v.color_name_en, v.color_hex, v.stock, v.price_override,
              COALESCE(
                (SELECT url FROM variant_images WHERE product_id = p.id AND color_name_en = v.color_name_en ORDER BY sort_order LIMIT 1),
                (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1)
              ) AS image
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       JOIN product_variants v ON v.id = ci.variant_id
       WHERE ci.user_id = ? FOR UPDATE`,
      [req.user.id]
    );
    if (!items.length) {
      await conn.rollback();
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 2) Validate stock
    for (const it of items) {
      if (it.stock < it.quantity) {
        await conn.rollback();
        return res.status(400).json({ error: `Insufficient stock for ${it.name_en}` });
      }
    }

    // 3) Subtotal
    const subtotal = items.reduce((s, it) => {
      const p = Number(it.price_override ?? it.price);
      return s + p * it.quantity;
    }, 0);

    // 4) Coupon
    let discount = 0;
    let appliedCode = null;
    if (coupon_code) {
      const [crows] = await conn.query(
        `SELECT * FROM coupons WHERE code = ? AND is_active = 1
         AND (starts_at IS NULL OR starts_at <= NOW())
         AND (expires_at IS NULL OR expires_at >= NOW())`,
        [coupon_code.trim().toUpperCase()]
      );
      const c = crows[0];
      if (c && subtotal >= Number(c.min_order)) {
        discount = c.type === 'percentage' ? (subtotal * Number(c.value) / 100) : Number(c.value);
        if (c.max_discount) discount = Math.min(discount, Number(c.max_discount));
        appliedCode = c.code;
        await conn.query('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?', [c.id]);
      }
    }

    // 5) Shipping
    const [setRows] = await conn.query(`SELECT \`key\`, \`value\` FROM settings WHERE \`key\` IN ('default_shipping_fee','free_shipping_threshold')`);
    const settings = Object.fromEntries(setRows.map(s => [s.key, s.value]));
    const baseShipping = Number(settings.default_shipping_fee || 60);
    const freeThreshold = Number(settings.free_shipping_threshold || 1500);
    const shipping_fee = subtotal - discount >= freeThreshold ? 0 : baseShipping;

    const total = Math.max(0, subtotal - discount + shipping_fee);

    // 6) Create order
    // For COD: unpaid until delivery. For electronic with proof: pending verification (unpaid → admin approves).
    const initialPaymentStatus = payment_method === 'cod' ? 'unpaid'
                               : requiresProof ? 'unpaid'   // pending admin verification of transfer screenshot
                               : 'paid';
    const [or] = await conn.query(
      `INSERT INTO orders
       (order_number, user_id, status, payment_method, payment_status, subtotal, shipping_fee, discount, tax, total, coupon_code,
        shipping_full_name, shipping_phone, shipping_governorate, shipping_city, shipping_street,
        shipping_building, shipping_apartment, shipping_notes,
        payment_proof_url, payment_reference, payment_notes)
       VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        genOrderNumber(), req.user.id, payment_method,
        initialPaymentStatus,
        subtotal, shipping_fee, discount, total, appliedCode,
        shipping_full_name, shipping_phone, shipping_governorate, shipping_city, shipping_street,
        shipping_building || null, shipping_apartment || null, shipping_notes || null,
        payment_proof_url || null, payment_reference || null, payment_notes || null
      ]
    );
    const orderId = or.insertId;

    // 7) Insert items + decrement stock + bump sales count
    for (const it of items) {
      const unitPrice = Number(it.price_override ?? it.price);
      const lineSub = unitPrice * it.quantity;
      await conn.query(
        `INSERT INTO order_items
         (order_id, product_id, variant_id, product_name_ar, product_name_en, size,
          color_name_ar, color_name_en, color_hex, image_url, unit_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, it.product_id, it.variant_id, it.name_ar, it.name_en, it.size,
         it.color_name_ar, it.color_name_en, it.color_hex, it.image, unitPrice, it.quantity, lineSub]
      );
      await conn.query('UPDATE product_variants SET stock = stock - ? WHERE id = ?', [it.quantity, it.variant_id]);
      await conn.query('UPDATE products SET sales_count = sales_count + ? WHERE id = ?', [it.quantity, it.product_id]);
    }

    // 8) Clear cart
    await conn.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    await conn.commit();

    const [orderRows] = await conn.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const [orderItems] = await conn.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    res.status(201).json({ order: orderRows[0], items: orderItems });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}));

export default router;
