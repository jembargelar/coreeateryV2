import { Link } from 'react-router-dom'
import { MessageCircle, Clock, MapPin, CalendarDays } from 'lucide-react'
import { whatsappLink, siteConfig } from '../../../data/siteConfig'

export default function ReservationCTASection({ data }) {
  const extra = data.extra ?? {}
  const hours      = extra.hours      || siteConfig.hours.display
  const hoursNote  = extra.hours_note || siteConfig.hours.note
  const address    = extra.address    || siteConfig.address.short

  return (
    <section id="reservasi" className="relative bg-gradient-to-br from-ember-dark via-ember to-ember-dark py-20 md:py-28 overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full border border-bone/10" />
      <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full border border-bone/10" />
      <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
        {data.subtitle && (
          <p className="font-body text-xs tracking-[0.3em] text-bone/70 uppercase mb-4">{data.subtitle}</p>
        )}
        <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl text-bone text-balance">
          {data.title}
        </h2>
        {data.description && (
          <p className="font-body text-bone/80 text-base md:text-lg mt-5 max-w-xl mx-auto leading-relaxed">
            {data.description}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {data.cta_text && data.cta_url && (
            <Link to={data.cta_url}
              className="inline-flex items-center gap-2.5 rounded-full bg-bone hover:bg-gilt-soft transition-colors px-8 py-4 text-base font-semibold text-obsidian">
              <CalendarDays size={19} />{data.cta_text}
            </Link>
          )}
          {extra.cta2_text && (
            <a href={whatsappLink('Halo COREÉATERY, saya ingin reservasi meja.')}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-bone/30 hover:border-bone/60 hover:text-bone transition-colors px-8 py-4 text-base font-semibold text-bone/80">
              <MessageCircle size={19} />{extra.cta2_text}
            </a>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 font-body text-sm text-bone/80">
          <span className="inline-flex items-center gap-2"><Clock size={15} />{hours} · {hoursNote}</span>
          <span className="inline-flex items-center gap-2"><MapPin size={15} />{address}</span>
        </div>
      </div>
    </section>
  )
}
