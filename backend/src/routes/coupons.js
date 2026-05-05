import { Router } from 'express';
import pool from '../db.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

// POST /api/coupons/validate { code, subtotal }
router.post('/validate', ah(async (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ error: 'code required' });

  const [rows] = await pool.query(
    `SELECT * FROM coupons WHERE code = ? AND is_active = 1
     AND (starts_at IS NULL OR starts_at <= NOW())
     AND (expires_at IS NULL OR expires_at >= NOW())`,
    [code.trim().toUpperCase()]
  );
  const c = rows[0];
  if (!c) return res.status(404).json({ error: 'Invalid or expired coupon' });
  if (c.usage_limit && c.used_count >= c.usage_limit) return res.status(400).json({ error: 'Coupon usage limit reached' });
  if (Number(subtotal) < Number(c.min_order)) {
    return res.status(400).json({ error: `Minimum order is ${c.min_order} EGP` });
  }

  let discount = c.type === 'percentage'
    ? (Number(subtotal) * Number(c.value) / 100)
    : Number(c.value);
  if (c.max_discount) discount = Math.min(discount, Number(c.max_discount));
  discount = Math.round(discount * 100) / 100;

  res.json({
    coupon: {
      code: c.code,
      type: c.type,
      value: Number(c.value),
      discount,
      description_ar: c.description_ar,
      description_en: c.description_en
    }
  });
}));

export default router;
