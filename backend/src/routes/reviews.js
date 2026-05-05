import { Router } from 'express';
import pool from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

router.post('/', authRequired, ah(async (req, res) => {
  const { product_id, rating, title, comment } = req.body;
  if (!product_id || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid review data' });
  }
  await pool.query(
    `INSERT INTO reviews (product_id, user_id, rating, title, comment) VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating), title = VALUES(title), comment = VALUES(comment)`,
    [product_id, req.user.id, rating, title || null, comment || null]
  );
  // Recompute aggregates
  await pool.query(`
    UPDATE products p
    SET rating_avg = (SELECT COALESCE(AVG(rating),0) FROM reviews WHERE product_id = p.id AND is_approved = 1),
        rating_count = (SELECT COUNT(*) FROM reviews WHERE product_id = p.id AND is_approved = 1)
    WHERE p.id = ?`, [product_id]);

  res.json({ ok: true });
}));

export default router;
