import { ExternalLink } from 'lucide-react'
import IconInstagram from '../icons/IconInstagram'
import { siteConfig } from '../../data/siteConfig'

// Instagram tidak ada public embedding API gratis yang reliable tanpa token Meta.
// Best practice: tampilkan CTA follow yang menarik + link ke profil.
// Kalau mau embed feed otomatis nanti, bisa pakai Elfsight atau EmbedSocial (berbayar).
export default function InstagramSection() {
  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <IconInstagram size={20} className="text-gilt" strokeWidth={1.5} />
          <p className="font-body text-xs tracking-[0.3em] text-gilt uppercase">Instagram</p>
        </div>
        <h2 className="font-display font-semibold text-2xl sm:text-3xl text-bone mb-3">
          {siteConfig.social.instagramHandle}
        </h2>
        <p className="font-body text-stone text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
          Lihat foto-foto terbaru, promo, dan momen spesial dari COREÉATERY.
          Follow untuk update pertama setiap kali ada menu baru atau event.
        </p>

        {/* Preview cards — placeholder visual, klik buka Instagram */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-8 max-w-xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <a
              key={i}
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square rounded-lg bg-obsidian/60 border border-white/5 hover:border-gilt/30 transition-colors flex items-center justify-center group"
            >
              <IconInstagram size={18} className="text-stone/30 group-hover:text-gilt/50 transition-colors" />
            </a>
          ))}
        </div>

        <a
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-bone hover:bg-gilt-soft transition-colors px-7 py-3 text-sm font-semibold text-obsidian"
        >
          <IconInstagram size={16} />
          Buka di Instagram
          <ExternalLink size={13} />
        </a>
      </div>
    </section>
  )
}
