import { Router } from 'express';
import pool from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', authRequired, ah(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT ci.id, ci.product_id, ci.variant_id, ci.quantity,
            p.slug, p.name_ar, p.name_en, p.price, p.compare_at_price,
            v.size, v.color_name_ar, v.color_name_en, v.color_hex, v.stock,
            (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) AS image
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     JOIN product_variants v ON v.id = ci.variant_id
     WHERE ci.user_id = ? ORDER BY ci.added_at DESC`,
    [req.user.id]
  );
  const subtotal = rows.reduce((s, it) => s + Number(it.price) * it.quantity, 0);
  res.json({ items: rows, subtotal, count: rows.reduce((s, it) => s + it.quantity, 0) });
}));

router.post('/', authRequired, ah(async (req, res) => {
  const { variant_id, quantity = 1 } = req.body;
  if (!variant_id) return res.status(400).json({ error: 'variant_id required' });

  const [vrows] = await pool.query('SELECT id, product_id, stock FROM product_variants WHERE id = ?', [variant_id]);
  if (!vrows.length) return res.status(404).json({ error: 'Variant not found' });
  if (vrows[0].stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });

  await pool.query(
    `INSERT INTO cart_items (user_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    [req.user.id, vrows[0].product_id, variant_id, quantity]
  );
  res.json({ ok: true });
}));

router.put('/:id', authRequired, ah(async (req, res) => {
  const { quantity } = req.body;
  if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ error: 'Invalid quantity' });
  const [r] = await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
    [quantity, req.params.id, req.user.id]);
  if (!r.affectedRows) return res.status(404).json({ error: 'Item not found' });
  res.json({ ok: true });
}));

router.delete('/:id', authRequired, ah(async (req, res) => {
  await pool.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ ok: true });
}));

router.delete('/', authRequired, ah(async (req, res) => {
  await pool.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
  res.json({ ok: true });
}));

// POST /api/cart/merge  → bulk merge guest cart on login
router.post('/merge', authRequired, ah(async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  for (const it of items) {
    if (!it.variant_id || !it.quantity) continue;
    const [vrows] = await pool.query('SELECT product_id, stock FROM product_variants WHERE id = ?', [it.variant_id]);
    if (!vrows.length) continue;
    const qty = Math.min(it.quantity, vrows[0].stock);
    if (qty < 1) continue;
    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [req.user.id, vrows[0].product_id, it.variant_id, qty]
    );
  }
  res.json({ ok: true });
}));

export default router;
