# Barmagly Fashion Store · متجر برمجلي للأزياء

> متجر إلكتروني متكامل للملابس بثلاثة أقسام (أطفالي · حريمي · رجالي)، ثنائي اللغة (عربي/إنجليزي)، مع لوحة تحكم احترافية.
>
> Developed by **شركة برمجلي · Barmagly** · [barmagly.tech](https://barmagly.tech)

---

## Stack
- **Frontend:** Next.js 14 (App Router) + React 18 + TailwindCSS + next-intl (AR/EN, RTL/LTR)
- **Backend:** Node.js + Express + MySQL2 + JWT
- **Database:** MySQL 8
- **Auth:** JWT (access + refresh)
- **Payments (mock-ready):** Visa/Mastercard, Fawry, Paymob, Vodafone Cash, InstaPay, COD

## Project structure
```
.
├── backend/          # Express REST API + MySQL schema/seed
│   ├── src/
│   ├── db/
│   │   ├── schema.sql
│   │   └── seed.js
│   └── .env.example
├── frontend/         # Next.js 14 storefront + admin dashboard
│   └── src/
└── package.json      # workspace root
```

## Quick start

### 1. Prerequisites
- Node.js 20+
- MySQL 8+ running locally (default user `root`)

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Configure environment

**backend/.env** (copy from `backend/.env.example`):
```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=barmagly_store
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

**frontend/.env.local**:
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 4. Create the database & seed data
```bash
npm run db:setup
```
This creates the `barmagly_store` database, runs the schema, and seeds:
- 3 main categories + sub-categories
- ~40 real products (kids/women/men) with multiple sizes/colors/images
- Admin user: `admin@barmagly.tech` / `Admin@12345`
- Demo customer: `customer@example.com` / `Customer@123`
- Sample coupons & orders

### 5. Run dev servers
```bash
npm run dev
```
- Storefront: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin
- API: http://localhost:4000/api

---

## Features

### Storefront (Customer)
- Browse 3 sections (Kids/Women/Men) with sub-categories
- Advanced filters: size, color, price, brand, type, rating, best-sellers
- Product page: multi-image gallery, size/color picker, stock awareness, reviews
- Cart, wishlist, coupons, address book
- Checkout with multiple payment methods + Cash on Delivery
- AR/EN with full RTL/LTR support
- Mobile-first responsive design

### Admin Dashboard
- Sales analytics dashboard (revenue, orders, top products)
- Products: CRUD with variants (size × color × stock)
- Categories management
- Orders: filter by status, update status, print invoice
- Customers: list, order history, total spent
- Coupons: percentage/fixed, expiry, min-order
- Reviews moderation
- Settings: site, payment, shipping per governorate

---

## License
© 2026 Barmagly · جميع الحقوق محفوظة
