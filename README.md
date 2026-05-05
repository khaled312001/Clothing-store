# AURA Fashion House · أُورا للأزياء

> متجر إلكتروني متكامل للأزياء بثلاثة أقسام (أطفالي · حريمي · رجالي)، ثنائي اللغة (عربي/إنجليزي)، مع لوحة تحكم احترافية + نظام نقطة بيع POS + تقارير وإدارة مخزون.
>
> **Developed by شركة برمجلي · Barmagly** · [barmagly.tech](https://barmagly.tech)

---

## 🏗️ المعمارية (Stack)

| الطبقة | التقنية |
|---|---|
| **Frontend** | Next.js 14 (App Router) · React 18 · TailwindCSS · Framer Motion · Zustand · Lucide Icons |
| **Backend** | Node.js 20+ · Express · MySQL2 · JWT · bcryptjs · Helmet · CORS · Rate-limit |
| **Database** | MySQL 8+ (utf8mb4 — يدعم العربي والإيموجي بالكامل) |
| **Auth** | JWT (HTTP Authorization Bearer) |
| **Payments (mock-ready)** | Visa · Mastercard · Fawry · Paymob · Vodafone Cash · InstaPay · COD · POS Cash/Card |

---

## 📁 هيكل المشروع

```
Clothing store/
├── backend/                       # Express REST API
│   ├── src/
│   │   ├── server.js              # نقطة الدخول
│   │   ├── db.js                  # connection pool
│   │   ├── middleware/auth.js     # JWT + admin guard
│   │   └── routes/                # auth, products, orders, cart, wishlist,
│   │                              #  addresses, coupons, reviews, settings, admin
│   ├── db/
│   │   ├── schema.sql             # 12 جدول (users, products, variants, orders…)
│   │   ├── migrate.js             # إنشاء الـDB + تطبيق الـschema
│   │   ├── seed.js                # تعبئة بيانات تجريبية
│   │   ├── seed-data.js           # 28 منتج أساسي
│   │   └── seed-data-extra.js     # 20 منتج إضافي
│   └── .env                        # إعدادات الـbackend
│
├── frontend/                      # Next.js 14 storefront + admin
│   ├── public/                    # logo-mark.svg, manifest.webmanifest
│   ├── src/
│   │   ├── app/
│   │   │   ├── (shop)/            # المتجر للعميل
│   │   │   │   ├── page.js        # الصفحة الرئيسية (Hero, sections...)
│   │   │   │   ├── category/[slug]/
│   │   │   │   ├── product/[slug]/
│   │   │   │   ├── cart, checkout, wishlist, contact, faq...
│   │   │   │   ├── auth/login, auth/register
│   │   │   │   └── account/profile, orders, addresses, invoice
│   │   │   ├── admin/             # لوحة التحكم
│   │   │   │   ├── page.js        # Dashboard (KPIs)
│   │   │   │   ├── pos/           # نقطة البيع POS
│   │   │   │   ├── reports/       # التقارير
│   │   │   │   ├── inventory/     # إدارة المخزون
│   │   │   │   ├── products, orders, customers, coupons, reviews, settings
│   │   │   ├── icon.svg           # favicon (App Router)
│   │   │   ├── apple-icon.svg
│   │   │   ├── robots.txt/        # SEO
│   │   │   ├── sitemap.xml/       # SEO ديناميكي
│   │   │   └── layout.js          # JSON-LD organization schema
│   │   ├── components/            # Header, Footer, ProductCard, Filters, Charts...
│   │   ├── i18n/dictionaries.js   # عربي/إنجليزي
│   │   └── lib/api.js, store.js, utils.js
│   └── .env.local                 # NEXT_PUBLIC_API_URL
│
├── package.json                    # workspace root + concurrently
└── README.md
```

---

## ⚙️ المتطلبات الأساسية

قبل ما تبدأ تأكد إن عندك:

1. **Node.js 20+** — تحقق: `node --version`
2. **npm 10+** — تحقق: `npm --version`
3. **MySQL 8+** شغّال على `localhost:3306`
   - أسهل طريقة: ثبّت **XAMPP** أو **MySQL Community Server**
   - تأكد إن الـMySQL service شغّال

---

## 🚀 خطوات التشغيل (أول مرة)

### 1) تثبيت كل المكتبات
من جذر المشروع:
```powershell
cd "E:\Clothing store"
npm install
npm run install:all
```
هذا يثبّت:
- `concurrently` في الجذر
- 129 package في `backend/`
- 112 package في `frontend/`

### 2) إعدادات الاتصال بـMySQL

افتح ملف `backend/.env` وعدّله حسب إعدادات MySQL عندك:

```env
PORT=4000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=                         # ← لو فيه كلمة سر MySQL ضعها هنا
DB_NAME=aura_store

JWT_SECRET=aura-dev-secret-please-replace-in-production-2026
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
```

ملاحظة: لو الـDB اسمه عندك مختلف، عدّل `DB_NAME`. الـmigrate script هينشئه تلقائياً لو مش موجود.

ملف `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3) إنشاء قاعدة البيانات وتعبئتها بالبيانات

```powershell
npm run db:setup
```

هذا الأمر يقوم بـ:
1. ينشئ database اسمه `aura_store` (لو غير موجود) بـcharset `utf8mb4`
2. يطبّق الـschema (12 جدول)
3. يعبّي بيانات تجريبية:
   - **48 منتج** بصور Unsplash موضوعية ومتوفرة 100%
   - 14 قسم وتصنيف فرعي (3 رئيسية + 11 فرعي)
   - 4 حسابات (1 admin + 3 عملاء)
   - 4 كوبونات
   - 22 review
   - 4 عناوين شحن
   - 11 طلب تجريبي بحالات مختلفة (delivered, shipped, processing, pending, cancelled)
   - إعدادات الموقع

أوامر إضافية لو احتجت:
```powershell
# إعادة تطبيق الـschema فقط (يحذف كل البيانات!)
npm run db:migrate --prefix backend

# إعادة seed فقط (بدون مسح هيكل الجداول)
npm run db:seed --prefix backend

# reset كامل (migrate + seed)
npm run db:reset --prefix backend
```

### 4) تشغيل الـbackend والـfrontend معاً

```powershell
npm run dev
```

هذا يشغّل:
- 🟦 **Backend** على `http://localhost:4000`
- 🟩 **Frontend** على `http://localhost:3000`

أو شغّلهم في نافذتين منفصلتين:
```powershell
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend
```

---

## 🌐 الروابط المهمة

| الصفحة | الرابط |
|---|---|
| **المتجر (الواجهة)** | http://localhost:3000 |
| **لوحة التحكم** | http://localhost:3000/admin |
| **نقطة البيع POS** | http://localhost:3000/admin/pos |
| **التقارير** | http://localhost:3000/admin/reports |
| **إدارة المخزون** | http://localhost:3000/admin/inventory |
| **API** | http://localhost:4000/api |
| **API health check** | http://localhost:4000/api/health |
| **Sitemap** | http://localhost:3000/sitemap.xml |
| **Robots.txt** | http://localhost:3000/robots.txt |

---

## 🔑 بيانات الدخول التجريبية

### حساب المدير (Admin)
```
Email:    admin@barmagly.tech
Password: Admin@12345
```
الوصول الكامل لـ `/admin` (لوحة التحكم + POS + التقارير + كل شيء)

### حسابات العملاء (Customers)
```
Email:    customer@example.com
Password: Customer@123

Email:    sara@example.com
Password: Customer@123

Email:    khaled@example.com
Password: Customer@123
```

### كوبونات تجريبية شغّالة
| الكود | النوع | الخصم | الحد الأدنى |
|---|---|---|---|
| `WELCOME10` | نسبة | 10% (max 200 ج.م) | 300 ج.م |
| `SAVE50` | ثابت | 50 ج.م | 500 ج.م |
| `EID2026` | نسبة | 15% (max 500 ج.م) | 1000 ج.م |
| `FREESHIP` | ثابت | 60 ج.م | 400 ج.م |

---

## 🗄️ تفاصيل قاعدة البيانات

**الاسم الافتراضي:** `aura_store` (قابل للتعديل في `.env`)
**Engine:** InnoDB
**Charset:** utf8mb4 (يدعم العربي والإيموجي والرموز)
**Port:** 3306

### الجداول (12)
| الجدول | الوصف |
|---|---|
| `users` | المستخدمين (admin + customer) — bcrypt hashes |
| `categories` | الأقسام والتصنيفات الفرعية (شجرة) |
| `products` | المنتجات الأساسية |
| `product_images` | معرض الصور لكل منتج |
| `product_variants` | (مقاس × لون × مخزون) |
| `addresses` | عناوين الشحن للعملاء |
| `cart_items` | سلة التسوق (للمستخدمين المسجّلين) |
| `wishlist_items` | المفضلة |
| `orders` | الطلبات (online + POS) |
| `order_items` | snapshot لكل منتج وقت الشراء |
| `coupons` | أكواد الخصم |
| `reviews` | تقييمات المنتجات |
| `settings` | إعدادات الموقع (key/value) |

### الاتصال يدوياً بالـDB

عبر MySQL CLI:
```powershell
mysql -u root -p aura_store
```

عبر phpMyAdmin (لو XAMPP): http://localhost/phpmyadmin

---

## 🎨 المميزات الكاملة

### واجهة العميل (Storefront)
- ✅ Hero احترافي بـeditorial layout + animated stats + marquee
- ✅ تصفح 3 أقسام رئيسية (أطفالي/حريمي/رجالي) + 11 تصنيف فرعي
- ✅ فلاتر متقدمة: المقاس، اللون، السعر (presets + range)، الترتيب
- ✅ صفحة المنتج: gallery متعدد، variants picker، تقييمات، منتجات مشابهة، JSON-LD schema
- ✅ السلة + المفضلة + auto-merge عند تسجيل الدخول
- ✅ Checkout مع 6 طرق دفع
- ✅ كوبونات مع validation
- ✅ تقدير الشحن (مجاني فوق 1500 ج.م)
- ✅ حساب العميل (الملف، الطلبات، فواتير قابلة للطباعة، العناوين)
- ✅ تبديل عربي/إنجليزي مع RTL/LTR كامل
- ✅ متجاوب 100% للموبايل

### لوحة التحكم (Admin)
| القسم | المميزات |
|---|---|
| **Dashboard** | 8 KPIs (إيرادات، طلبات، AOV، عملاء جدد، مخزون منخفض…) + quick actions + sales chart + recent orders |
| **POS** | شاشة بيع touch-friendly + بحث/باركود + variants picker + 3 طرق دفع + إيصال thermal printable |
| **Reports** | period selector (7d/30d/90d/1y) + KPIs مع change% + sales trend chart + breakdown by category/payment/status/hour + top products + top customers (VIP) + CSV export |
| **Inventory** | summary stats + low-stock filter + bulk inline stock editing |
| **Products** | CRUD كامل + variants متعددة + multiple images + brand + featured/new toggle |
| **Orders** | فلترة بالحالة، تحديث حالة الطلب والدفع، tracking number، طباعة فاتورة كاملة |
| **Customers** | قائمة + بحث + إجمالي مشتريات لكل عميل |
| **Coupons** | إنشاء/حذف + percentage/fixed + min order + max discount + expiry |
| **Reviews** | اعتماد/رفض/حذف |
| **Settings** | اسم الموقع، contact، رسوم الشحن، حد الشحن المجاني، العملة |

### SEO
- ✅ `metadata` كامل لكل صفحة (title template، OpenGraph، Twitter)
- ✅ `robots.txt` ديناميكي
- ✅ `sitemap.xml` ديناميكي يفهرس كل المنتجات والأقسام
- ✅ JSON-LD `Product` schema على صفحات المنتج
- ✅ JSON-LD `Store` schema في الجذر
- ✅ Manifest.webmanifest للـPWA
- ✅ favicon + apple-icon

---

## 🛠️ مشاكل شائعة وحلولها

### "concurrently not recognized"
الحل:
```powershell
cd "E:\Clothing store"
npm install
```

### "Cannot connect to MySQL"
- تأكد إن MySQL service شغّال (من Services في Windows أو من XAMPP)
- تأكد من بيانات `backend/.env` (User/Password صحيحين)
- جرّب:
```powershell
mysql -u root -p
```

### الـimages مش بتظهر
- الصور بتيجي من Unsplash (إنترنت مطلوب)
- لو الإنترنت بطيء جرّب hard refresh (`Ctrl+Shift+R`)

### الـ`/icon.svg 500` أو chunks `404`
السبب: cache فاسد بعد build قديم. الحل:
```powershell
cd "E:\Clothing store\frontend"
Remove-Item -Recurse -Force .next
npm run dev:frontend
```
وافتح المتصفح بـ hard refresh.

### Port 4000 أو 3000 مشغول
ابحث عن العملية وأوقفها:
```powershell
netstat -ano | findstr :4000
taskkill /F /PID <رقم العملية>
```

### الـDB موجود لكن فاضي
شغّل:
```powershell
npm run db:seed --prefix backend
```

---

## 📦 سكريبتات npm المتاحة

من جذر المشروع:
| الأمر | الوظيفة |
|---|---|
| `npm install` | يثبت `concurrently` في الجذر |
| `npm run install:all` | يثبت dependencies الـbackend والـfrontend |
| `npm run db:setup` | migrate + seed (إعداد كامل للـDB) |
| `npm run dev` | يشغّل الـbackend والـfrontend في نفس الوقت |
| `npm run dev:backend` | الـbackend فقط (port 4000) |
| `npm run dev:frontend` | الـfrontend فقط (port 3000) |

من داخل `backend/`:
| الأمر | الوظيفة |
|---|---|
| `npm run dev` | تشغيل الـbackend مع hot-reload |
| `npm start` | تشغيل في production mode |
| `npm run db:migrate` | تطبيق الـschema (يحذف البيانات!) |
| `npm run db:seed` | تعبئة البيانات التجريبية |
| `npm run db:reset` | migrate + seed |

من داخل `frontend/`:
| الأمر | الوظيفة |
|---|---|
| `npm run dev` | development server |
| `npm run build` | production build |
| `npm start` | تشغيل production build |

---

## 🔐 الأمان (Production checklist)

قبل النشر فعلياً:
- [ ] غيّر `JWT_SECRET` في `backend/.env` لقيمة عشوائية قوية
- [ ] غيّر كلمة سر admin من `Admin@12345`
- [ ] استخدم HTTPS فقط
- [ ] فعّل Real payment gateways (Paymob/Fawry credentials)
- [ ] فعّل rate limiting أقوى على الـauth endpoints
- [ ] خذ backups منتظمة للـDB
- [ ] استخدم `NODE_ENV=production`

---

## 📞 التواصل

- 💼 **Developed by:** [شركة برمجلي · Barmagly](https://barmagly.tech)
- 📞 +20 101 025 4819
- 💬 WhatsApp: [+20 101 025 4819](https://wa.me/201010254819)
- 🌐 [barmagly.tech](https://barmagly.tech)

---

© 2026 AURA Fashion · جميع الحقوق محفوظة · تم التطوير بواسطة شركة برمجلي
