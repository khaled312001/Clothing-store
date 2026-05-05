import { Router } from 'express';
import pool from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', authRequired, ah(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
    [req.user.id]
  );
  res.json({ addresses: rows });
}));

router.post('/', authRequired, ah(async (req, res) => {
  const a = req.body;
  const required = ['full_name','phone','governorate','city','street'];
  for (const f of required) if (!a[f]) return res.status(400).json({ error: `${f} required` });

  if (a.is_default) {
    await pool.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
  }

  const [r] = await pool.query(
    `INSERT INTO addresses
     (user_id, full_name, phone, governorate, city, street, building, apartment, postal_code, notes, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, a.full_name, a.phone, a.governorate, a.city, a.street,
     a.building || null, a.apartment || null, a.postal_code || null, a.notes || null, a.is_default ? 1 : 0]
  );
  res.json({ id: r.insertId });
}));

router.delete('/:id', authRequired, ah(async (req, res) => {
  await pool.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ ok: true });
}));

export default router;
