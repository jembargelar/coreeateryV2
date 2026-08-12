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

-- ============================================================
-- STORAGE: bucket untuk foto galeri
-- Jalankan di Supabase SQL Editor SETELAH schema utama
-- ============================================================

-- Buat storage bucket 'gallery' (public = bisa diakses tanpa auth)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,
  5242880, -- max 5MB per file
  array['image/jpeg','image/jpg','image/png','image/webp']
)
on conflict (id) do nothing;

-- Policy: siapapun bisa lihat/download (public bucket)
create policy "public read gallery"
  on storage.objects for select
  to public
  using (bucket_id = 'gallery');

-- Policy: hanya authenticated (admin/staff) yang bisa upload
create policy "auth upload gallery"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery');

-- Policy: hanya authenticated yang bisa hapus
create policy "auth delete gallery"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery');

-- ============================================================
-- CMS: tabel homepage_sections
-- Simpan semua konten section homepage yang bisa diedit admin
-- ============================================================

create table if not exists public.homepage_sections (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  section_key  text not null unique, -- 'hero' | 'about' | 'menu_favorit' | 'promotion' | 'gallery' | 'reviews' | 'reservation_cta'
  title        text,
  subtitle     text,
  description  text,
  cta_text     text,
  cta_url      text,
  image_path   text,   -- path di Supabase Storage bucket 'homepage'
  extra        jsonb,  -- data tambahan fleksibel per section (badge, warna, dsb)
  is_visible   boolean not null default true,
  sort_order   integer not null default 0
);

-- Auto updated_at
create trigger homepage_sections_updated_at
  before update on public.homepage_sections
  for each row execute function public.set_updated_at();

-- RLS
alter table public.homepage_sections enable row level security;

-- Publik bisa baca (buat render homepage)
create policy "public read homepage_sections"
  on public.homepage_sections for select
  to anon, authenticated
  using (true);

-- Hanya authenticated (admin) yang bisa edit
create policy "auth write homepage_sections"
  on public.homepage_sections for all
  to authenticated
  using (true);

-- Storage bucket untuk foto homepage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'homepage',
  'homepage',
  true,
  10485760, -- 10MB (hero image perlu resolusi lebih tinggi)
  array['image/jpeg','image/jpg','image/png','image/webp']
)
on conflict (id) do nothing;

create policy "public read homepage storage"
  on storage.objects for select
  to public
  using (bucket_id = 'homepage');

create policy "auth upload homepage storage"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'homepage');

create policy "auth update homepage storage"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'homepage');

create policy "auth delete homepage storage"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'homepage');

-- ============================================================
-- SEED: data default semua section (jalankan sekali)
-- Kalau section sudah ada, skip (on conflict do nothing)
-- ============================================================

insert into public.homepage_sections (section_key, title, subtitle, description, cta_text, cta_url, extra, is_visible, sort_order) values
(
  'hero',
  'COREÉATERY',
  'Savor The Taste',
  'Nusantara, Western, dan Jepang bertemu dalam satu meja — dari steak dan pasta, rice bowl dan soto hangat, hingga dessert artisan. Disajikan dalam suasana premium di jantung Cianjur.',
  'Lihat Menu',
  '/menu',
  '{"cta2_text": "Reservasi Sekarang", "cta2_url": "/reservasi", "badge_text": "Cianjur — Fusion Dining"}',
  true, 1
),
(
  'about',
  'Cerita di Balik COREÉATERY',
  'Tentang Kami',
  'COREÉATERY hadir merayakan pertemuan tiga dunia rasa — kehangatan Nusantara, kemewahan Western, dan presisi Jepang. Dari kalio khas Padang hingga porterhouse steak, dari rice bowl teriyaki hingga habanero soup, setiap hidangan diracik dengan bahan pilihan dan bumbu yang meresap sempurna.',
  null,
  null,
  '{"visi": "Menjadi ruang makan pilihan yang menghadirkan pengalaman fusion premium, di mana kualitas rasa dan kenyamanan bersanding setara.", "nilai_1_title": "Cita Rasa Otentik", "nilai_1_desc": "Setiap resep diracik dengan bumbu pilihan dan teknik matang yang menjaga keaslian rasa.", "nilai_2_title": "Kualitas Premium", "nilai_2_desc": "Bahan segar, penyajian rapi, dan standar dapur yang konsisten.", "nilai_3_title": "Pengalaman Berkesan", "nilai_3_desc": "Dari sambutan hingga suapan terakhir, kami merancang momen makan yang layak dikenang."}',
  true, 2
),
(
  'menu_favorit',
  'Hidangan Pilihan Kami',
  'Menu Favorit',
  'Sebagian dari yang paling dicari tamu kami — harga dalam ribuan rupiah (K).',
  'Lihat Menu Lengkap',
  '/menu',
  '{"featured_ids": ["fish-n-fries", "habanero-seafood", "ayam-rempah-bakar", "fettucine-carbonara", "beef-teriyaki-don", "sop-iga-bakar", "chicken-sambal-matah"]}',
  true, 3
),
(
  'promotion',
  'Promo & Event Terbaru',
  'Promo',
  'Info diskon, menu musiman, dan event spesial kami umumkan lebih dulu di Instagram. Follow @coreeatery biar ga ketinggalan.',
  'Follow @coreeatery',
  'https://www.instagram.com/coreeatery',
  null,
  true, 4
),
(
  'gallery',
  'Sekilas dari COREÉATERY',
  'Galeri',
  null,
  'Lihat Semua Foto',
  '/galeri',
  null,
  true, 5
),
(
  'reviews',
  'Kepuasan Anda Prioritas Kami',
  'Review',
  'Sudah makan di COREÉATERY? Bagikan momen berharga Anda lewat Google Review — sebagai ucapan terima kasih, dapatkan ice cream gratis untuk kunjungan berikutnya.',
  'Tulis Google Review',
  'https://www.google.com/maps/search/?api=1&query=COREEATERY+Cianjur',
  null,
  true, 6
),
(
  'reservation_cta',
  'Amankan Meja Anda Hari Ini',
  'Reservasi',
  'Chat langsung tim kami di WhatsApp untuk reservasi — sebutkan nama, tanggal, jam, dan jumlah tamu.',
  'Reservasi Online',
  '/reservasi',
  '{"cta2_text": "via WhatsApp", "hours": "10.00 – 22.00 WIB", "hours_note": "Setiap hari", "address": "Jl. Mangunsarkoro No.105, Cianjur"}',
  true, 7
)
on conflict (section_key) do nothing;

