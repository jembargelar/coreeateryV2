import { ChevronDown, MessageCircle, UtensilsCrossed } from 'lucide-react'
import heroImg from '../../assets/dishes/hero-nasigoreng.jpg'
import { whatsappLink } from '../../data/siteConfig'

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-end md:items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Sajian signature COREÉATERY"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/60 via-transparent to-obsidian/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pb-20 pt-40 md:py-32 w-full">
        <div className="max-w-2xl animate-fadeUp">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-gilt" />
            <p className="font-body text-xs md:text-sm tracking-[0.3em] text-gilt-soft uppercase">
              Cianjur — Fusion Dining
            </p>
          </div>

          <h1 className="font-display font-semibold text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-bone text-balance">
            <span className="text-ember-light">CORE</span>ÉATERY
          </h1>
          <p className="font-display italic text-xl md:text-2xl text-gilt-soft mt-3 tracking-wide">
            Savor The Taste
          </p>

          <p className="font-body text-stone text-base md:text-lg mt-6 max-w-lg leading-relaxed">
            Nusantara, Western, dan Jepang bertemu dalam satu meja — dari
            steak dan pasta, rice bowl dan soto hangat, hingga dessert
            artisan. Disajikan dalam suasana premium di jantung Cianjur.
          </p>

          <div className="flex flex-wrap gap-4 mt-9">
            <a
              href="#menu"
              className="inline-flex items-center gap-2 rounded-full bg-gilt hover:bg-gilt-soft transition-colors px-7 py-3.5 text-sm font-semibold text-obsidian"
            >
              <UtensilsCrossed size={17} />
              Lihat Menu
            </a>
            <a
              href={whatsappLink(
                'Halo COREÉATERY, saya ingin reservasi meja.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-bone/25 hover:border-gilt/60 hover:text-gilt-soft transition-colors px-7 py-3.5 text-sm font-semibold text-bone"
            >
              <MessageCircle size={17} />
              Reservasi Sekarang
            </a>
          </div>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll ke bawah"
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 text-stone hover:text-gilt-soft transition-colors animate-ringPulse"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
        <ChevronDown size={18} />
      </a>
    </section>
  )
}
