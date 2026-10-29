-- ====================================================================
-- LUXURY SHOP BD (AURÉLIA MAISON PARIS) — SUPABASE POSTGRESQL SCHEMA
-- ====================================================================
-- Run this complete script in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ====================================================================

-- 1. Enable required extensions
create extension if not exists "uuid-ossp";

-- ====================================================================
-- 2. CREATE TABLES
-- ====================================================================

-- A. Categories Table
create table if not exists public.categories (
    id text primary key,
    name text not null,
    note text,
    image text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- B. Products Table
create table if not exists public.products (
    id bigint primary key,
    name text not null,
    subtitle text not null,
    category text not null,
    category_type text not null references public.categories(id) on update cascade,
    price numeric(12, 2) not null check (price >= 0),
    rating numeric(3, 1) default 5.0 check (rating >= 0 and rating <= 5),
    reviews_count integer default 0 check (reviews_count >= 0),
    badge text,
    image text not null,
    additional_images text[] default array[]::text[],
    description text not null,
    details text[] default array[]::text[],
    dimensions text,
    materials text not null,
    in_stock boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- C. Customer & User Profiles Table (Linked with Supabase Auth)
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    email text unique,
    phone text,
    address text,
    city text,
    postal_code text,
    country text default 'Bangladesh',
    role text default 'customer' check (role in ('customer', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- D. Orders Table
create table if not exists public.orders (
    id text primary key, -- e.g. 'AUR-892410'
    user_id uuid references auth.users(id) on delete set null,
    full_name text not null,
    email text not null,
    phone text,
    address text not null,
    city text not null,
    postal_code text,
    country text default 'Bangladesh' not null,
    subtotal numeric(12, 2) not null check (subtotal >= 0),
    discount_amount numeric(12, 2) default 0 check (discount_amount >= 0),
    promo_code text,
    total numeric(12, 2) not null check (total >= 0),
    currency_code text default 'BDT' not null,
    currency_rate numeric(8, 2) default 120.0 not null,
    status text default 'In Atelier' check (status in ('Processing', 'In Atelier', 'Dispatched', 'Delivered', 'Cancelled')),
    payment_method text default 'card',
    payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'refunded', 'failed')),
    tracking_number text unique not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- E. Order Items Table
create table if not exists public.order_items (
    id uuid default gen_random_uuid() primary key,
    order_id text not null references public.orders(id) on delete cascade,
    product_id bigint references public.products(id) on delete set null,
    product_name text not null,
    quantity integer not null check (quantity > 0),
    unit_price numeric(12, 2) not null check (unit_price >= 0),
    total_price numeric(12, 2) not null check (total_price >= 0),
    image text,
    selected_size text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- F. Salon Appointments Table
create table if not exists public.appointments (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete set null,
    client_name text not null,
    email text not null,
    phone text not null,
    city text not null, -- 'Dhaka — Gulshan 2 Salon', etc.
    preferred_date date not null,
    preferred_time text not null,
    advisor text not null,
    notes text,
    status text default 'Confirmed' check (status in ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- 3. HELPER FUNCTIONS & TRIGGERS
-- ====================================================================

-- Helper: Check if current user is an admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Trigger: Automatically create public.profiles record when a new user signs up in auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    'customer'
  )
  on conflict (id) do update set
    email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ====================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.appointments enable row level security;

-- Categories RLS
create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

create policy "Categories can be modified only by admins"
  on public.categories for all
  using (public.is_admin());

-- Products RLS
create policy "Products are viewable by everyone"
  on public.products for select
  using (in_stock = true or public.is_admin());

create policy "Products can be modified only by admins"
  on public.products for all
  using (public.is_admin());

-- Profiles RLS
create policy "Users can view their own profile or admin can view all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Orders RLS
create policy "Customers can view their own orders or admin can view all"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Anyone can create an order"
  on public.orders for insert
  with check (true);

create policy "Only admin can update orders"
  on public.orders for update
  using (public.is_admin());

-- Order Items RLS
create policy "Customers can view items of their own orders or admin can view all"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "Anyone can create order items"
  on public.order_items for insert
  with check (true);

-- Appointments RLS
create policy "Users can view their own appointments or admin can view all"
  on public.appointments for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Anyone can book an appointment"
  on public.appointments for insert
  with check (true);

create policy "Only admin can update appointments"
  on public.appointments for update
  using (public.is_admin());

-- ====================================================================
-- 5. INITIAL SEED DATA
-- ====================================================================

-- Insert Categories
insert into public.categories (id, name, note, image)
values
  ('leather', 'The Signature Bags', 'Sculptural silhouettes', 'https://images.unsplash.com/photo-1590739225287-bd31519780c3?auto=format&fit=crop&w=1000&q=85'),
  ('fragrance', 'Fine Fragrance', 'Rare and evocative', 'https://images.unsplash.com/photo-1628001242958-957834454d40?auto=format&fit=crop&w=1000&q=85'),
  ('silk', 'Modern Icons', 'Enduring essentials', 'https://images.unsplash.com/photo-1654254124839-851f6103d1f2?auto=format&fit=crop&w=1000&q=85')
on conflict (id) do nothing;

-- Insert Products
insert into public.products (
  id, name, subtitle, category, category_type, price, rating, reviews_count, badge,
  image, additional_images, description, details, dimensions, materials, in_stock
)
values
  (
    1,
    'Élan Sculpted Tote',
    'Italian calfskin',
    'Italian calfskin',
    'leather',
    1280.00,
    4.9,
    48,
    'New',
    'https://images.unsplash.com/photo-1546241183-0ed3f8a4a824?auto=format&fit=crop&w=900&q=85',
    array['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85'],
    'A masterclass in modern geometry and heritage saddlery. The Élan Tote features architectural curves hand-beveled from full-grain Tuscan calfskin, accented with 24k gold-plated brass hardware.',
    array['Hand-painted raw edges, burnished in our Paris atelier', 'Interior zip pocket and dedicated key lanyard', 'Custom magnetic lock clasp with subtle Aurélia crest', 'Includes protective organic cotton dustbag'],
    '36cm (W) x 28cm (H) x 14cm (D)',
    '100% Full-grain Italian calfskin, Suede lining',
    true
  ),
  (
    2,
    'No. 04 Eau de Parfum',
    'Sandalwood · Iris',
    'Sandalwood · Iris',
    'fragrance',
    240.00,
    4.8,
    64,
    'Bestseller',
    'https://images.unsplash.com/photo-1627823569857-4d8581dc62b2?auto=format&fit=crop&w=900&q=85',
    array['https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85'],
    'An ethereal balance of rare Florentine iris and aged Australian sandalwood, elevated by smoky cardamom and dry ambergris. A fragrance that whispers quiet opulence.',
    array['Extrait concentration with 28% pure fragrance oils', 'Hand-blown flacon with magnetic heavy-weight cap', 'Macerated for six months in Grasse, France', 'Genderless signature composition'],
    '100ml / 3.4 fl. oz.',
    'Glass flacon, organic alcohol, rare botanical essences',
    true
  ),
  (
    3,
    'Atelier Frame Bag',
    'Hand-finished leather',
    'Hand-finished leather',
    'leather',
    980.00,
    5.0,
    32,
    'Exclusive',
    'https://images.unsplash.com/photo-1575403538007-acb790100421?auto=format&fit=crop&w=900&q=85',
    array['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=85'],
    'Drawing inspiration from mid-century doctor bags, the Atelier Frame Bag pairs vintage hinged mechanics with minimalist lines. Perfectly sized for daytime poise and evening soirees.',
    array['Solid brass frame with brushed pale-gold patina', 'Detachable slender leather crossbody strap', 'Cardholder slot with debossed serial number', 'Reinforced structured base with protective metal feet'],
    '26cm (W) x 18cm (H) x 10cm (D)',
    'Box-calf leather, Lambskin interior',
    true
  ),
  (
    4,
    'Ligne Silk Scarf',
    'Mulberry silk',
    'Mulberry silk',
    'silk',
    190.00,
    4.9,
    51,
    null,
    'https://images.unsplash.com/photo-1605619082574-e92eee603b95?auto=format&fit=crop&w=900&q=85',
    array['https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=900&q=85'],
    'Spun from weightless 18-momme mulberry silk twill, printed by hand in Lyon using traditional screen stencils. Featuring lyrical architectural line drawings of Paris.',
    array['Hand-rolled and hand-stitched roulotté edges', 'Natural organic silk dyes with archival longevity', 'Presented in an embossed Aurélia presentation box'],
    '90cm x 90cm square',
    '100% Grade 6A Mulberry Silk Twill',
    true
  ),
  (
    5,
    'Sienna Fold Crossbody',
    'Grained saddle leather',
    'Grained saddle leather',
    'leather',
    850.00,
    4.9,
    29,
    'Popular',
    'https://images.unsplash.com/photo-1590739225287-bd31519780c3?auto=format&fit=crop&w=900&q=85',
    array['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85'],
    'Form follows tactile serenity in the Sienna Fold. Designed with an origami-inspired folded gusset that expands gracefully while retaining a trim profile against the body.',
    array['Adjustable strap with discreet teardrop pin closure', 'Exterior slip pocket for fast phone retrieval', 'Polished edge lacquer applied in four coats'],
    '24cm (W) x 16cm (H) x 8cm (D)',
    'Full-grain French saddle calfskin',
    true
  ),
  (
    6,
    'Cèdre Blanc Extrait',
    'Atlas Cedar · Bergamot',
    'Atlas Cedar · Bergamot',
    'fragrance',
    310.00,
    5.0,
    19,
    'Limited Edition',
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85',
    array['https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85'],
    'An olfactory journey to high mountain mist. Crisp Calabrian bergamot gives way to sacred Atlas cedarwood, white moss, and velvety musk.',
    array['Numbered production limited to 500 bottles annually', 'Includes travel atomizer in matching pebbled leather sleeve', 'Cold-extracted botanical notes'],
    '100ml / 3.4 fl. oz.',
    'Hand-polished crystal glass, aged wood extract',
    true
  ),
  (
    7,
    'L''Ombre Silk Carré',
    'Chiaroscuro weave',
    'Chiaroscuro weave',
    'silk',
    220.00,
    4.8,
    37,
    'New',
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=900&q=85',
    array['https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=900&q=85'],
    'Draped in twilight tones of espresso and champagne, this carré celebrates shadow and light with a soft fluid drape that glides effortlessly across the skin.',
    array['Double-sided chromatic contrast printing', 'French hand-rolled hem finish', 'Ultra-soft matte silk finish'],
    '70cm x 70cm square',
    '100% Organic Mulberry Silk',
    true
  ),
  (
    8,
    'Vendôme Pocket Wallet',
    'Calfskin & Gold trim',
    'Calfskin & Gold trim',
    'leather',
    380.00,
    4.9,
    82,
    'Essential',
    'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85',
    array['https://images.unsplash.com/photo-1606503829068-d069c9705a5b?auto=format&fit=crop&w=900&q=85'],
    'Slender yet accommodating, the Vendôme slides effortlessly into jacket or bag pockets. Features eight card slots, a central currency slip, and reinforced corners.',
    array['RFID blocking security membrane integrated', 'Subtle foil-stamped gold foil monogramming option', 'Hand-waxed linen thread stitching'],
    '11.5cm (W) x 9cm (H) x 1.2cm (D)',
    'Vegetable-tanned full-grain leather',
    true
  )
on conflict (id) do nothing;

