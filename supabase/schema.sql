-- ============================================================
-- COREÉATERY — Supabase Schema Lengkap (Goal 7)
-- Jalankan di: Supabase Dashboard > SQL Editor > New Query
-- Aman di-run berulang (pakai IF NOT EXISTS / OR REPLACE)
-- ============================================================

-- 1. USER ROLES
create table if not exists public.user_roles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'staff'
               check (role in ('admin', 'staff')),
  nama       text,
  created_at timestamptz not null default now()
);
alter table public.user_roles enable row level security;

create policy "admin can manage roles"
  on public.user_roles for all to authenticated
  using ((select role from public.user_roles where id = auth.uid()) = 'admin');

create policy "user can read own role"
  on public.user_roles for select to authenticated
  using (id = auth.uid());

create or replace function public.get_my_role()
returns text language sql security definer as $$
  select role from public.user_roles where id = auth.uid();
$$;

-- 2. RESERVASI
create table if not exists public.reservasi (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  nama         text not null,
  no_wa        text not null,
  email        text,
  jumlah_tamu  integer not null check (jumlah_tamu between 1 and 50),
  tanggal      date not null,
  jam          time not null,
  catatan      text,
  status       text not null default 'pending'
                 check (status in ('pending','confirmed','cancelled','completed')),
  confirmed_by text,
  confirmed_at timestamptz
);
create index if not exists reservasi_tanggal_idx on public.reservasi (tanggal);
create index if not exists reservasi_status_idx  on public.reservasi (status);
alter table public.reservasi enable row level security;

create policy "public can insert reservasi"
  on public.reservasi for insert to anon, authenticated with check (true);
create policy "authenticated can select reservasi"
  on public.reservasi for select to authenticated using (true);
create policy "authenticated can update reservasi"
  on public.reservasi for update to authenticated using (true);
create policy "authenticated can delete reservasi"
  on public.reservasi for delete to authenticated using (true);

-- 3. MENU ITEMS
create table if not exists public.menu_items (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  name          text not null,
  category_id   text not null,
  category_name text not null,
  price         text not null,
  description   text,
  badges        text[] default '{}',
  image_url     text,
  is_available  boolean not null default true,
  sort_order    integer default 0
);
create index if not exists menu_category_idx on public.menu_items (category_id);
alter table public.menu_items enable row level security;

create policy "public can read available menu"
  on public.menu_items for select to anon, authenticated
  using (is_available = true);
create policy "authenticated can manage menu"
  on public.menu_items for all to authenticated using (true);

-- 4. GALLERY ITEMS
create table if not exists public.gallery_items (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  image_url   text not null,
  alt         text not null,
  category    text not null,
  sort_order  integer default 0,
  is_visible  boolean not null default true
);
alter table public.gallery_items enable row level security;

create policy "public can read visible gallery"
  on public.gallery_items for select to anon, authenticated
  using (is_visible = true);
create policy "authenticated can manage gallery"
  on public.gallery_items for all to authenticated using (true);

-- 5. PROMOS
create table if not exists public.promos (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  title       text not null,
  description text,
  image_url   text,
  start_date  date,
  end_date    date,
  is_active   boolean not null default true
);
alter table public.promos enable row level security;

create policy "public can read active promos"
  on public.promos for select to anon, authenticated
  using (is_active = true);
create policy "authenticated can manage promos"
  on public.promos for all to authenticated using (true);

-- 6. AUTO-UPDATE updated_at trigger
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger menu_items_updated_at
  before update on public.menu_items
  for each row execute function public.handle_updated_at();

-- ============================================================
-- SETUP SETELAH SCHEMA:
-- 1. Buat user di Supabase Auth > Users > Add User
-- 2. INSERT INTO public.user_roles (id, role, nama)
--    VALUES ('<uuid-dari-auth>', 'admin', 'Andrew');
-- ============================================================

-- ============================================================
-- TAMBAHAN: tabel untuk admin dashboard
-- Jalankan setelah schema sebelumnya (tabel reservasi sudah ada)
-- ============================================================

-- Tabel menu items (sinkron dengan data di frontend, bisa di-CRUD dari dashboard)
create table if not exists public.menu_items (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  category_id  text not null,        -- e.g. 'nusantara-heritage'
  category_name text not null,
  name         text not null,
  price        text not null,        -- e.g. '38K', '67K / 70K'
  description  text,
  badges       text[] default '{}',  -- ['chef','favorite','spicy']
  image_url    text,
  is_available boolean not null default true,
  sort_order   integer default 0
);

-- Tabel promo / event
create table if not exists public.promos (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  title        text not null,
  description  text,
  image_url    text,
  valid_from   date,
  valid_until  date,
  is_active    boolean not null default true
);

-- Tabel gallery items
create table if not exists public.gallery_items (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  file_name    text not null,
  storage_path text not null,   -- path di Supabase Storage bucket 'gallery'
  alt_text     text not null,
  category     text not null default 'Semua',
  sort_order   integer default 0,
  is_active    boolean not null default true
);

-- RLS: semua tabel baru hanya bisa diakses authenticated
alter table public.menu_items   enable row level security;
alter table public.promos       enable row level security;
alter table public.gallery_items enable row level security;

create policy "auth read menu_items"    on public.menu_items    for select to authenticated using (true);
create policy "auth write menu_items"   on public.menu_items    for all    to authenticated using (true);
create policy "auth read promos"        on public.promos        for select to authenticated using (true);
create policy "auth write promos"       on public.promos        for all    to authenticated using (true);
create policy "auth read gallery_items" on public.gallery_items for select to authenticated using (true);
create policy "auth write gallery_items"on public.gallery_items for all    to authenticated using (true);

-- Public bisa baca menu & promo yang aktif (buat halaman publik nanti)
create policy "public read available menu" on public.menu_items
  for select to anon using (is_available = true);
create policy "public read active promos" on public.promos
  for select to anon using (is_active = true);
create policy "public read active gallery" on public.gallery_items
  for select to anon using (is_active = true);

-- Updated_at auto-trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger menu_items_updated_at   before update on public.menu_items   for each row execute function public.set_updated_at();
create trigger promos_updated_at       before update on public.promos       for each row execute function public.set_updated_at();
