import { useEffect, useState } from 'react'
import { Menu, X, MessageCircle } from 'lucide-react'
import logoIcon from '../../assets/logo-icon-gold.jpg'
import { siteConfig, whatsappLink } from '../../data/siteConfig'

const NAV_LINKS = [
  { label: 'Beranda', href: '/#home' },
  { label: 'Tentang', href: '/#about' },
  { label: 'Menu', href: '/#menu' },
  { label: 'Galeri', href: '/#galeri' },
  { label: 'Reservasi', href: '/#reservasi' },
  { label: 'Kontak', href: '/#kontak' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'bg-obsidian/95 backdrop-blur-sm border-b border-gilt/15 py-3'
          : 'bg-gradient-to-b from-obsidian/70 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
        <a href="/#home" className="flex items-center gap-2.5 shrink-0">
          <img
            src={logoIcon}
            alt="COREÉATERY"
            className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover ring-1 ring-gilt/40"
          />
          <span className="font-display font-semibold tracking-wide text-lg md:text-xl">
            <span className="text-ember-light">CORE</span>
            <span className="text-bone">ÉATERY</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-sm tracking-wide text-stone hover:text-gilt-soft transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href={whatsappLink('Halo COREÉATERY, saya ingin bertanya-tanya.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ember hover:bg-ember-light transition-colors px-5 py-2.5 text-sm font-medium text-bone"
          >
            <MessageCircle size={16} />
            {siteConfig.contact.whatsappDisplay}
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 text-bone"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? 'max-h-96 opacity-100 mt-5' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 pb-5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 border-b border-white/5 text-bone font-body text-base"
            >
              {link.label}
            </a>
          ))}
          <a
            href={whatsappLink('Halo COREÉATERY, saya ingin bertanya-tanya.')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-ember px-5 py-3 text-sm font-medium text-bone"
          >
            <MessageCircle size={16} />
            Chat WhatsApp
          </a>
        </nav>
      </div>
    </header>
  )
}
