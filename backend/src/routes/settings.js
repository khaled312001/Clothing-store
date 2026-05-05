import { Router } from 'express';
import pool from '../db.js';
import { ah } from '../utils/asyncHandler.js';
import { authRequired, adminRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', ah(async (_req, res) => {
  const [rows] = await pool.query(`SELECT \`key\`, \`value\` FROM settings`);
  res.json({ settings: Object.fromEntries(rows.map(r => [r.key, r.value])) });
}));

router.put('/', authRequired, adminRequired, ah(async (req, res) => {
  const updates = req.body || {};
  for (const [key, value] of Object.entries(updates)) {
    await pool.query(
      `INSERT INTO settings (\`key\`, \`value\`) VALUES (?, ?) ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)`,
      [key, String(value)]
    );
  }
  res.json({ ok: true });
}));

export default router;
