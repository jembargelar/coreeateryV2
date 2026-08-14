import { Clock, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import IconInstagram from '../icons/IconInstagram'
import logoIcon from '../../assets/logo-icon-gold.jpg'
import { siteConfig, whatsappLink } from '../../data/siteConfig'

const QUICK_LINKS = [
  { label: 'Beranda',   to: '/'          },
  { label: 'Tentang',   to: '/#about'    },
  { label: 'Menu',      to: '/menu'      },
  { label: 'Galeri',    to: '/galeri'    },
  { label: 'Reservasi', to: '/reservasi' },
  { label: 'Kontak',    to: '/#kontak'   },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="kontak" className="relative bg-obsidian border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-16 md:pt-20 pb-8">
        <div className="grid md:grid-cols-[1.2fr_1fr_1fr_1.3fr] gap-10 md:gap-8">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src={logoIcon} alt="COREÉATERY"
                className="w-9 h-9 rounded-full object-cover ring-1 ring-gilt/40" />
              <span className="font-display font-semibold text-lg">
                <span className="text-ember-light">CORE</span>
                <span className="text-bone">ÉATERY</span>
              </span>
            </Link>
            <p className="font-body text-sm text-stone leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-sm text-stone hover:text-gilt-soft transition-colors">
              <IconInstagram size={16} />
              {siteConfig.social.instagramHandle}
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-body text-xs tracking-[0.2em] text-gilt uppercase mb-4">Navigasi</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(l => (
                <li key={l.to}>
                  <Link to={l.to}
                    className="font-body text-sm text-stone hover:text-bone transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-body text-xs tracking-[0.2em] text-gilt uppercase mb-4">Kontak</h3>
            <ul className="space-y-3.5 font-body text-sm text-stone">
              <li className="flex gap-2.5">
                <MapPin size={16} className="shrink-0 mt-0.5 text-gilt-dim" />
                <span>{siteConfig.address.full}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone size={16} className="shrink-0 mt-0.5 text-gilt-dim" />
                <a href={whatsappLink('Halo COREÉATERY, saya ingin bertanya-tanya.')}
                  target="_blank" rel="noopener noreferrer"
                  className="hover:text-bone transition-colors">
                  {siteConfig.contact.whatsappDisplay}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Clock size={16} className="shrink-0 mt-0.5 text-gilt-dim" />
                <span>
                  {siteConfig.hours.display}
                  <br />{siteConfig.hours.note}
                </span>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <h3 className="font-body text-xs tracking-[0.2em] text-gilt uppercase mb-4">Lokasi</h3>
            <a href={siteConfig.maps.directionsUrl} target="_blank" rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-gilt/40 transition-all h-36">
              <iframe
                title="Lokasi COREÉATERY"
                src={`https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent(siteConfig.address.full)}`}
                width="100%" height="100%"
                style={{ border: 0, filter: 'grayscale(0.3) contrast(1.05)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none"
              />
            </a>
            <a href={siteConfig.maps.directionsUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-gilt-soft hover:text-gilt transition-colors">
              <MapPin size={12} />Buka petunjuk arah →
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-stone/70">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="font-body text-xs text-stone/50 italic">
            {siteConfig.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
