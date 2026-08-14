import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

export default function ComingSoon({ title = 'Halaman' }) {
  const isNotFound = title === 'Halaman'

  return (
    <section className="min-h-screen flex items-center justify-center px-5 text-center bg-obsidian">
      <div>
        {/* Logo mark */}
        <div className="w-16 h-16 rounded-full border border-gilt/40 flex items-center justify-center mx-auto mb-6">
          <div className="w-7 h-7 rounded-full border-2 border-gilt/60 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-ember" />
          </div>
        </div>

        {isNotFound ? (
          <>
            <p className="font-body text-xs tracking-[0.3em] text-ember-light uppercase mb-3">404</p>
            <h1 className="font-display font-semibold text-3xl md:text-4xl text-bone mb-4">
              Halaman Tidak Ditemukan
            </h1>
            <p className="font-body text-stone text-sm md:text-base max-w-md mx-auto mb-8">
              Halaman yang lo cari tidak ada. Mungkin URL salah atau halaman sudah dipindahkan.
            </p>
          </>
        ) : (
          <>
            <p className="font-body text-xs tracking-[0.3em] text-ember-light uppercase mb-3">Segera Hadir</p>
            <h1 className="font-display font-semibold text-3xl md:text-4xl text-bone mb-4">
              {title} Sedang Kami Siapkan
            </h1>
            <p className="font-body text-stone text-sm md:text-base max-w-md mx-auto mb-8">
              Halaman ini sedang dalam pengembangan. Sementara itu, cek menu favorit atau hubungi kami langsung.
            </p>
          </>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/"
            className="inline-flex items-center gap-2 rounded-full bg-gilt hover:bg-gilt-soft transition-colors px-6 py-3 text-sm font-semibold text-obsidian">
            <Home size={16} />Beranda
          </Link>
          <Link to="/menu"
            className="inline-flex items-center gap-2 rounded-full border border-gilt/40 hover:bg-gilt hover:text-obsidian transition-colors px-6 py-3 text-sm font-medium text-gilt-soft">
            Lihat Menu
          </Link>
        </div>
      </div>
    </section>
  )
}
