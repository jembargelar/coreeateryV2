import { useState } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, CalendarCheck, UtensilsCrossed,
  Image, Tag, LogOut, Menu, ChevronRight, Users, Home
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logoIcon from '../../assets/logo-icon-gold.jpg'

const NAV_ADMIN = [
  { to: '/admin',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/homepage',  icon: Home,            label: 'Halaman Utama' },
  { to: '/admin/reservasi', icon: CalendarCheck,   label: 'Reservasi' },
  { to: '/admin/menu',      icon: UtensilsCrossed, label: 'Menu' },
  { to: '/admin/galeri',    icon: Image,           label: 'Galeri' },
  { to: '/admin/promo',     icon: Tag,             label: 'Promo' },
]
const NAV_STAFF = [
  { to: '/admin',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/reservasi', icon: CalendarCheck,   label: 'Reservasi' },
]

function SidebarContent({ navLinks, user, role, signOut, onLinkClick }) {
  const { pathname } = useLocation()
  return (
    <>
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
        <img src={logoIcon} alt="" className="w-8 h-8 rounded-full ring-1 ring-gilt/40" />
        <div>
          <p className="font-display font-semibold text-sm text-bone leading-none">
            <span className="text-ember-light">CORE</span>ÉATERY
          </p>
          <p className="font-body text-[10px] text-stone mt-0.5">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navLinks.map(({ to, icon: Icon, label }) => {
          const active = to === '/admin' ? pathname === '/admin' : pathname.startsWith(to)
          return (
            <Link key={to} to={to} onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                active ? 'bg-gilt/15 text-gilt-soft font-medium' : 'text-stone hover:text-bone hover:bg-white/5'
              }`}>
              <Icon size={16} />{label}
              {active && <ChevronRight size={14} className="ml-auto text-gilt/60" />}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/5">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs text-bone truncate">{user?.email}</p>
          <p className="text-[10px] text-stone mt-0.5 capitalize flex items-center gap-1">
            <Users size={10} />{role}
          </p>
        </div>
        <button onClick={signOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-stone hover:text-ember-light hover:bg-ember/10 transition-colors">
          <LogOut size={16} />Keluar
        </button>
      </div>
    </>
  )
}

export default function AdminLayout({ children }) {
  const { user, role, loading, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-gilt border-t-transparent animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/admin/login" replace />

  const navLinks = role === 'admin' ? NAV_ADMIN : NAV_STAFF

  return (
    <div className="flex min-h-screen bg-obsidian">
      <aside className="hidden lg:flex flex-col w-56 bg-charcoal border-r border-white/5 min-h-screen sticky top-0 max-h-screen">
        <SidebarContent navLinks={navLinks} user={user} role={role} signOut={signOut} onLinkClick={() => {}} />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-obsidian/80" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 z-50 w-56 bg-charcoal border-r border-white/5 flex flex-col">
            <SidebarContent navLinks={navLinks} user={user} role={role} signOut={signOut} onLinkClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-charcoal sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-bone p-1"><Menu size={22} /></button>
          <span className="font-display font-semibold text-sm text-bone">
            <span className="text-ember-light">CORE</span>ÉATERY Admin
          </span>
          <button onClick={signOut} className="text-stone hover:text-ember-light p-1"><LogOut size={18} /></button>
        </div>
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  )
}
