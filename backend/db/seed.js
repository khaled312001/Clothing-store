import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import pool from '../src/db.js';
import { categories, products, coupons, reviews } from './seed-data.js';

dotenv.config();

async function clearAll(conn) {
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');
  const tables = [
    'order_items','orders','cart_items','wishlist_items','reviews',
    'coupons','addresses','product_variants','product_images','products',
    'categories','users','settings'
  ];
  for (const t of tables) await conn.query(`TRUNCATE TABLE \`${t}\``);
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');
}

async function seedUsers(conn) {
  const adminHash    = await bcrypt.hash('Admin@12345', 10);
  const customerHash = await bcrypt.hash('Customer@123', 10);

  await conn.query(
    `INSERT INTO users (name, email, phone, password_hash, role) VALUES
     (?, ?, ?, ?, 'admin'),
     (?, ?, ?, ?, 'customer'),
     (?, ?, ?, ?, 'customer'),
     (?, ?, ?, ?, 'customer')`,
    [
      'مدير برمجلي',          'admin@barmagly.tech',    '+201010254819', adminHash,
      'محمد أحمد',             'customer@example.com',   '+201112223344', customerHash,
      'سارة علي',              'sara@example.com',       '+201100001111', customerHash,
      'Khaled Hassan',         'khaled@example.com',     '+201500001234', customerHash,
    ]
  );
  const [rows] = await conn.query(`SELECT id, email FROM users`);
  return Object.fromEntries(rows.map(r => [r.email, r.id]));
}

async function seedCategories(conn) {
  const idMap = {};
  // Insert top-level first, then children
  const top = categories.filter(c => !c.parent);
  const children = categories.filter(c => c.parent);

  for (const c of top) {
    const [r] = await conn.query(
      `INSERT INTO categories (slug, name_ar, name_en, image_url, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
      [c.slug, c.name_ar, c.name_en, c.image, c.icon, c.sort]
    );
    idMap[c.slug] = r.insertId;
  }
  for (const c of children) {
    const [r] = await conn.query(
      `INSERT INTO categories (parent_id, slug, name_ar, name_en, image_url, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [idMap[c.parent], c.slug, c.name_ar, c.name_en, c.image, c.icon, c.sort]
    );
    idMap[c.slug] = r.insertId;
  }
  return idMap;
}

function makeSlug(en) {
  return en.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

async function seedProducts(conn, catMap) {
  const productIds = {};
  for (const p of products) {
    const slug = `${makeSlug(p.name_en)}-${p.sku.toLowerCase()}`;
    const [r] = await conn.query(
      `INSERT INTO products
       (category_id, slug, sku, name_ar, name_en, description_ar, description_en,
        brand, material_ar, material_en, gender, age_group, price, compare_at_price,
        is_featured, is_new)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        catMap[p.category_slug], slug, p.sku, p.name_ar, p.name_en,
        p.desc_ar, p.desc_en, p.brand, p.material_ar, p.material_en,
        p.gender, p.age_group, p.price, p.compare,
        p.featured ? 1 : 0, p.isNew ? 1 : 0
      ]
    );
    const pid = r.insertId;
    productIds[p.sku] = pid;

    // images
    for (let i = 0; i < p.images.length; i++) {
      await conn.query(
        `INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)`,
        [pid, p.images[i], p.name_en, i, i === 0 ? 1 : 0]
      );
    }

    // variants
    for (const v of p.variants) {
      await conn.query(
        `INSERT INTO product_variants (product_id, size, color_name_ar, color_name_en, color_hex, stock) VALUES (?, ?, ?, ?, ?, ?)`,
        [pid, v.size, v.color_ar, v.color_en, v.color_hex, v.stock]
      );
    }
  }
  return productIds;
}

async function seedCoupons(conn) {
  for (const c of coupons) {
    await conn.query(
      `INSERT INTO coupons (code, description_ar, description_en, type, value, min_order, max_discount, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 90 DAY))`,
      [c.code, c.desc_ar, c.desc_en, c.type, c.value, c.min_order, c.max_discount]
    );
  }
}

async function seedReviews(conn, productIds, userIds) {
  const userIdList = [
    userIds['customer@example.com'],
    userIds['sara@example.com'],
    userIds['khaled@example.com'],
  ];
  let i = 0;
  for (const r of reviews) {
    const pid = productIds[r.product_sku];
    if (!pid) continue;
    const uid = userIdList[i % userIdList.length];
    i++;
    try {
      await conn.query(
        `INSERT INTO reviews (product_id, user_id, rating, title, comment) VALUES (?, ?, ?, ?, ?)`,
        [pid, uid, r.rating, r.title, r.comment]
      );
    } catch (e) {
      // ignore duplicate-key (same user reviewed same product twice in seed)
      if (e.code !== 'ER_DUP_ENTRY') throw e;
    }
  }

  // Update rating_avg and rating_count on each product
  await conn.query(`
    UPDATE products p
    LEFT JOIN (
      SELECT product_id, AVG(rating) AS avg_rating, COUNT(*) AS cnt
      FROM reviews WHERE is_approved = 1 GROUP BY product_id
    ) r ON r.product_id = p.id
    SET p.rating_avg = COALESCE(r.avg_rating, 0),
        p.rating_count = COALESCE(r.cnt, 0)
  `);
}

async function seedSampleOrders(conn, productIds, userIds) {
  const customerId = userIds['customer@example.com'];
  const [variants] = await conn.query(
    `SELECT pv.id AS variant_id, pv.product_id, pv.size, pv.color_name_ar, pv.color_name_en, pv.color_hex,
            p.name_ar, p.name_en, p.price,
            (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) AS image
     FROM product_variants pv JOIN products p ON p.id = pv.product_id
     LIMIT 6`
  );

  const orderConfigs = [
    { status: 'delivered', payment_status: 'paid', payment_method: 'card', daysAgo: 25 },
    { status: 'shipped',   payment_status: 'paid', payment_method: 'paymob', daysAgo: 4 },
    { status: 'pending',   payment_status: 'unpaid', payment_method: 'cod', daysAgo: 1 },
  ];

  let orderNum = 1001;
  for (const cfg of orderConfigs) {
    const items = variants.slice(0, 2 + Math.floor(Math.random() * 2));
    const subtotal = items.reduce((s, it) => s + Number(it.price) * 1, 0);
    const shipping = 60;
    const total = subtotal + shipping;

    const [o] = await conn.query(
      `INSERT INTO orders
       (order_number, user_id, status, payment_method, payment_status, subtotal, shipping_fee, discount, tax, total,
        shipping_full_name, shipping_phone, shipping_governorate, shipping_city, shipping_street, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL ? DAY))`,
      [
        `BMG-${orderNum++}`, customerId, cfg.status, cfg.payment_method, cfg.payment_status,
        subtotal, shipping, total,
        'محمد أحمد', '+201112223344', 'القاهرة', 'مدينة نصر', 'شارع مكرم عبيد',
        cfg.daysAgo
      ]
    );

    for (const it of items) {
      await conn.query(
        `INSERT INTO order_items
         (order_id, product_id, variant_id, product_name_ar, product_name_en, size,
          color_name_ar, color_name_en, color_hex, image_url, unit_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
        [
          o.insertId, it.product_id, it.variant_id, it.name_ar, it.name_en, it.size,
          it.color_name_ar, it.color_name_en, it.color_hex, it.image, it.price, it.price
        ]
      );
    }
  }
}

async function seedSettings(conn) {
  const defaults = {
    site_name_ar: 'برمجلي للأزياء',
    site_name_en: 'Barmagly Fashion',
    free_shipping_threshold: '1500',
    default_shipping_fee: '60',
    currency: 'EGP',
    contact_phone: '+201010254819',
    contact_email: 'info@barmagly.tech',
    contact_whatsapp: '201010254819',
  };
  for (const [k, v] of Object.entries(defaults)) {
    await conn.query(`INSERT INTO settings (\`key\`, \`value\`) VALUES (?, ?)`, [k, v]);
  }
}

async function run() {
  const conn = await pool.getConnection();
  try {
    console.log('→ Clearing existing data…');
    await clearAll(conn);

    console.log('→ Seeding users…');
    const userIds = await seedUsers(conn);

    console.log('→ Seeding categories…');
    const catMap = await seedCategories(conn);

    console.log(`→ Seeding ${products.length} products with variants & images…`);
    const productIds = await seedProducts(conn, catMap);

    console.log('→ Seeding coupons…');
    await seedCoupons(conn);

    console.log('→ Seeding reviews…');
    await seedReviews(conn, productIds, userIds);

    console.log('→ Seeding sample orders…');
    await seedSampleOrders(conn, productIds, userIds);

    console.log('→ Seeding settings…');
    await seedSettings(conn);

    console.log('\n✓ Seed completed successfully!\n');
    console.log('  Admin login    →  admin@barmagly.tech / Admin@12345');
    console.log('  Customer login →  customer@example.com / Customer@123\n');
  } finally {
    conn.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error('✗ Seed failed:', err);
  process.exit(1);
});
