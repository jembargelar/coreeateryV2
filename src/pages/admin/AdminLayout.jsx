import { useState } from 'react'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CalendarCheck, UtensilsCrossed, Images,
  Megaphone, Menu, X, LogOut, ChevronRight, Shield,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logoIcon from '../../assets/logo-icon-gold.jpg'

const NAV_ITEMS = [
  { to: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/admin/reservasi',  label: 'Reservasi',  icon: CalendarCheck },
  { to: '/admin/menu',       label: 'Menu',       icon: UtensilsCrossed, adminOnly: false },
  { to: '/admin/gallery',    label: 'Gallery',    icon: Images,          adminOnly: true },
  { to: '/admin/promo',      label: 'Promo',      icon: Megaphone,       adminOnly: true },
]

function SidebarLink({ item, role, onClick }) {
  if (item.adminOnly && role !== 'admin') return null
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
          isActive
            ? 'bg-gilt/15 text-gilt-soft font-medium'
            : 'text-stone hover:text-bone hover:bg-white/5'
        }`
      }
    >
      <item.icon size={18} strokeWidth={1.75} />
      {item.label}
    </NavLink>
  )
}

export default function AdminLayout() {
  const { user, role, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gilt border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-obsidian flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-charcoal border-r border-white/5 py-6 px-3">
        <SidebarContent role={role} onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-obsidian/80"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="w-60 h-full bg-charcoal border-r border-white/5 py-6 px-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-stone hover:text-bone"
            >
              <X size={20} />
            </button>
            <SidebarContent
              role={role}
              onLogout={handleLogout}
              onNavClick={() => setSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-charcoal/95 backdrop-blur border-b border-white/5 px-5 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-stone hover:text-bone p-1"
            >
              <Menu size={22} />
            </button>
            <ChevronRight size={14} className="text-white/20 hidden lg:block" />
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              role === 'admin'
                ? 'bg-gilt/20 text-gilt-soft'
                : 'bg-white/10 text-stone'
            }`}>
              {role === 'admin' ? '⚑ Admin' : 'Staff'}
            </span>
            <span className="text-xs text-stone hidden sm:block truncate max-w-[160px]">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-stone hover:text-ember-light transition-colors p-1.5"
              title="Logout"
            >
              <LogOut size={17} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ role, onLogout, onNavClick }) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-4 mb-8">
        <img
          src={logoIcon}
          alt="COREÉATERY"
          className="w-8 h-8 rounded-full object-cover ring-1 ring-gilt/40"
        />
        <span className="font-display font-semibold text-base">
          <span className="text-ember-light">CORE</span>
          <span className="text-bone">ÉATERY</span>
        </span>
      </div>

      <p className="px-4 text-[10px] uppercase tracking-widest text-stone/50 mb-2">
        Menu
      </p>
      <nav className="space-y-0.5 flex-1">
        {NAV_ITEMS.map((item) => (
          <SidebarLink
            key={item.to}
            item={item}
            role={role}
            onClick={onNavClick}
          />
        ))}
      </nav>

      <div className="mt-auto pt-6 px-4 border-t border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={13} className="text-gilt-dim" />
          <span className="text-xs text-stone/70 capitalize">{role ?? 'staff'}</span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm text-stone hover:text-ember-light transition-colors w-full"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  )
}
