-- ============================================================
-- Luzville Burger App — Seed Data
-- Run AFTER the migration: 001_initial.sql
-- ============================================================

-- ─── Shop Status (single row, starts OPEN) ────────────────────
insert into public.shop_status (id, is_open) values (1, true)
on conflict (id) do update set is_open = excluded.is_open;

-- ─── Categories ───────────────────────────────────────────────
insert into public.categories (id, name, display_order, is_active) values
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Burgers',        1, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Siomai',         2, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Snacks',         3, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Others',         4, true);

-- ─── Products — Burgers ───────────────────────────────────────
insert into public.products (id, category_id, name, description, price, is_available, stock_count) values
  (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Classic Luzville Burger',
    'Our signature beef patty on a toasted bun with lettuce, tomato, and secret sauce.',
    75.00, true, null
  ),
  (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Double Smash Burger',
    'Two smashed beef patties, cheddar, caramelized onion, house pickles.',
    120.00, true, null
  );

-- ─── Option Groups — Classic Burger ───────────────────────────
insert into public.product_options_groups (id, product_id, group_name, is_required, max_select) values
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21',
    'Add-ons',
    false,
    3
  ),
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21',
    'Patty Type',
    true,
    1
  );

insert into public.product_options (group_id, option_name, additional_price) values
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'Add Egg',           10.00),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'Add Cheese',        10.00),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'Extra Sauce',        5.00),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'Beef (default)',     0.00),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'Chicken',           10.00);

-- ─── Option Groups — Double Smash Burger ──────────────────────
insert into public.product_options_groups (id, product_id, group_name, is_required, max_select) values
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Add-ons',
    false,
    3
  );

insert into public.product_options (group_id, option_name, additional_price) values
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Extra Patty',       50.00),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Add Bacon',         20.00),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Add Egg',           10.00);

-- ─── Products — Snacks ────────────────────────────────────────
insert into public.products (id, category_id, name, description, price, is_available, stock_count) values
  (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'Chicharon (Pork Rinds)',
    'Crispy pork rinds, lightly salted. Perfect snack.',
    25.00, true, 20
  ),
  (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'Nova Chips',
    'Classic cheese flavored corn chips.',
    15.00, true, null
  );

-- ─── Products — Others ────────────────────────────────────────
insert into public.products (id, category_id, name, description, price, is_available, stock_count) values
  (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a25',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'Frozen Lumpia (12pcs)',
    'Pre-made spring rolls, ready to fry at home.',
    85.00, true, 10
  );

-- ─── Siomai Types ─────────────────────────────────────────────
insert into public.siomai_types (name, meat_type, available_count, is_available) values
  ('Pork Siomai',   'Pork',   50, true),
  ('Shrimp Siomai', 'Shrimp', 30, true);
