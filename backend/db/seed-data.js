// Real product catalog data for Barmagly Fashion Store
// Images sourced from Unsplash (royalty-free)

export const categories = [
  // Top-level
  { slug: 'kids',  name_ar: 'أطفالي',  name_en: 'Kids',   icon: 'baby',  parent: null, sort: 1, image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc480?w=800' },
  { slug: 'women', name_ar: 'حريمي',  name_en: 'Women',  icon: 'woman', parent: null, sort: 2, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800' },
  { slug: 'men',   name_ar: 'رجالي',  name_en: 'Men',    icon: 'man',   parent: null, sort: 3, image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800' },

  // Kids subcategories
  { slug: 'kids-boys',    name_ar: 'أولاد',   name_en: 'Boys',    icon: 'boy',    parent: 'kids', sort: 1, image: 'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=800' },
  { slug: 'kids-girls',   name_ar: 'بنات',    name_en: 'Girls',   icon: 'girl',   parent: 'kids', sort: 2, image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800' },
  { slug: 'kids-newborn', name_ar: 'رضع',     name_en: 'Newborn', icon: 'baby',   parent: 'kids', sort: 3, image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800' },

  // Women subcategories
  { slug: 'women-casual',   name_ar: 'كاجوال',     name_en: 'Casual',     icon: 'shirt',   parent: 'women', sort: 1, image: 'https://images.unsplash.com/photo-1485518882345-15568b007407?w=800' },
  { slug: 'women-evening',  name_ar: 'سواريه',     name_en: 'Evening',    icon: 'dress',   parent: 'women', sort: 2, image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800' },
  { slug: 'women-sport',    name_ar: 'رياضي',      name_en: 'Sport',      icon: 'sport',   parent: 'women', sort: 3, image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800' },
  { slug: 'women-accessories', name_ar: 'إكسسوارات', name_en: 'Accessories', icon: 'bag',  parent: 'women', sort: 4, image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800' },

  // Men subcategories
  { slug: 'men-tshirts', name_ar: 'تيشيرتات',  name_en: 'T-Shirts', icon: 'tshirt', parent: 'men', sort: 1, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' },
  { slug: 'men-shirts',  name_ar: 'قمصان',     name_en: 'Shirts',   icon: 'shirt',  parent: 'men', sort: 2, image: 'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=800' },
  { slug: 'men-pants',   name_ar: 'بنطلونات', name_en: 'Pants',    icon: 'pants',  parent: 'men', sort: 3, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800' },
  { slug: 'men-jackets', name_ar: 'جواكت',    name_en: 'Jackets',  icon: 'jacket', parent: 'men', sort: 4, image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800' },
];

// Reusable color palette
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

function variants(sizes, colors, baseStock = 12) {
  const out = [];
  for (const s of sizes) for (const c of colors) {
    out.push({ size: s, color_ar: c.ar, color_en: c.en, color_hex: c.hex, stock: baseStock + Math.floor(Math.random() * 18) });
  }
  return out;
}

export const products = [
  // ============ KIDS - BOYS ============
  {
    category_slug: 'kids-boys', sku: 'BMG-KB-001', brand: 'Barmagly Kids',
    name_ar: 'تيشيرت أولاد قطن مطبوع', name_en: 'Boys Cotton Print T-Shirt',
    desc_ar: 'تيشيرت كوتون 100% للأولاد بطباعة عصرية، مريح ومناسب للاستخدام اليومي والمدرسة.',
    desc_en: 'Premium 100% cotton T-shirt for boys with modern print. Comfortable for daily wear and school.',
    material_ar: 'قطن 100%', material_en: '100% Cotton',
    gender: 'kids', age_group: 'kid', price: 199, compare: 280, featured: 1, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=900',
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=900',
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc480?w=900',
    ],
    variants: variants(['4Y','6Y','8Y','10Y','12Y'], [C.white, C.navy, C.red, C.green]),
  },
  {
    category_slug: 'kids-boys', sku: 'BMG-KB-002', brand: 'Barmagly Kids',
    name_ar: 'بنطلون جينز أولاد', name_en: 'Boys Slim Jeans',
    desc_ar: 'جينز قص ضيق للأولاد، خامة قطنية مرنة وقصة مريحة للحركة.',
    desc_en: 'Slim-fit denim for boys with stretch cotton fabric. Comfortable for active days.',
    material_ar: 'دنيم مرن', material_en: 'Stretch Denim',
    gender: 'kids', age_group: 'kid', price: 349, compare: 450, featured: 0, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=900',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900',
    ],
    variants: variants(['4Y','6Y','8Y','10Y','12Y'], [C.blue, C.navy, C.black]),
  },
  {
    category_slug: 'kids-boys', sku: 'BMG-KB-003', brand: 'Barmagly Sport',
    name_ar: 'بدلة رياضية أولاد', name_en: 'Boys Tracksuit Set',
    desc_ar: 'طقم رياضي كامل (جاكيت + بنطلون) للأولاد، خامة بوليستر خفيفة ومريحة.',
    desc_en: 'Complete tracksuit for active boys. Lightweight polyester for sports & play.',
    material_ar: 'بوليستر', material_en: 'Polyester',
    gender: 'kids', age_group: 'kid', price: 599, compare: 750, featured: 1, isNew: 0,
    images: [
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=900',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=900',
    ],
    variants: variants(['6Y','8Y','10Y','12Y'], [C.black, C.navy, C.red]),
  },

  // ============ KIDS - GIRLS ============
  {
    category_slug: 'kids-girls', sku: 'BMG-KG-001', brand: 'Barmagly Kids',
    name_ar: 'فستان بنات صيفي', name_en: 'Girls Summer Floral Dress',
    desc_ar: 'فستان بنات بطبعة أزهار صيفية، خامة قطنية ناعمة ومريحة، مثالي للمناسبات والخروجات.',
    desc_en: 'Summer floral dress for girls. Soft cotton fabric ideal for outings and occasions.',
    material_ar: 'قطن', material_en: 'Cotton',
    gender: 'kids', age_group: 'kid', price: 449, compare: 599, featured: 1, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=900',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=900',
    ],
    variants: variants(['4Y','6Y','8Y','10Y'], [C.pink, C.white, C.yellow]),
  },
  {
    category_slug: 'kids-girls', sku: 'BMG-KG-002', brand: 'Barmagly Kids',
    name_ar: 'تيشيرت بنات بطبعة', name_en: 'Girls Printed T-Shirt',
    desc_ar: 'تيشيرت بنات مرح بطبعة عصرية، خامة قطنية ناعمة على البشرة.',
    desc_en: 'Fun printed T-shirt for girls. Soft cotton, gentle on skin.',
    material_ar: 'قطن 100%', material_en: '100% Cotton',
    gender: 'kids', age_group: 'kid', price: 179, compare: 240, featured: 0, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=900',
    ],
    variants: variants(['4Y','6Y','8Y','10Y'], [C.pink, C.white, C.purple]),
  },
  {
    category_slug: 'kids-girls', sku: 'BMG-KG-003', brand: 'Barmagly Kids',
    name_ar: 'تنورة بنات بطبقات', name_en: 'Girls Layered Skirt',
    desc_ar: 'تنورة بنات بطبقات أنيقة، مريحة ومناسبة للحفلات.',
    desc_en: 'Elegant layered skirt for girls. Comfortable and party-ready.',
    material_ar: 'تول وقطن', material_en: 'Tulle & Cotton',
    gender: 'kids', age_group: 'kid', price: 329, compare: 420, featured: 0, isNew: 0,
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=900',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=900',
    ],
    variants: variants(['4Y','6Y','8Y','10Y'], [C.pink, C.white, C.navy]),
  },

  // ============ KIDS - NEWBORN ============
  {
    category_slug: 'kids-newborn', sku: 'BMG-KN-001', brand: 'Barmagly Baby',
    name_ar: 'طقم أفرول رضع 3 قطع', name_en: 'Newborn 3-Piece Romper Set',
    desc_ar: 'طقم أفرول رضع من 3 قطع، خامة قطنية ناعمة جداً وآمنة على بشرة الطفل.',
    desc_en: '3-piece romper set for newborns. Ultra-soft cotton, safe for baby skin.',
    material_ar: 'قطن عضوي', material_en: 'Organic Cotton',
    gender: 'kids', age_group: 'newborn', price: 379, compare: 499, featured: 1, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=900',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=900',
    ],
    variants: variants(['0-3M','3-6M','6-9M','9-12M'], [C.white, C.pink, C.blue, C.yellow]),
  },
  {
    category_slug: 'kids-newborn', sku: 'BMG-KN-002', brand: 'Barmagly Baby',
    name_ar: 'بيجامة رضع قطن', name_en: 'Newborn Cotton Pajama',
    desc_ar: 'بيجامة رضع من القطن النقي، مريحة للنوم وآمنة على البشرة الحساسة.',
    desc_en: 'Pure cotton pajama for newborns. Comfortable for sleep, gentle on sensitive skin.',
    material_ar: 'قطن 100%', material_en: '100% Cotton',
    gender: 'kids', age_group: 'newborn', price: 249, compare: 320, featured: 0, isNew: 0,
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=900',
    ],
    variants: variants(['0-3M','3-6M','6-9M','9-12M'], [C.white, C.pink, C.blue]),
  },

  // ============ WOMEN - CASUAL ============
  {
    category_slug: 'women-casual', sku: 'BMG-WC-001', brand: 'Barmagly Fashion',
    name_ar: 'بلوزة حريمي قطن كاجوال', name_en: 'Women Casual Cotton Blouse',
    desc_ar: 'بلوزة حريمي كاجوال من القطن الفاخر، تصميم عصري بقصة مريحة، مثالية لإطلالة يومية أنيقة.',
    desc_en: 'Casual cotton blouse for women. Modern design with comfortable fit. Perfect for everyday elegance.',
    material_ar: 'قطن فاخر', material_en: 'Premium Cotton',
    gender: 'women', age_group: 'adult', price: 549, compare: 750, featured: 1, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1485518882345-15568b007407?w=900',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900',
    ],
    variants: variants(['S','M','L','XL'], [C.white, C.beige, C.black, C.pink]),
  },
  {
    category_slug: 'women-casual', sku: 'BMG-WC-002', brand: 'Barmagly Fashion',
    name_ar: 'تيشيرت حريمي بقصة واسعة', name_en: 'Women Oversized T-Shirt',
    desc_ar: 'تيشيرت حريمي بقصة واسعة عصرية، قطن مريح وألوان متعددة.',
    desc_en: 'Trendy oversized T-shirt for women. Comfortable cotton in multiple colors.',
    material_ar: 'قطن', material_en: 'Cotton',
    gender: 'women', age_group: 'adult', price: 299, compare: 399, featured: 0, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900',
      'https://images.unsplash.com/photo-1485518882345-15568b007407?w=900',
    ],
    variants: variants(['S','M','L','XL'], [C.white, C.black, C.gray, C.olive]),
  },
  {
    category_slug: 'women-casual', sku: 'BMG-WC-003', brand: 'Denim Co',
    name_ar: 'جينز حريمي عالي الخصر', name_en: 'Women High-Waist Jeans',
    desc_ar: 'بنطلون جينز حريمي بخصر عالي، قصة slim تبرز رشاقة الجسم، خامة دنيم مرنة.',
    desc_en: 'High-waist slim jeans for women. Stretch denim that flatters the silhouette.',
    material_ar: 'دنيم مرن', material_en: 'Stretch Denim',
    gender: 'women', age_group: 'adult', price: 699, compare: 950, featured: 1, isNew: 0,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900',
    ],
    variants: variants(['S','M','L','XL'], [C.blue, C.navy, C.black]),
  },
  {
    category_slug: 'women-casual', sku: 'BMG-WC-004', brand: 'Barmagly Fashion',
    name_ar: 'كارديجان صوف ناعم', name_en: 'Soft Knit Cardigan',
    desc_ar: 'كارديجان صوف حريمي خامة ناعمة، طبقة دفء أنيقة لخريف وشتاء عصري.',
    desc_en: 'Soft knit cardigan for women. Elegant warm layer for fall and winter.',
    material_ar: 'صوف ناعم', material_en: 'Soft Knit',
    gender: 'women', age_group: 'adult', price: 599, compare: 799, featured: 0, isNew: 0,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900',
    ],
    variants: variants(['S','M','L','XL'], [C.beige, C.gray, C.brown]),
  },

  // ============ WOMEN - EVENING ============
  {
    category_slug: 'women-evening', sku: 'BMG-WE-001', brand: 'Barmagly Couture',
    name_ar: 'فستان سواريه طويل', name_en: 'Long Evening Gown',
    desc_ar: 'فستان سواريه طويل بتصميم راقي، مناسب للحفلات والمناسبات الخاصة. قماش فاخر يلتف بأناقة.',
    desc_en: 'Elegant long evening gown for special occasions. Luxurious flowing fabric.',
    material_ar: 'شيفون فاخر', material_en: 'Premium Chiffon',
    gender: 'women', age_group: 'adult', price: 1899, compare: 2500, featured: 1, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900',
    ],
    variants: variants(['S','M','L','XL'], [C.black, C.red, C.navy]),
  },
  {
    category_slug: 'women-evening', sku: 'BMG-WE-002', brand: 'Barmagly Couture',
    name_ar: 'فستان كوكتيل قصير', name_en: 'Short Cocktail Dress',
    desc_ar: 'فستان كوكتيل قصير بتصميم جذاب، مناسب لحفلات السهرة وإطلالة لافتة.',
    desc_en: 'Stylish short cocktail dress. Perfect for evening parties and standout looks.',
    material_ar: 'ساتان', material_en: 'Satin',
    gender: 'women', age_group: 'adult', price: 1299, compare: 1700, featured: 1, isNew: 0,
    images: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900',
    ],
    variants: variants(['S','M','L','XL'], [C.black, C.red, C.purple]),
  },

  // ============ WOMEN - SPORT ============
  {
    category_slug: 'women-sport', sku: 'BMG-WS-001', brand: 'Barmagly Sport',
    name_ar: 'لجنز رياضي حريمي', name_en: 'Women Sport Leggings',
    desc_ar: 'لجنز رياضي حريمي بخامة مرنة عالية الجودة، يدعم الحركة في كل أنواع الرياضة.',
    desc_en: 'High-quality stretch leggings for women. Supports movement across all sports.',
    material_ar: 'لايكرا مرن', material_en: 'Stretch Lycra',
    gender: 'women', age_group: 'adult', price: 449, compare: 599, featured: 0, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=900',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900',
    ],
    variants: variants(['S','M','L','XL'], [C.black, C.navy, C.gray]),
  },
  {
    category_slug: 'women-sport', sku: 'BMG-WS-002', brand: 'Barmagly Sport',
    name_ar: 'تيشيرت رياضي حريمي', name_en: 'Women Sport T-Shirt',
    desc_ar: 'تيشيرت رياضي حريمي تكنولوجيا تنفس متقدمة لتجربة تمرين مريحة.',
    desc_en: 'Sport T-shirt with advanced breathable tech for comfortable workouts.',
    material_ar: 'بوليستر متطور', material_en: 'Tech Polyester',
    gender: 'women', age_group: 'adult', price: 329, compare: 449, featured: 0, isNew: 0,
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900',
    ],
    variants: variants(['S','M','L','XL'], [C.pink, C.black, C.white]),
  },

  // ============ WOMEN - ACCESSORIES ============
  {
    category_slug: 'women-accessories', sku: 'BMG-WA-001', brand: 'Barmagly Accessories',
    name_ar: 'حقيبة يد جلدية', name_en: 'Leather Handbag',
    desc_ar: 'حقيبة يد جلدية فاخرة بتصميم عصري، تتسع لاحتياجاتك اليومية بأناقة.',
    desc_en: 'Premium leather handbag with modern design. Fits daily essentials elegantly.',
    material_ar: 'جلد طبيعي', material_en: 'Genuine Leather',
    gender: 'women', age_group: 'adult', price: 999, compare: 1399, featured: 1, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900',
    ],
    variants: [
      { size: 'OneSize', color_ar: C.black.ar, color_en: C.black.en, color_hex: C.black.hex, stock: 25 },
      { size: 'OneSize', color_ar: C.brown.ar, color_en: C.brown.en, color_hex: C.brown.hex, stock: 18 },
      { size: 'OneSize', color_ar: C.beige.ar, color_en: C.beige.en, color_hex: C.beige.hex, stock: 12 },
    ],
  },
  {
    category_slug: 'women-accessories', sku: 'BMG-WA-002', brand: 'Barmagly Accessories',
    name_ar: 'نظارة شمس عصرية', name_en: 'Modern Sunglasses',
    desc_ar: 'نظارة شمس بتصميم عصري وحماية UV400، إطار خفيف ومريح.',
    desc_en: 'Modern sunglasses with UV400 protection. Lightweight comfortable frame.',
    material_ar: 'أسيتات', material_en: 'Acetate',
    gender: 'women', age_group: 'adult', price: 449, compare: 600, featured: 0, isNew: 0,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900',
    ],
    variants: [
      { size: 'OneSize', color_ar: C.black.ar, color_en: C.black.en, color_hex: C.black.hex, stock: 30 },
      { size: 'OneSize', color_ar: C.brown.ar, color_en: C.brown.en, color_hex: C.brown.hex, stock: 22 },
    ],
  },

  // ============ MEN - T-SHIRTS ============
  {
    category_slug: 'men-tshirts', sku: 'BMG-MT-001', brand: 'Barmagly Men',
    name_ar: 'تيشيرت رجالي قطن كلاسيك', name_en: 'Men Classic Cotton T-Shirt',
    desc_ar: 'تيشيرت رجالي قطن 100% بقصة كلاسيكية، أساسي في خزانتك. خامة فاخرة ومتانة عالية.',
    desc_en: 'Classic cotton T-shirt for men. Wardrobe essential with premium fabric and lasting quality.',
    material_ar: 'قطن مصري 100%', material_en: '100% Egyptian Cotton',
    gender: 'men', age_group: 'adult', price: 249, compare: 350, featured: 1, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900',
      'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=900',
    ],
    variants: variants(['S','M','L','XL','XXL'], [C.white, C.black, C.navy, C.gray, C.olive]),
  },
  {
    category_slug: 'men-tshirts', sku: 'BMG-MT-002', brand: 'Barmagly Men',
    name_ar: 'بولو شيرت رجالي', name_en: 'Men Polo Shirt',
    desc_ar: 'بولو شيرت رجالي بياقة كلاسيكية، خامة بيكيه قطنية فاخرة، مناسب للعمل والخروجات.',
    desc_en: 'Classic polo shirt for men. Premium cotton piqué, ideal for work and outings.',
    material_ar: 'قطن بيكيه', material_en: 'Cotton Piqué',
    gender: 'men', age_group: 'adult', price: 449, compare: 599, featured: 1, isNew: 0,
    images: [
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=900',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900',
    ],
    variants: variants(['S','M','L','XL','XXL'], [C.navy, C.white, C.black, C.green]),
  },
  {
    category_slug: 'men-tshirts', sku: 'BMG-MT-003', brand: 'Barmagly Men',
    name_ar: 'تيشيرت بأكمام طويلة', name_en: 'Long Sleeve T-Shirt',
    desc_ar: 'تيشيرت رجالي بأكمام طويلة، مريح وعملي للأجواء المعتدلة.',
    desc_en: 'Long-sleeve T-shirt for men. Comfortable and practical for mild weather.',
    material_ar: 'قطن مرن', material_en: 'Stretch Cotton',
    gender: 'men', age_group: 'adult', price: 329, compare: 450, featured: 0, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900',
    ],
    variants: variants(['S','M','L','XL','XXL'], [C.black, C.gray, C.navy]),
  },

  // ============ MEN - SHIRTS ============
  {
    category_slug: 'men-shirts', sku: 'BMG-MS-001', brand: 'Barmagly Formal',
    name_ar: 'قميص رجالي رسمي', name_en: 'Men Formal Dress Shirt',
    desc_ar: 'قميص رجالي رسمي للمناسبات والعمل، قطن فاخر بقصة slim fit أنيقة.',
    desc_en: 'Formal dress shirt for work and events. Premium cotton with elegant slim fit.',
    material_ar: 'قطن فاخر', material_en: 'Premium Cotton',
    gender: 'men', age_group: 'adult', price: 599, compare: 799, featured: 1, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=900',
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=900',
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=900',
    ],
    variants: variants(['S','M','L','XL','XXL'], [C.white, C.blue, C.black, C.beige]),
  },
  {
    category_slug: 'men-shirts', sku: 'BMG-MS-002', brand: 'Barmagly Casual',
    name_ar: 'قميص كاجوال مربعات', name_en: 'Casual Checkered Shirt',
    desc_ar: 'قميص كاجوال بنقشة مربعات عصرية، مناسب للخروجات والإطلالات اليومية.',
    desc_en: 'Casual checkered shirt with modern pattern. Great for outings and daily looks.',
    material_ar: 'قطن', material_en: 'Cotton',
    gender: 'men', age_group: 'adult', price: 499, compare: 650, featured: 0, isNew: 0,
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=900',
      'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=900',
    ],
    variants: variants(['S','M','L','XL','XXL'], [C.red, C.blue, C.green]),
  },

  // ============ MEN - PANTS ============
  {
    category_slug: 'men-pants', sku: 'BMG-MP-001', brand: 'Denim Co',
    name_ar: 'بنطلون جينز رجالي slim', name_en: 'Men Slim Fit Jeans',
    desc_ar: 'جينز رجالي slim fit، خامة دنيم مرنة لراحة طوال اليوم. أساسي في كل خزانة.',
    desc_en: 'Slim fit jeans for men. Stretch denim for all-day comfort. Wardrobe staple.',
    material_ar: 'دنيم مرن', material_en: 'Stretch Denim',
    gender: 'men', age_group: 'adult', price: 749, compare: 999, featured: 1, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900',
    ],
    variants: variants(['30','32','34','36','38'], [C.blue, C.navy, C.black]),
  },
  {
    category_slug: 'men-pants', sku: 'BMG-MP-002', brand: 'Barmagly Men',
    name_ar: 'بنطلون شينو رجالي', name_en: 'Men Chino Pants',
    desc_ar: 'بنطلون شينو رجالي خامة قطن متينة، يجمع بين الكاجوال والرسمي بأناقة.',
    desc_en: 'Chino pants for men. Durable cotton blending casual and formal style.',
    material_ar: 'قطن', material_en: 'Cotton',
    gender: 'men', age_group: 'adult', price: 549, compare: 720, featured: 0, isNew: 0,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900',
    ],
    variants: variants(['30','32','34','36','38'], [C.beige, C.olive, C.navy, C.black]),
  },
  {
    category_slug: 'men-pants', sku: 'BMG-MP-003', brand: 'Barmagly Sport',
    name_ar: 'بنطلون رياضي رجالي', name_en: 'Men Joggers Sweatpants',
    desc_ar: 'بنطلون رياضي رجالي مريح بقصة جوجر عصرية، مثالي للرياضة والاسترخاء.',
    desc_en: 'Comfortable jogger-cut sweatpants for men. Perfect for sport and lounge.',
    material_ar: 'فرنسي قطن', material_en: 'French Terry Cotton',
    gender: 'men', age_group: 'adult', price: 449, compare: 599, featured: 0, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=900',
    ],
    variants: variants(['S','M','L','XL','XXL'], [C.gray, C.black, C.navy]),
  },

  // ============ MEN - JACKETS ============
  {
    category_slug: 'men-jackets', sku: 'BMG-MJ-001', brand: 'Barmagly Outerwear',
    name_ar: 'جاكيت جلد رجالي', name_en: 'Men Leather Jacket',
    desc_ar: 'جاكيت جلد رجالي بتصميم بايكر كلاسيكي، خامة جلد فاخرة وتشطيب عالي.',
    desc_en: 'Classic biker leather jacket for men. Premium leather with high-end finishing.',
    material_ar: 'جلد طبيعي', material_en: 'Genuine Leather',
    gender: 'men', age_group: 'adult', price: 2499, compare: 3499, featured: 1, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=900',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=900',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900',
    ],
    variants: variants(['S','M','L','XL','XXL'], [C.black, C.brown]),
  },
  {
    category_slug: 'men-jackets', sku: 'BMG-MJ-002', brand: 'Barmagly Outerwear',
    name_ar: 'جاكيت بومبر رجالي', name_en: 'Men Bomber Jacket',
    desc_ar: 'جاكيت بومبر رجالي بتصميم رياضي عصري، خامة خفيفة ودافئة.',
    desc_en: 'Modern sport-style bomber jacket for men. Lightweight yet warm.',
    material_ar: 'بوليستر مبطن', material_en: 'Quilted Polyester',
    gender: 'men', age_group: 'adult', price: 999, compare: 1299, featured: 0, isNew: 1,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=900',
    ],
    variants: variants(['S','M','L','XL','XXL'], [C.olive, C.black, C.navy]),
  },
  {
    category_slug: 'men-jackets', sku: 'BMG-MJ-003', brand: 'Barmagly Outerwear',
    name_ar: 'كنزة رجالي بقلنسوة', name_en: 'Men Hoodie Sweatshirt',
    desc_ar: 'كنزة رجالي بقلنسوة، خامة قطن سميك مريح لطقس متغير.',
    desc_en: 'Hooded sweatshirt for men. Heavy cotton, comfortable in changing weather.',
    material_ar: 'قطن سميك', material_en: 'Heavy Cotton',
    gender: 'men', age_group: 'adult', price: 599, compare: 799, featured: 1, isNew: 0,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900',
    ],
    variants: variants(['S','M','L','XL','XXL'], [C.gray, C.black, C.navy, C.olive]),
  },
];

export const coupons = [
  { code: 'WELCOME10', desc_ar: 'خصم 10% للعملاء الجدد', desc_en: '10% off for new customers', type: 'percentage', value: 10, min_order: 300, max_discount: 200 },
  { code: 'SAVE50',    desc_ar: 'خصم 50 جنيه على الطلبات فوق 500', desc_en: '50 EGP off orders over 500', type: 'fixed', value: 50, min_order: 500, max_discount: null },
  { code: 'EID2026',   desc_ar: 'عرض العيد - خصم 15%', desc_en: 'Eid special - 15% off', type: 'percentage', value: 15, min_order: 1000, max_discount: 500 },
  { code: 'FREESHIP',  desc_ar: 'شحن مجاني', desc_en: 'Free shipping', type: 'fixed', value: 60, min_order: 400, max_discount: null },
];

export const reviews = [
  { product_sku: 'BMG-MT-001', rating: 5, title: 'خامة ممتازة', comment: 'القطن المصري حقاً متميز، يستحق السعر تماماً!' },
  { product_sku: 'BMG-MT-001', rating: 5, title: 'Perfect fit',    comment: 'Great quality cotton, very comfortable.' },
  { product_sku: 'BMG-MT-001', rating: 4, title: 'جيد جداً',        comment: 'تيشيرت ممتاز لكن المقاس جاء أكبر قليلاً.' },
  { product_sku: 'BMG-WC-001', rating: 5, title: 'أنيقة ومريحة',     comment: 'البلوزة جميلة جداً وخامتها فاخرة.' },
  { product_sku: 'BMG-WC-001', rating: 5, title: 'Loved it',        comment: 'Beautiful fabric and perfect fit.' },
  { product_sku: 'BMG-WE-001', rating: 5, title: 'فستان حلم',       comment: 'لبسته في حفلة وكل اللي شافه قال عنه!' },
  { product_sku: 'BMG-MJ-001', rating: 5, title: 'جلد فاخر',         comment: 'الجاكيت رائع والجلد أصلي وممتاز.' },
  { product_sku: 'BMG-KG-001', rating: 5, title: 'بنتي حبته',        comment: 'الفستان جميل والخامة ناعمة على بشرتها.' },
  { product_sku: 'BMG-MP-001', rating: 4, title: 'جينز ممتاز',       comment: 'القصة مظبوطة والخامة مرنة ومريحة.' },
  { product_sku: 'BMG-WC-003', rating: 5, title: 'أحلى جينز',        comment: 'يبرز القوام بشكل جميل، اشتريت قطعتين.' },
];
