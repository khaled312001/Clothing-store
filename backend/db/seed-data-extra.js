// Additional curated products with verified subject-matching images

const C = {
  black: { ar: 'أسود', en: 'Black', hex: '#0f0f0f' },
  white: { ar: 'أبيض', en: 'White', hex: '#ffffff' },
  navy:  { ar: 'كحلي', en: 'Navy', hex: '#1e3a5f' },
  gray:  { ar: 'رمادي', en: 'Gray', hex: '#6b7280' },
  red:   { ar: 'أحمر', en: 'Red', hex: '#dc2626' },
  blue:  { ar: 'أزرق', en: 'Blue', hex: '#2563eb' },
  pink:  { ar: 'وردي', en: 'Pink', hex: '#ec4899' },
  green: { ar: 'أخضر', en: 'Green', hex: '#16a34a' },
  beige: { ar: 'بيج', en: 'Beige', hex: '#d6c8a8' },
  brown: { ar: 'بني', en: 'Brown', hex: '#7c4a2a' },
  purple:{ ar: 'بنفسجي', en: 'Purple', hex: '#7c3aed' },
  yellow:{ ar: 'أصفر', en: 'Yellow', hex: '#eab308' },
  olive: { ar: 'زيتي', en: 'Olive', hex: '#556b2f' },
};

function variants(sizes, colors, baseStock = 14) {
  const out = [];
  for (const s of sizes) for (const c of colors) {
    out.push({ size: s, color_ar: c.ar, color_en: c.en, color_hex: c.hex, stock: baseStock + Math.floor(Math.random() * 20) });
  }
  return out;
}

const Q = '&q=85';

export const extraProducts = [
  // ===== MORE KIDS-BOYS =====
  {
    category_slug: 'kids-boys', sku: 'AURA-KB-004', brand: 'AURA Kids',
    name_ar: 'قميص أولاد كاجوال', name_en: 'Boys Casual Shirt',
    desc_ar: 'قميص كاجوال للأولاد بألوان متعددة، مناسب للمدرسة والمناسبات.', desc_en: 'Casual shirt for boys in multiple colors. Great for school and events.',
    material_ar: 'قطن', material_en: 'Cotton',
    gender: 'kids', age_group: 'kid', price: 299, compare: 399, featured: 0, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=900' + Q,
      'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=900' + Q,
    ],
    variants: variants(['4Y','6Y','8Y','10Y'], [C.white, C.blue, C.beige]),
  },
  {
    category_slug: 'kids-boys', sku: 'AURA-KB-005', brand: 'AURA Kids',
    name_ar: 'شورت أولاد كاجوال', name_en: 'Boys Casual Shorts',
    desc_ar: 'شورت أولاد قطن مريح للاستخدام اليومي.', desc_en: 'Comfortable cotton shorts for everyday use.',
    material_ar: 'قطن مرن', material_en: 'Stretch Cotton',
    gender: 'kids', age_group: 'kid', price: 199, compare: 250, featured: 0, isNew: 0,
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900' + Q],
    variants: variants(['4Y','6Y','8Y','10Y','12Y'], [C.navy, C.olive, C.gray]),
  },

  // ===== MORE KIDS-GIRLS =====
  {
    category_slug: 'kids-girls', sku: 'AURA-KG-004', brand: 'AURA Kids',
    name_ar: 'بدلة بنات قطعتين', name_en: 'Girls Two-Piece Set',
    desc_ar: 'طقم بنات (تيشيرت + لجنز) بألوان جذابة.', desc_en: 'Girls 2-piece set (top + leggings) in attractive colors.',
    material_ar: 'قطن', material_en: 'Cotton',
    gender: 'kids', age_group: 'kid', price: 399, compare: 499, featured: 1, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900' + Q,
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=900' + Q,
    ],
    variants: variants(['4Y','6Y','8Y','10Y'], [C.pink, C.purple, C.white]),
  },
  {
    category_slug: 'kids-girls', sku: 'AURA-KG-005', brand: 'AURA Kids',
    name_ar: 'فستان أنيق بنات', name_en: 'Girls Elegant Dress',
    desc_ar: 'فستان بنات أنيق للحفلات والمناسبات الخاصة.', desc_en: 'Elegant dress for girls — parties and special occasions.',
    material_ar: 'تول وساتان', material_en: 'Tulle & Satin',
    gender: 'kids', age_group: 'kid', price: 549, compare: 750, featured: 1, isNew: 0,
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=900' + Q,
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900' + Q,
    ],
    variants: variants(['4Y','6Y','8Y','10Y'], [C.pink, C.white, C.purple]),
  },

  // ===== MORE NEWBORN =====
  {
    category_slug: 'kids-newborn', sku: 'AURA-KN-003', brand: 'AURA Baby',
    name_ar: 'بطانية رضع قطن ناعم', name_en: 'Newborn Soft Cotton Blanket',
    desc_ar: 'بطانية ناعمة جداً للرضع، آمنة ومريحة.', desc_en: 'Ultra-soft blanket for babies, safe and cozy.',
    material_ar: 'قطن عضوي', material_en: 'Organic Cotton',
    gender: 'kids', age_group: 'newborn', price: 299, compare: 399, featured: 0, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=900' + Q,
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=900' + Q,
    ],
    variants: [
      { size: 'OneSize', color_ar: C.pink.ar, color_en: C.pink.en, color_hex: C.pink.hex, stock: 22 },
      { size: 'OneSize', color_ar: C.blue.ar, color_en: C.blue.en, color_hex: C.blue.hex, stock: 25 },
      { size: 'OneSize', color_ar: C.white.ar, color_en: C.white.en, color_hex: C.white.hex, stock: 30 },
    ],
  },

  // ===== MORE WOMEN-CASUAL =====
  {
    category_slug: 'women-casual', sku: 'AURA-WC-005', brand: 'AURA',
    name_ar: 'تنورة حريمي بليسيه', name_en: 'Women Pleated Skirt',
    desc_ar: 'تنورة بليسيه أنيقة للسيدات، خامة ناعمة ومريحة.', desc_en: 'Elegant pleated skirt for women — soft, comfortable fabric.',
    material_ar: 'بوليستر', material_en: 'Polyester',
    gender: 'women', age_group: 'adult', price: 399, compare: 549, featured: 1, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=900' + Q,
      'https://images.unsplash.com/photo-1485518882345-15568b007407?w=900' + Q,
    ],
    variants: variants(['S','M','L','XL'], [C.beige, C.black, C.navy]),
  },
  {
    category_slug: 'women-casual', sku: 'AURA-WC-006', brand: 'AURA',
    name_ar: 'بلوزة حريمي صيفي', name_en: 'Women Summer Top',
    desc_ar: 'بلوزة صيفية خفيفة بألوان مبهجة.', desc_en: 'Light summer top with vibrant colors.',
    material_ar: 'فيسكوز', material_en: 'Viscose',
    gender: 'women', age_group: 'adult', price: 349, compare: 449, featured: 0, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=900' + Q,
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900' + Q,
    ],
    variants: variants(['S','M','L','XL'], [C.yellow, C.pink, C.white, C.green]),
  },
  {
    category_slug: 'women-casual', sku: 'AURA-WC-007', brand: 'Denim Co',
    name_ar: 'جاكيت جينز حريمي', name_en: 'Women Denim Jacket',
    desc_ar: 'جاكيت جينز حريمي كلاسيكي يناسب كل الإطلالات.', desc_en: 'Classic denim jacket — pairs with every outfit.',
    material_ar: 'دنيم', material_en: 'Denim',
    gender: 'women', age_group: 'adult', price: 799, compare: 1099, featured: 1, isNew: 0,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900' + Q,
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900' + Q,
    ],
    variants: variants(['S','M','L','XL'], [C.blue, C.navy, C.black]),
  },

  // ===== MORE WOMEN-EVENING =====
  {
    category_slug: 'women-evening', sku: 'AURA-WE-003', brand: 'AURA Couture',
    name_ar: 'فستان سهرة ميدي', name_en: 'Midi Evening Dress',
    desc_ar: 'فستان سهرة بطول ميدي أنيق ومعاصر.', desc_en: 'Elegant midi-length evening dress, contemporary cut.',
    material_ar: 'كريب', material_en: 'Crepe',
    gender: 'women', age_group: 'adult', price: 1499, compare: 1999, featured: 0, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900' + Q,
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900' + Q,
    ],
    variants: variants(['S','M','L','XL'], [C.black, C.red, C.navy, C.purple]),
  },

  // ===== MORE WOMEN-SPORT =====
  {
    category_slug: 'women-sport', sku: 'AURA-WS-003', brand: 'AURA Sport',
    name_ar: 'حمالة صدر رياضية', name_en: 'Sports Bra',
    desc_ar: 'حمالة صدر رياضية بدعم متوسط، مثالية لليوجا والرياضات الخفيفة.', desc_en: 'Medium-support sports bra, perfect for yoga and light workouts.',
    material_ar: 'لايكرا', material_en: 'Lycra',
    gender: 'women', age_group: 'adult', price: 249, compare: 349, featured: 0, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900' + Q,
    ],
    variants: variants(['S','M','L'], [C.black, C.pink, C.white]),
  },
  {
    category_slug: 'women-sport', sku: 'AURA-WS-004', brand: 'AURA Sport',
    name_ar: 'حذاء جري حريمي', name_en: 'Women Running Shoes',
    desc_ar: 'حذاء جري خفيف ومريح بتقنية امتصاص الصدمات.', desc_en: 'Lightweight running shoes with shock-absorbing tech.',
    material_ar: 'mesh + EVA', material_en: 'Mesh + EVA',
    gender: 'women', age_group: 'adult', price: 999, compare: 1399, featured: 1, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900' + Q,
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900' + Q,
    ],
    variants: variants(['36','37','38','39','40','41'], [C.white, C.pink, C.gray]),
  },

  // ===== MORE WOMEN-ACCESSORIES =====
  {
    category_slug: 'women-accessories', sku: 'AURA-WA-003', brand: 'AURA Accessories',
    name_ar: 'سكارف حريري', name_en: 'Silk Scarf',
    desc_ar: 'سكارف حريري بطباعة فاخرة يضيف لمسة أنيقة لإطلالتك.', desc_en: 'Silk scarf with luxury print — adds elegance to any outfit.',
    material_ar: 'حرير', material_en: 'Silk',
    gender: 'women', age_group: 'adult', price: 349, compare: 499, featured: 0, isNew: 0,
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=900' + Q],
    variants: [
      { size: 'OneSize', color_ar: C.red.ar, color_en: C.red.en, color_hex: C.red.hex, stock: 18 },
      { size: 'OneSize', color_ar: C.purple.ar, color_en: C.purple.en, color_hex: C.purple.hex, stock: 20 },
      { size: 'OneSize', color_ar: C.beige.ar, color_en: C.beige.en, color_hex: C.beige.hex, stock: 15 },
    ],
  },
  {
    category_slug: 'women-accessories', sku: 'AURA-WA-004', brand: 'AURA Accessories',
    name_ar: 'حزام جلدي حريمي', name_en: 'Women Leather Belt',
    desc_ar: 'حزام جلد طبيعي بإبزيم معدني فاخر.', desc_en: 'Genuine leather belt with premium metal buckle.',
    material_ar: 'جلد طبيعي', material_en: 'Genuine Leather',
    gender: 'women', age_group: 'adult', price: 299, compare: 449, featured: 0, isNew: 0,
    images: ['https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=900' + Q],
    variants: [
      { size: 'S', color_ar: C.black.ar, color_en: C.black.en, color_hex: C.black.hex, stock: 25 },
      { size: 'M', color_ar: C.black.ar, color_en: C.black.en, color_hex: C.black.hex, stock: 30 },
      { size: 'L', color_ar: C.black.ar, color_en: C.black.en, color_hex: C.black.hex, stock: 20 },
      { size: 'S', color_ar: C.brown.ar, color_en: C.brown.en, color_hex: C.brown.hex, stock: 22 },
      { size: 'M', color_ar: C.brown.ar, color_en: C.brown.en, color_hex: C.brown.hex, stock: 18 },
    ],
  },

  // ===== MORE MEN-TSHIRTS =====
  {
    category_slug: 'men-tshirts', sku: 'AURA-MT-004', brand: 'AURA Men',
    name_ar: 'تيشيرت رجالي مطبوع', name_en: 'Men Graphic T-Shirt',
    desc_ar: 'تيشيرت رجالي بطبعة عصرية لإطلالة كاجوال جذابة.', desc_en: 'Graphic-print T-shirt for a stylish casual look.',
    material_ar: 'قطن', material_en: 'Cotton',
    gender: 'men', age_group: 'adult', price: 279, compare: 379, featured: 0, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=900' + Q,
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900' + Q,
    ],
    variants: variants(['S','M','L','XL','XXL'], [C.black, C.white, C.gray]),
  },
  {
    category_slug: 'men-tshirts', sku: 'AURA-MT-005', brand: 'AURA Men',
    name_ar: 'تيشيرت رجالي V-Neck', name_en: 'Men V-Neck T-Shirt',
    desc_ar: 'تيشيرت رجالي بياقة V أنيقة، خامة قطنية ناعمة.', desc_en: 'V-neck T-shirt with smooth cotton.',
    material_ar: 'قطن', material_en: 'Cotton',
    gender: 'men', age_group: 'adult', price: 229, compare: 329, featured: 0, isNew: 0,
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900' + Q],
    variants: variants(['S','M','L','XL'], [C.white, C.black, C.navy, C.olive]),
  },

  // ===== MORE MEN-SHIRTS =====
  {
    category_slug: 'men-shirts', sku: 'AURA-MS-003', brand: 'AURA Casual',
    name_ar: 'قميص رجالي كتان', name_en: 'Men Linen Shirt',
    desc_ar: 'قميص رجالي كتان خفيف للصيف، يوفر تهوية ممتازة.', desc_en: 'Lightweight linen shirt — excellent breathability.',
    material_ar: 'كتان', material_en: 'Linen',
    gender: 'men', age_group: 'adult', price: 549, compare: 749, featured: 1, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=900' + Q,
      'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=900' + Q,
    ],
    variants: variants(['S','M','L','XL','XXL'], [C.white, C.beige, C.blue]),
  },

  // ===== MORE MEN-PANTS =====
  {
    category_slug: 'men-pants', sku: 'AURA-MP-004', brand: 'AURA Men',
    name_ar: 'شورت رجالي كاجوال', name_en: 'Men Casual Shorts',
    desc_ar: 'شورت رجالي مريح للصيف والخروجات.', desc_en: 'Comfortable shorts for summer and outings.',
    material_ar: 'قطن', material_en: 'Cotton',
    gender: 'men', age_group: 'adult', price: 299, compare: 399, featured: 0, isNew: 0,
    images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=900' + Q],
    variants: variants(['S','M','L','XL','XXL'], [C.beige, C.olive, C.navy, C.gray]),
  },

  // ===== MORE MEN-JACKETS =====
  {
    category_slug: 'men-jackets', sku: 'AURA-MJ-004', brand: 'AURA Outerwear',
    name_ar: 'كنزة رجالي بدون قلنسوة', name_en: 'Men Crew Sweatshirt',
    desc_ar: 'كنزة رجالي كلاسيكية بياقة مستديرة.', desc_en: 'Classic crew-neck sweatshirt.',
    material_ar: 'قطن سميك', material_en: 'Heavy Cotton',
    gender: 'men', age_group: 'adult', price: 449, compare: 599, featured: 0, isNew: 1,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900' + Q],
    variants: variants(['S','M','L','XL','XXL'], [C.gray, C.black, C.beige, C.navy]),
  },
  {
    category_slug: 'men-jackets', sku: 'AURA-MJ-005', brand: 'AURA Outerwear',
    name_ar: 'كاب رجالي', name_en: 'Men Cap',
    desc_ar: 'كاب رجالي عصري بتصميم بسيط وأنيق.', desc_en: 'Modern cap with simple, elegant design.',
    material_ar: 'قطن', material_en: 'Cotton',
    gender: 'men', age_group: 'adult', price: 199, compare: 280, featured: 0, isNew: 0,
    images: ['https://images.unsplash.com/photo-1521369909029-2afed882baee?w=900' + Q],
    variants: [
      { size: 'OneSize', color_ar: C.black.ar, color_en: C.black.en, color_hex: C.black.hex, stock: 35 },
      { size: 'OneSize', color_ar: C.navy.ar, color_en: C.navy.en, color_hex: C.navy.hex, stock: 28 },
      { size: 'OneSize', color_ar: C.beige.ar, color_en: C.beige.en, color_hex: C.beige.hex, stock: 22 },
    ],
  },
];

export const extraReviews = [
  { product_sku: 'AURA-WC-005', rating: 5, title: 'تنورة جميلة جداً', comment: 'الخامة ممتازة والقصة مظبوطة، اشتريت 2 منها بألوان مختلفة!' },
  { product_sku: 'AURA-WC-006', rating: 4, title: 'Light & comfy',  comment: 'Perfect for hot summer days, lovely colors.' },
  { product_sku: 'AURA-WC-007', rating: 5, title: 'الجاكيت كلاسيك',  comment: 'جاكيت جينز ممتاز، مناسب لكل الإطلالات.' },
  { product_sku: 'AURA-MT-004', rating: 5, title: 'Cool design',     comment: 'The graphic print is unique and the cotton feels great.' },
  { product_sku: 'AURA-MS-003', rating: 5, title: 'مثالي للصيف',     comment: 'القميص خفيف جداً ومريح في الجو الحار، شكراً AURA!' },
  { product_sku: 'AURA-MP-002', rating: 4, title: 'بنطلون أنيق',     comment: 'الشينو خامته كويسة جداً، بس المقاس جاء واسع شوية.' },
  { product_sku: 'AURA-MJ-001', rating: 5, title: 'Premium quality', comment: 'Real leather, beautiful stitching, amazing fit.' },
  { product_sku: 'AURA-WS-004', rating: 5, title: 'حذاء مريح جداً',  comment: 'بستخدمه في الجيم والمشي، مريح جداً وخفيف.' },
  { product_sku: 'AURA-KG-004', rating: 5, title: 'بنتي عجبها',      comment: 'الطقم لطيف جداً، الألوان حلوة والخامة ناعمة.' },
  { product_sku: 'AURA-WE-003', rating: 5, title: 'فستان رائع',       comment: 'لبسته في عيد ميلاد صديقتي، تصميم راقي وأنيق.' },
  { product_sku: 'AURA-WA-001', rating: 5, title: 'Beautiful bag',   comment: 'Real leather, fits everything, very practical.' },
  { product_sku: 'AURA-MT-002', rating: 4, title: 'بولو ممتاز',       comment: 'البولو خامته فاخرة، اشتريت كذا لون.' },
];
