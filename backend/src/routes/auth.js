import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import pool from '../db.js';
import { signToken, authRequired } from '../middleware/auth.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

router.post('/register',
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('phone').optional().isString(),
  ah(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { name, email, password, phone } = req.body;
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (rows.length) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.query(
      'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, "customer")',
      [name, email.toLowerCase(), phone || null, hash]
    );
    const token = signToken({ id: r.insertId, email: email.toLowerCase(), role: 'customer', name });
    res.status(201).json({
      token,
      user: { id: r.insertId, name, email: email.toLowerCase(), phone, role: 'customer' }
    });
  })
);

router.post('/login',
  body('email').isEmail(),
  body('password').isString(),
  ah(async (req, res) => {
    const { email, password } = req.body;
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, password_hash, role, is_active FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    const user = rows[0];
    if (!user || !user.is_active) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  })
);

router.get('/me', authRequired, ah(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
    [req.user.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'User not found' });
  res.json({ user: rows[0] });
}));

router.put('/me', authRequired,
  body('name').optional().isString(),
  body('phone').optional().isString(),
  ah(async (req, res) => {
    const { name, phone } = req.body;
    await pool.query(
      'UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?',
      [name, phone, req.user.id]
    );
    res.json({ ok: true });
  })
);

export default router;
