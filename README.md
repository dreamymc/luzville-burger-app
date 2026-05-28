# 🍔 Luzville Burger App

A full-stack, lightweight web application for **Luzville Food Stall**, featuring a real-time public customer menu and a protected owner dashboard to manage categories, products, toppings, and siomai stock counts.

## 🛠️ Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Open `.env.local` and add your Supabase credentials and a custom setup token:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
OWNER_SETUP_TOKEN=your-custom-setup-token
```

### 3. Setup Database (Supabase SQL Editor)
1. Copy the contents of **`supabase/migrations/001_initial.sql`** and run it in the Supabase SQL Editor to create the schema and RLS policies.
2. Run **`supabase/seed.sql`** in the SQL Editor to populate sample categories, burgers, and siomai.

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** to view the customer menu.

---

## 🔑 Owner Onboarding & Dashboard

1. **One-Time Registration**: With your dev server running, visit:
   `http://localhost:3000/owner/setup?token=YOUR_OWNER_SETUP_TOKEN` (replace with your `.env.local` setup token).
2. Create your admin **Username** and **Password**.
3. **Log In**: Access the management dashboard at **`http://localhost:3000/owner`** (or `/owner/dashboard`).

---

## 🧪 Testing

To run the automated Playwright E2E tests:
```bash
python scripts/with_server.py --server "npm run dev" --port 3000 -- python test_luzville.py
```

---

## 🚀 Production Deployment (Vercel)

1. Push your codebase to a private GitHub repository.
2. Import the repository in **[Vercel](https://vercel.com)**.
3. Configure the environment variables in Vercel settings exactly as set in `.env.local`.
4. Once deployed, visit your live setup URL (`/owner/setup?token=...`) to register your production account.
5. **Security Lockdown**: For safety, **delete the `OWNER_SETUP_TOKEN`** variable from your Vercel Project Settings once registered, then trigger a redeploy to permanently disable the setup gate.
