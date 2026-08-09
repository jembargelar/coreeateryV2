import { Images } from 'lucide-react'

export function AdminGallery() {
  return (
    <div>
      <h1 className="font-display font-semibold text-2xl text-bone mb-2">Gallery</h1>
      <p className="text-stone text-sm mb-8">Kelola foto yang ditampilkan di halaman galeri.</p>
      <div className="bg-charcoal rounded-2xl border border-white/5 p-10 text-center">
        <Images size={32} className="text-gilt-dim mx-auto mb-4" strokeWidth={1.5} />
        <p className="text-bone font-medium mb-2">Upload & kelola foto gallery</p>
        <p className="text-stone text-sm max-w-sm mx-auto">
          Fitur ini membutuhkan Supabase Storage. Jalankan schema.sql terlebih dahulu,
          lalu aktifkan bucket "gallery" di Supabase Dashboard &gt; Storage.
        </p>
      </div>
    </div>
  )
}

export function AdminPromo() {
  return (
    <div>
      <h1 className="font-display font-semibold text-2xl text-bone mb-2">Promo</h1>
      <p className="text-stone text-sm mb-8">Kelola promo dan event yang ditampilkan di website.</p>
      <div className="bg-charcoal rounded-2xl border border-white/5 p-10 text-center">
        <p className="text-bone font-medium mb-2">Manajemen Promo</p>
        <p className="text-stone text-sm max-w-sm mx-auto">
          Jalankan schema.sql di Supabase untuk mengaktifkan tabel promo,
          kemudian fitur ini akan tersedia sepenuhnya.
        </p>
      </div>
    </div>
  )
}
