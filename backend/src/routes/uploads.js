import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { authRequired } from '../middleware/auth.js';
import { ah } from '../utils/asyncHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'products');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = new Set(['image/jpeg','image/png','image/webp','image/gif','image/avif']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safe = ext.replace(/[^a-z0-9.]/g, '');
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB per file
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const router = Router();
// Any logged-in user can upload (customers upload payment proofs, admins upload product photos)
router.use(authRequired);

// POST /api/uploads — multipart/form-data, field name: "files" (multiple)
router.post('/', upload.array('files', 10), ah(async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: 'No files received' });
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  const host  = req.headers['x-forwarded-host']  || req.headers.host;
  const base  = `${proto}://${host}`;
  const urls = req.files.map(f => `${base}/uploads/products/${f.filename}`);
  res.status(201).json({ urls });
}));

export default router;
