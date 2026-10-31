# Aurélia Maison Paris — Luxury E-Commerce & Atelier Admin Suite

[![Live Demo](https://img.shields.io/badge/Live%20Demo-luxuryshopbd.netlify.app-aa8b5f?style=for-the-badge&logo=netlify)](https://luxuryshopbd.netlify.app/)
[![Admin Portal](https://img.shields.io/badge/Admin%20Portal-/atelier--admin-171713?style=for-the-badge&logo=shield)](https://luxuryshopbd.netlify.app/atelier-admin)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

---

## 🏛️ Overview

**Aurélia Maison Paris** (Luxury Shop BD) is a high-performance, full-stack luxury e-commerce platform crafted with **React 19**, **TypeScript**, **Vite 8**, **Tailwind CSS v4**, and **Supabase**. Inspired by Parisian haute couture and heritage leathercraft (Céline, Hermès, Goyard), the platform merges artisanal aesthetic elegance with enterprise-grade e-commerce capabilities.

The platform delivers a **dual-application architecture**:
1. **Haute Maroquinerie Storefront** — An editorial shopping experience featuring multi-currency conversion (BDT, USD, EUR, GBP), private salon bookings, wishlist, interactive bag drawers, and native Bangladesh payment gateways (bKash, Nagad, Cards, Cash on Delivery).
2. **Atelier Admin Backoffice (`/atelier-admin`)** — A dedicated, standalone administrative ERP suite with role-based access control (RBAC), real-time sales analytics, product catalog management, order fulfillment pipeline, inventory stock adjustments, customer CRM, coupon engine, and store configuration.

---

## ✨ Key Capabilities

### 🛍️ Client Boutique Storefront
- **Editorial Brand Showcase:** Fluid hero carousel with Parisian editorial typography (`Cormorant Garamond` + `Manrope`), seasonal campaign features, and artisan atelier narratives.
- **Curated Catalog & Quick View:** Instant product previews, dynamic image zoom, stock badges, specifications, and fast "Quick Add" actions.
- **Bangladesh Payment Gateway Integration:**
  - 📱 **bKash** (Merchant / Personal Send-Money with TrxID verification)
  - 🟠 **Nagad** (Direct merchant checkout & transaction logging)
  - 💳 **Credit / Debit Cards** (Visa, Mastercard, American Express with SSL encryption badge)
  - 🚚 **Cash on Delivery (COD)** with automatic Inside Dhaka (৳60) / Outside Dhaka (৳120) logistics calculation.
- **Multi-Currency Engine:** Instant price conversions across **BDT (৳)**, **USD ($)**, **EUR (€)**, and **GBP (£)** with persistent user preference.
- **Haute Salon Appointments:** Interactive booking system allowing VIP clients to schedule private styling and leather bespoke sessions.
- **Dynamic Search & Wishlist:** Live fuzzy search modal with instant suggestions, keyboard navigation, and persistent wishlist drawer.

---

### 👑 Atelier Admin Suite (`/atelier-admin`)
A full-page, independent administrative dashboard completely decoupled from the customer storefront:

| Module | Features & Capabilities |
| :--- | :--- |
| **📊 Executive Dashboard** | Real-time Gross Revenue, Monthly Inflow, Order Status distribution, Low-stock radar, and best-selling product charts. |
| **📦 Product Catalog** | Complete CRUD operations: title, description, category, SKU, stock quantity, BDT pricing, discount pricing, visibility toggle, and image management. |
| **📑 Category Engine** | Manage collection categories, descriptions, and cover imagery. |
| **📋 Inventory & Stock Control** | Live stock counts, out-of-stock / low-stock automated alerts, stock adjustment delta logs, and audit trails. |
| **🚚 Order Fulfillment** | Filter by order stage (`Pending` → `Confirmed` → `Processing` → `Dispatched` → `Delivered` → `Cancelled`), add courier tracking numbers, inspect customer shipping details, and print customer invoices. |
| **👥 Customer Directory (CRM)** | Customer profiles, verified purchase counts, lifetime order spending, and contact directory. |
| **📈 Analytics & Reports** | Revenue over time, average order value (AOV), top-performing SKUs, and one-click **Export to CSV**. |
| **🎟️ Coupons & Promotions** | Create percentage or fixed BDT discount codes, minimum order value thresholds, and expiration dates. |
| **⭐ Review Moderation** | Inspect, approve, reject, or delete customer product reviews. |
| **📅 Salon Appointment Desk** | Confirm, reschedule, or complete VIP in-person styling consultations. |
| **⚙️ Store & Gateway Settings** | Configure store name, contact email/phone, delivery rates, low-stock threshold, and payment gateway credentials. |
| **🔌 Supabase API Inspector** | Live connectivity test, latency diagnostic, and in-browser credential reconfiguration. |

---

## 📱 Responsive Matrix

The application has been engineered with a responsive design system supporting all screen sizes:

- **📱 Mobile Phones (320px – 640px):** 2-column compact luxury product grid, full-width sliding checkout drawers, mobile navigation bar with quick badges, and responsive admin dashboard.
- **📱 Tablets (641px – 1024px):** Adaptive 2-to-3 column layouts, responsive navigation bars, and touch-optimized data tables.
- **💻 Laptops & Desktop (1024px – 1440px):** 3-to-4 column editorial grid, fixed left sidebar in Admin Portal, and multi-pane order views.
- **🖥️ Ultra-Wide & 4K (> 1440px):** Centered max-width constraints (`max-w-7xl` / `max-w-5xl`) with high-DPI typography and asset scaling.

---

## 🛠️ Tech Stack & Architecture

```
Frontend:            React 19, TypeScript 5.7, Vite 8
Styling:             Tailwind CSS v4 (@tailwindcss/vite), Custom Modern CSS
Routing:             React Router DOM v7 (SPA with client-side history)
Database & BaaS:     Supabase (PostgreSQL 15, Row Level Security, Storage, Auth)
Formatter:           oxfmt (ultra-fast Rust-based JavaScript/TypeScript formatter)
Deployment:          Netlify (Production), Vercel (Compatible)
```

### 📁 Project Directory Structure

```text
├── public/
│   ├── _redirects              # Netlify SPA 200 rewrite rule
│   ├── 404.html                # Client-side routing fallback
│   └── favicon.svg             # Atelier crest icon
├── src/
│   ├── admin/                  # Dedicated Backoffice Application
│   │   ├── components/         # AdminSidebar, AdminTopNavbar, MetricCard, ConfirmationModal
│   │   ├── pages/              # 14 Admin Pages (Dashboard, Products, Orders, Inventory, etc.)
│   │   ├── services/           # Initial mock data and administrative helper services
│   │   ├── AdminApp.tsx        # Standalone Admin router and state orchestrator
│   │   └── AdminLogin.tsx      # Secure master admin authentication gateway
│   ├── components/             # Storefront Components
│   │   ├── common/             # Icon, Toast, ScrollToTop
│   │   ├── home/               # Hero, Categories, ProductGrid, Editorial, Testimonials
│   │   ├── layout/             # Navbar, Footer, AnnouncementBar
│   │   └── modals/             # CartDrawer, WishlistDrawer, CheckoutModal, SearchModal, etc.
│   ├── context/
│   │   └── ShopContext.tsx     # Global e-commerce state (Cart, Wishlist, Orders, Auth, BDT)
│   ├── data/                   # Initial catalog, currency rates, testimonials, and gallery
│   ├── lib/
│   │   └── supabase.ts         # Supabase client singleton, credential store, & connectivity tester
│   ├── services/               # authService, productService, orderService, appointmentService
│   ├── styles/
│   │   └── modal.css           # Custom modal animations and responsive overrides
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces (Product, Order, Customer, Coupon, etc.)
│   ├── App.tsx                 # Root application with route-level separation
│   ├── index.css               # Global Tailwind CSS v4 directives and luxury design tokens
│   └── main.tsx                # React DOM 19 entrypoint
├── supabase/
│   └── schema.sql              # Complete PostgreSQL database schema with RLS policies
├── netlify.toml                # Netlify build and redirect configuration
├── vercel.json                 # Vercel rewrite configuration
├── package.json                # Project dependencies and npm scripts
└── vite.config.ts              # Vite configuration with React and Tailwind CSS v4 plugins
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **Package Manager:** `npm`, `pnpm`, or `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/nazmusshakib878/Luxury.git
cd Luxury
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

> **Note:** The application includes a **Zero-Config Offline Fallback**. If Supabase credentials are not provided, the storefront and admin panel will seamlessly operate using local state and `localStorage`.

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or the port specified in terminal).

---

## 🗄️ Database Setup (Supabase)

To enable live cloud persistence for products, orders, and customer accounts:

1. Create a free project at [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy the entire contents of [`supabase/schema.sql`](file:///c:/Users/User/Desktop/Luxury%20E-Commerce%20Homepage/supabase/schema.sql).
4. Run the script. This creates:
   - `products`, `categories`, `orders`, `order_items`
   - `profiles` (User role management)
   - `coupons`, `reviews`, `appointments`, `inventory_logs`
   - `store_settings`, `payment_gateways`
   - Complete **Row Level Security (RLS)** policies and automatic timestamp triggers.

---

## 🔐 Administrative Access

The Admin Panel is located at:
```
https://luxuryshopbd.netlify.app/atelier-admin
# Local: http://localhost:3000/atelier-admin
```

### Authorized Master Admin Credentials
- **Email:** `nazmusshakib335@gmail.com`
- **Password:** `admin123456`
- **Instant Demo:** Click the **"👑 One-Click Login as Authorized Master Admin"** button on the login screen to access the full backoffice immediately.

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launches the local Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles TypeScript and packages production-ready assets into the `/dist` directory. |
| `npm run preview` | Locally serves the production build from `/dist`. |
| `npm run format` | Formats all code files using `oxfmt`. |

---

## 🌐 Deployment

### Netlify (Recommended)
This repository contains pre-configured [`public/_redirects`](file:///c:/Users/User/Desktop/Luxury%20E-Commerce%20Homepage/public/_redirects) and [`netlify.toml`](file:///c:/Users/User/Desktop/Luxury%20E-Commerce%20Homepage/netlify.toml) files.

1. Connect your repository to Netlify.
2. Set Build Command: `npm run build`
3. Set Publish Directory: `dist`
4. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in Netlify Site Settings.
5. Deploy!

### Vercel
This repository includes [`vercel.json`](file:///c:/Users/User/Desktop/Luxury%20E-Commerce%20Homepage/vercel.json) to handle single-page application routes automatically.
Import the repository on Vercel and deploy with default Vite settings.

---

## 📄 License & Credits

Developed with precision by **Nazmus Shakib** for **Aurélia Maison Paris** / **Luxury Shop BD**.

Released under the [MIT License](LICENSE).
