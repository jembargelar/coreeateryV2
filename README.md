# COREÉATERY — Website

Restoran fusion Nusantara, Western & Jepang di Cianjur. Dibangun dengan
React 19 + Vite + Tailwind CSS, backend Supabase.

## Status Pengembangan

Roadmap lengkap ada 11 Goal. Status saat ini:

- [x] **Goal 1 — Foundation**: Vite + React + Tailwind + React Router + struktur folder
- [x] **Goal 2 — Landing Page**: Navbar, Hero, About, Menu Favorit, Promotion, Gallery, Reviews, Reservation CTA, Footer — semua dengan data & foto asli
- [ ] Goal 3 — Halaman Menu lengkap (search, filter, kategori)
- [ ] Goal 4 — Reservasi online (form + Supabase)
- [ ] Goal 5 — Gallery lengkap (masonry, lazy load)
- [ ] Goal 6 — Admin Dashboard (CRUD, auth admin/staff)
- [ ] Goal 7 — Backend Supabase (schema, RLS, realtime)
- [ ] Goal 8-11 — SEO, integrasi, deployment, pengembangan lanjutan

## Jalanin di Lokal

\`\`\`bash
npm install
cp .env.example .env   # lalu isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
npm run dev
\`\`\`

Buka http://localhost:5173

## Build Production

\`\`\`bash
npm run build      # output ke folder dist/
npm run preview    # preview hasil build
\`\`\`

## Struktur Folder

\`\`\`
src/
├── assets/          # logo, foto dish (hasil ekstrak dari menu PDF)
├── components/
│   ├── layout/      # Navbar, Footer
│   └── home/        # Hero, About, MenuFavorit, Promotion, Gallery, Reviews, ReservationCTA
├── data/
│   ├── siteConfig.js     # SEMUA data bisnis (alamat, WA, jam, IG, maps) — edit di sini
│   └── menuFavorites.js  # data menu favorit landing page
├── lib/
│   └── supabaseClient.js # koneksi Supabase (dipakai mulai Goal 4/6/7)
├── pages/
│   ├── Home.jsx
│   └── ComingSoon.jsx     # placeholder utk /menu /reservasi /galeri (Goal 3-5)
├── App.jsx           # routing
└── main.jsx
\`\`\`

## Edit Info Bisnis (alamat, jam, WhatsApp, dll)

Semua ada di satu file: \`src/data/siteConfig.js\`. Ganti di situ,
otomatis update di seluruh halaman (navbar, footer, reservasi CTA, dll).

## Deploy ke Vercel

1. Buka vercel.com -> Add New Project -> import repo jembargelar/coreeateryV2
2. Framework preset: Vite (otomatis terdeteksi)
3. Di Environment Variables, tambahkan:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   (value sama seperti di .env lokal -- JANGAN commit .env ke git)
4. Deploy. Setiap git push ke branch main akan auto-deploy ulang.

## Environment Variables

Lihat \`.env.example\`. Wajib diisi:

| Variable | Keterangan |
|---|---|
| VITE_SUPABASE_URL | URL project Supabase |
| VITE_SUPABASE_ANON_KEY | Anon/publishable key Supabase (aman untuk frontend) |

## Catatan

- Beberapa foto di menu PDF asli mengandung sisa branding template lama
  ("Cafedeh" / brand lain) -- foto-foto tersebut sengaja tidak dipakai
  di website ini. Rekomendasi: perbaiki juga di file menu PDF aslinya.
- Font: Fraunces (display/heading) + Inter (body), dimuat dari Google Fonts.
- Warna brand (tailwind.config.js): obsidian (dasar gelap), ember (merah),
  gilt (emas), bone (putih hangat) -- diambil dari logo asli COREÉATERY.
