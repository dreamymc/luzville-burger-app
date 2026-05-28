-- ============================================================
-- Luzville Burger App — Initial Migration
-- Run this in Supabase SQL Editor or via supabase db push
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── shop_status ───────────────────────────────────────────────────────────
create table if not exists public.shop_status (
  id          integer primary key default 1,
  is_open     boolean not null default true,
  updated_at  timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- Ensure only one row ever exists
create or replace function public.set_shop_status_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger shop_status_updated_at
  before update on public.shop_status
  for each row execute function public.set_shop_status_updated_at();

-- ─── categories ────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  display_order integer not null default 0,
  is_active     boolean not null default true
);

create index idx_categories_display_order on public.categories(display_order);

-- ─── products ──────────────────────────────────────────────────────────────
create table if not exists public.products (
  id           uuid primary key default uuid_generate_v4(),
  category_id  uuid not null references public.categories(id) on delete cascade,
  name         text not null,
  description  text,
  price        numeric(10, 2) not null check (price >= 0),
  image_url    text,
  is_available boolean not null default true,
  stock_count  integer check (stock_count >= 0),
  created_at   timestamptz not null default now()
);

create index idx_products_category_id on public.products(category_id);
create index idx_products_is_available on public.products(is_available);

-- ─── product_options_groups ────────────────────────────────────────────────
create table if not exists public.product_options_groups (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references public.products(id) on delete cascade,
  group_name  text not null,
  is_required boolean not null default false,
  max_select  integer not null default 1 check (max_select >= 1)
);

create index idx_pog_product_id on public.product_options_groups(product_id);

-- ─── product_options ───────────────────────────────────────────────────────
create table if not exists public.product_options (
  id               uuid primary key default uuid_generate_v4(),
  group_id         uuid not null references public.product_options_groups(id) on delete cascade,
  option_name      text not null,
  additional_price numeric(10, 2) not null default 0 check (additional_price >= 0)
);

create index idx_po_group_id on public.product_options(group_id);

-- ─── siomai_types ──────────────────────────────────────────────────────────
create table if not exists public.siomai_types (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  meat_type       text not null,
  available_count integer not null default 0 check (available_count >= 0),
  is_available    boolean not null default true
);

-- ─── Row Level Security ────────────────────────────────────────────────────

-- shop_status: anyone can read, only authenticated can update
alter table public.shop_status enable row level security;

create policy "shop_status_read" on public.shop_status
  for select using (true);

create policy "shop_status_write" on public.shop_status
  for update using (auth.role() = 'authenticated');

-- categories: anyone can read, only authenticated can write
alter table public.categories enable row level security;

create policy "categories_read" on public.categories
  for select using (true);

create policy "categories_write" on public.categories
  for all using (auth.role() = 'authenticated');

-- products: anyone can read, only authenticated can write
alter table public.products enable row level security;

create policy "products_read" on public.products
  for select using (true);

create policy "products_write" on public.products
  for all using (auth.role() = 'authenticated');

-- product_options_groups: anyone can read, only authenticated can write
alter table public.product_options_groups enable row level security;

create policy "pog_read" on public.product_options_groups
  for select using (true);

create policy "pog_write" on public.product_options_groups
  for all using (auth.role() = 'authenticated');

-- product_options: anyone can read, only authenticated can write
alter table public.product_options enable row level security;

create policy "po_read" on public.product_options
  for select using (true);

create policy "po_write" on public.product_options
  for all using (auth.role() = 'authenticated');

-- siomai_types: anyone can read, only authenticated can write
alter table public.siomai_types enable row level security;

create policy "siomai_read" on public.siomai_types
  for select using (true);

create policy "siomai_write" on public.siomai_types
  for all using (auth.role() = 'authenticated');

-- ─── Realtime ──────────────────────────────────────────────────────────────
-- Enable realtime for customer-facing tables
alter publication supabase_realtime add table public.shop_status;
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.siomai_types;
