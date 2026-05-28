# 🍔 Luzville Burger App

A full-stack, lightweight, and high-performance web application designed for **Luzville Food Stall**, a local business specializing in fresh burgers, siomai, and various frozen products.

The application features a beautifully tailored, sun-drenched Filipino market stall aesthetic, offering:
1. **Public Customer Catalogue**: Real-time menu updates (open/closed status, product availability, and live siomai stock counts).
2. **Secure Owner Dashboard**: Easy-to-use control panel for stall owners to toggle shop status, manage category order, edit products with customizeable option groups, and instantly update stock counts on mobile devices.

---

## ⚡ Tech Stack & Architecture

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS + Custom OKLCH Design Tokens (Curated Warm Amber & Saffron Palette)
- **Database & Auth**: Supabase (PostgreSQL + RLS + real-time subscriptions)
- **Deployment**: Vercel (Frontend) + Supabase (Backend/Database)
- **Design Paradigm**: **Hallmark-guided** (Catalogue Macrostructure for Customers, Workbench for Stall Owners)
- **Testing**: Playwright for end-to-end user flow verification

---

## 🚀 Getting Started

### 1. Prerequisite Checklist

- Node.js 18+ installed
- A free Supabase account and project created
- A free Vercel account (optional, for deployment)

### 2. Local Environment Setup

Clone this repository and install dependencies:

```bash
npm install
```

Copy the `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your Supabase project credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# One-time Owner Setup token
OWNER_SETUP_TOKEN=register_owner_secure_token_123
```

### 3. Database Schema setup (Supabase Dashboard)

1. Go to your **Supabase Dashboard** -> **SQL Editor**.
2. Create a new query, paste the contents of `supabase/migrations/001_initial.sql` and run it. This creates tables for categories, products, option groups, siomai counts, and shop status with proper **Row Level Security (RLS)** policies.
3. (Optional but highly recommended) Run `supabase/seed.sql` to populate the database with delicious sample burgers, siomai types, and default categories.

### 4. Create Owner Account (One-Time Setup)

To log into the Owner Dashboard, you need an owner account in Supabase. You can create one using either method below:

#### Method A: One-time Registration Route (Recommended)
1. Start the development server (`npm run dev`).
2. Visit `http://localhost:3000/owner/setup?token=YOUR_OWNER_SETUP_TOKEN` (replace with the token defined in your `.env.local`).
3. Fill in your email and password, and click **Create Owner Account**.
4. **IMPORTANT**: For security, remove the `OWNER_SETUP_TOKEN` environment variable from your production environment once your owner account is set up to permanently disable the setup route.

#### Method B: Manual Dashboard Setup
1. Open the **Supabase Dashboard** -> **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Enter the email and password, and click **Save**.

---

## 💻 Development & Deployment

### Run Locally

Start Turbopack dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the customer catalogue. Access the owner dashboard at `/owner` (unauthenticated users will be redirected to the login screen).

### Build for Production

Ensure clean compilation and type checking:

```bash
npm run build
```

---

## 🧪 Testing with Playwright

End-to-end integration tests are designed using Playwright. 

To run the automated tests using the `webapp-testing` script:

```bash
# Step 1: Install Playwright browsers (first-time setup)
npx playwright install

# Step 2: Launch the test suite with the dev server managed automatically
python scripts/with_server.py --server "npm run dev" --port 3000 -- python test_luzville.py
```

---

## 📂 Project Structure

```
/
├── tokens.css                       # Hallmark design tokens (color palette, spacing, typography)
├── .hallmark/
│   └── log.json                     # Hallmark project design compliance audit log
├── app/
│   ├── globals.css                  # Hallmark-stamped global stylesheet imports tokens.css
│   ├── layout.tsx                   # Main layout
│   ├── (public)/                    # Public routes (Customer view)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── owner/                       # Protected routes (Owner dashboard)
│       ├── layout.tsx
│       ├── login/page.tsx
│       ├── dashboard/page.tsx
│       ├── categories/page.tsx
│       ├── products/page.tsx
│       └── siomai/page.tsx
├── components/
│   ├── ui/                          # UI blocks
│   │   └── Badge.tsx
│   ├── layout/                      # Shared layouts (headers, navigations)
│   │   ├── Header.tsx
│   │   └── OwnerNav.tsx
│   ├── customer/                    # Customer views and modals
│   └── owner/                       # Stall management forms and lists
├── lib/
│   └── supabase/                    # Supabase browser, server, and middleware clients
├── types/
│   └── index.ts                     # TypeScript database schema mapping & interfaces
├── middleware.ts                    # Protects owner panel routes using Supabase Session Guard
└── supabase/                        # Database scripts and migrations
```

---

## 🎨 Creative Philosophy

Luzville Burger App rejects standard cold corporate SaaS gradients in favor of **warm cream paper backgrounds (`oklch(97% 0.018 85)`)**, **vibrant saffron ambers**, **rich red chili colors**, and **tactile food-market display fonts (`Syne` + `Plus Jakarta Sans`)**. 

All interactions feature strict 8-state design discipline (hover, focus, disabled, loading) to ensure the cooker panel functions flawlessly in a busy, greasy kitchen environment on small mobile screens.
