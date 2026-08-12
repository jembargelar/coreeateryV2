import { ChevronDown, MessageCircle, UtensilsCrossed } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../../../hooks/useHomepageCMS'
import { whatsappLink } from '../../../data/siteConfig'
import defaultHero from '../../../assets/dishes/hero-nasigoreng.jpg'

export default function HeroSection({ data }) {
  const bgImage = getImageUrl(data.image_path) ?? defaultHero
  const extra   = data.extra ?? {}

  return (
    <section id="home" className="relative min-h-screen flex items-end md:items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={bgImage} alt="Hero COREÉATERY" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/60 via-transparent to-obsidian/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pb-20 pt-40 md:py-32 w-full">
        <div className="max-w-2xl animate-fadeUp">
          {extra.badge_text && (
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-gilt" />
              <p className="font-body text-xs md:text-sm tracking-[0.3em] text-gilt-soft uppercase">
                {extra.badge_text}
              </p>
            </div>
          )}

          <h1 className="font-display font-semibold text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-bone text-balance">
            {data.title?.includes('CORE') ? (
              <><span className="text-ember-light">CORE</span>{data.title.replace('CORE', '')}</>
            ) : data.title}
          </h1>

          {data.subtitle && (
            <p className="font-display italic text-xl md:text-2xl text-gilt-soft mt-3 tracking-wide">
              {data.subtitle}
            </p>
          )}

          {data.description && (
            <p className="font-body text-stone text-base md:text-lg mt-6 max-w-lg leading-relaxed">
              {data.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 mt-9">
            {data.cta_text && data.cta_url && (
              <Link to={data.cta_url}
                className="inline-flex items-center gap-2 rounded-full bg-gilt hover:bg-gilt-soft transition-colors px-7 py-3.5 text-sm font-semibold text-obsidian">
                <UtensilsCrossed size={17} />{data.cta_text}
              </Link>
            )}
            {extra.cta2_text && extra.cta2_url && (
              extra.cta2_url.startsWith('http') ? (
                <a href={extra.cta2_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-bone/25 hover:border-gilt/60 hover:text-gilt-soft transition-colors px-7 py-3.5 text-sm font-semibold text-bone">
                  <MessageCircle size={17} />{extra.cta2_text}
                </a>
              ) : (
                <Link to={extra.cta2_url}
                  className="inline-flex items-center gap-2 rounded-full border border-bone/25 hover:border-gilt/60 hover:text-gilt-soft transition-colors px-7 py-3.5 text-sm font-semibold text-bone">
                  <MessageCircle size={17} />{extra.cta2_text}
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      <a href="#about" aria-label="Scroll ke bawah"
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 text-stone hover:text-gilt-soft transition-colors animate-ringPulse">
        <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
        <ChevronDown size={18} />
      </a>
    </section>
  )
}
