-- ============================================================
-- COREÉATERY — Supabase Schema
-- Jalankan di: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Tabel reservasi
create table if not exists public.reservasi (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),

  -- Data tamu
  nama         text not null,
  no_wa        text not null,       -- format: 08xxxxxxxxxx
  email        text,                -- opsional
  jumlah_tamu  integer not null check (jumlah_tamu between 1 and 50),

  -- Jadwal
  tanggal      date not null,
  jam          time not null,

  -- Kebutuhan tambahan
  catatan      text,                -- permintaan khusus, alergi, dsb

  -- Status: pending | confirmed | cancelled | completed
  status       text not null default 'pending'
                check (status in ('pending','confirmed','cancelled','completed')),

  -- Siapa yang konfirmasi (isi oleh admin nanti)
  confirmed_by text,
  confirmed_at timestamptz
);

-- Index buat query admin dashboard (filter by date, status)
create index if not exists reservasi_tanggal_idx on public.reservasi (tanggal);
create index if not exists reservasi_status_idx  on public.reservasi (status);

-- Row Level Security
alter table public.reservasi enable row level security;

-- Siapapun (public) bisa INSERT (submit reservasi baru)
create policy "public can insert reservasi"
  on public.reservasi
  for insert
  to anon, authenticated
  with check (true);

-- SELECT hanya untuk authenticated (admin/staff di dashboard)
create policy "authenticated can select reservasi"
  on public.reservasi
  for select
  to authenticated
  using (true);

-- UPDATE & DELETE hanya untuk authenticated
create policy "authenticated can update reservasi"
  on public.reservasi
  for update
  to authenticated
  using (true);

create policy "authenticated can delete reservasi"
  on public.reservasi
  for delete
  to authenticated
  using (true);

-- ============================================================
-- SELESAI. Tabel reservasi siap dipakai oleh form di website.
-- ============================================================
