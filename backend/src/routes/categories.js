import { Router } from 'express';
import pool from '../db.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

// GET /api/categories  →  tree of categories
router.get('/', ah(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT id, parent_id, slug, name_ar, name_en, image_url, icon, sort_order
     FROM categories WHERE is_active = 1 ORDER BY sort_order, id`
  );
  const map = new Map(rows.map(c => [c.id, { ...c, children: [] }]));
  const roots = [];
  for (const c of map.values()) {
    if (c.parent_id) map.get(c.parent_id)?.children.push(c);
    else roots.push(c);
  }
  res.json({ categories: roots });
}));

// GET /api/categories/:slug
router.get('/:slug', ah(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT * FROM categories WHERE slug = ? AND is_active = 1`,
    [req.params.slug]
  );
  if (!rows.length) return res.status(404).json({ error: 'Category not found' });
  const cat = rows[0];

  const [subs] = await pool.query(
    `SELECT id, slug, name_ar, name_en, image_url, icon FROM categories WHERE parent_id = ? AND is_active = 1 ORDER BY sort_order`,
    [cat.id]
  );
  res.json({ category: { ...cat, children: subs } });
}));

export default router;
