import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import authRoutes       from './routes/auth.js';
import categoryRoutes   from './routes/categories.js';
import productRoutes    from './routes/products.js';
import cartRoutes       from './routes/cart.js';
import wishlistRoutes   from './routes/wishlist.js';
import addressRoutes    from './routes/addresses.js';
import orderRoutes      from './routes/orders.js';
import couponRoutes     from './routes/coupons.js';
import reviewRoutes     from './routes/reviews.js';
import adminRoutes      from './routes/admin.js';
import settingRoutes    from './routes/settings.js';
import uploadRoutes     from './routes/uploads.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// ---- middleware ----
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// generous rate limit (storefront browse is read-heavy)
app.use('/api/', rateLimit({ windowMs: 60_000, max: 300 }));

// ---- routes ----
app.get('/api/health', (_req, res) => res.json({ ok: true, name: 'Barmagly Fashion API', time: new Date().toISOString() }));

// Static for uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
  maxAge: '7d',
  index: false,
}));

app.use('/api/auth',          authRoutes);
app.use('/api/categories',    categoryRoutes);
app.use('/api/products',      productRoutes);
app.use('/api/cart',          cartRoutes);
app.use('/api/wishlist',      wishlistRoutes);
app.use('/api/addresses',     addressRoutes);
app.use('/api/orders',        orderRoutes);
app.use('/api/coupons',       couponRoutes);
app.use('/api/reviews',       reviewRoutes);
// Uploads — both customers (payment proofs) and admins (product photos) can use
app.use('/api/uploads',       uploadRoutes);
app.use('/api/admin/uploads', uploadRoutes);  // back-compat for existing admin form
app.use('/api/admin',         adminRoutes);
app.use('/api/settings',      settingRoutes);

// ---- 404 ----
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// ---- error handler ----
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  console.error('[ERR]', err);
  res.status(status).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Barmagly API listening on http://localhost:${PORT}\n`);
});
