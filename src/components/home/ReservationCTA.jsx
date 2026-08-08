import { MessageCircle, Clock, MapPin } from 'lucide-react'
import { siteConfig, whatsappLink } from '../../data/siteConfig'

export default function ReservationCTA() {
  return (
    <section
      id="reservasi"
      className="relative bg-gradient-to-br from-ember-dark via-ember to-ember-dark py-20 md:py-28 overflow-hidden"
    >
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full border border-bone/10" />
      <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full border border-bone/10" />

      <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
        <p className="font-body text-xs tracking-[0.3em] text-bone/70 uppercase mb-4">
          Reservasi
        </p>
        <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl text-bone text-balance">
          Amankan Meja Anda Hari Ini
        </h2>
        <p className="font-body text-bone/80 text-base md:text-lg mt-5 max-w-xl mx-auto leading-relaxed">
          Chat langsung tim kami di WhatsApp untuk reservasi — sebutkan
          nama, tanggal, jam, dan jumlah tamu.
        </p>

        <a
          href={whatsappLink(
            'Halo COREÉATERY, saya ingin reservasi meja atas nama [Nama] untuk tanggal [tanggal] pukul [jam], sejumlah [jumlah] orang.'
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full bg-bone hover:bg-obsidian hover:text-bone transition-colors px-8 py-4 text-base font-semibold text-obsidian mt-8"
        >
          <MessageCircle size={19} />
          Reservasi via WhatsApp
        </a>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 font-body text-sm text-bone/80">
          <span className="inline-flex items-center gap-2">
            <Clock size={15} />
            {siteConfig.hours.display} · {siteConfig.hours.note}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin size={15} />
            {siteConfig.address.short}
          </span>
        </div>
      </div>
    </section>
  )
}
