import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function ComingSoon({ title = 'Halaman Ini' }) {
  return (
    <section className="min-h-screen flex items-center justify-center px-5 text-center bg-obsidian">
      <div>
        <div className="w-16 h-16 rounded-full border border-gilt/40 flex items-center justify-center mx-auto mb-6">
          <div className="w-7 h-7 rounded-full border-2 border-gilt/60 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-ember" />
          </div>
        </div>
        <p className="font-body text-xs tracking-[0.3em] text-ember-light uppercase mb-3">
          Segera Hadir
        </p>
        <h1 className="font-display font-semibold text-3xl md:text-4xl text-bone mb-4">
          {title} Sedang Kami Siapkan
        </h1>
        <p className="font-body text-stone text-sm md:text-base max-w-md mx-auto mb-8">
          Halaman ini bagian dari pengembangan tahap berikutnya. Sementara
          itu, cek menu favorit kami atau hubungi kami langsung via
          WhatsApp dari halaman utama.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-gilt/40 hover:bg-gilt hover:text-obsidian transition-colors px-6 py-3 text-sm font-medium text-gilt-soft"
        >
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  )
}
