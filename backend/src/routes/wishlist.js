import { Router } from 'express';
import pool from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', authRequired, ah(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT wi.id, wi.product_id, p.slug, p.name_ar, p.name_en, p.price, p.compare_at_price, p.rating_avg,
            (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) AS image
     FROM wishlist_items wi JOIN products p ON p.id = wi.product_id
     WHERE wi.user_id = ? ORDER BY wi.added_at DESC`,
    [req.user.id]
  );
  res.json({ items: rows });
}));

router.post('/', authRequired, ah(async (req, res) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ error: 'product_id required' });
  await pool.query(
    `INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)`,
    [req.user.id, product_id]
  );
  res.json({ ok: true });
}));

router.delete('/:productId', authRequired, ah(async (req, res) => {
  await pool.query('DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?',
    [req.user.id, req.params.productId]);
  res.json({ ok: true });
}));

export default router;
