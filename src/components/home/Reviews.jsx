import { Star, IceCreamCone } from 'lucide-react'
import { siteConfig } from '../../data/siteConfig'

export default function Reviews() {
  return (
    <section className="relative bg-bone text-obsidian py-24 md:py-28">
      <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
        <div className="flex justify-center gap-1 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={20} className="fill-gilt text-gilt" />
          ))}
        </div>
        <h2 className="font-display font-semibold text-3xl sm:text-4xl text-balance">
          Kepuasan Anda Prioritas Kami
        </h2>
        <p className="font-body text-obsidian/65 text-base md:text-lg mt-5 leading-relaxed">
          Sudah makan di COREÉATERY? Bagikan momen berharga Anda lewat
          Google Review — sebagai ucapan terima kasih, dapatkan{' '}
          <span className="font-semibold text-ember">ice cream gratis</span>{' '}
          untuk kunjungan berikutnya.
        </p>
        <a
          href={siteConfig.maps.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-obsidian hover:bg-ember transition-colors px-7 py-3.5 text-sm font-semibold text-bone mt-8"
        >
          <IceCreamCone size={17} />
          Tulis Google Review
        </a>
      </div>
    </section>
  )
}
