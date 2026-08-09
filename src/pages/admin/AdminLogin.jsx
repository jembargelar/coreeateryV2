import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logoIcon from '../../assets/logo-icon-gold.jpg'

export default function AdminLogin() {
  const { user, loading, login } = useAuth()
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]     = useState('')
  const [submitting, setSub]  = useState(false)

  // Sudah login → redirect ke dashboard
  if (!loading && user) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Email dan password wajib diisi.'); return }
    setSub(true); setError('')
    const { error: err } = await login(email, password)
    setSub(false)
    if (err) {
      setError(
        err.message.includes('Invalid login credentials')
          ? 'Email atau password salah.'
          : err.message
      )
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={logoIcon}
            alt="COREÉATERY"
            className="w-16 h-16 rounded-full ring-2 ring-gilt/40 object-cover mb-4"
          />
          <h1 className="font-display font-semibold text-2xl text-bone">
            <span className="text-ember-light">CORE</span>ÉATERY
          </h1>
          <p className="font-body text-xs text-stone mt-1 tracking-widest uppercase">
            Admin Panel
          </p>
        </div>

        <div className="bg-charcoal rounded-2xl border border-white/5 p-7">
          <h2 className="font-display font-medium text-lg text-bone mb-6">
            Masuk ke Dashboard
          </h2>

          {error && (
            <div className="mb-5 rounded-xl bg-ember/10 border border-ember/30 px-4 py-3 flex items-start gap-2 text-sm text-ember-light">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-medium text-stone uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@coreeatery.com"
                autoComplete="email"
                className="w-full bg-obsidian border border-white/10 focus:border-gilt/50 rounded-xl px-4 py-3 text-sm text-bone placeholder:text-stone/50 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-obsidian border border-white/10 focus:border-gilt/50 rounded-xl px-4 py-3 pr-11 text-sm text-bone placeholder:text-stone/50 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-bone p-1"
                  aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 rounded-full bg-ember hover:bg-ember-light disabled:opacity-60 disabled:cursor-wait transition-colors py-3 text-sm font-semibold text-bone flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              {submitting ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-stone/50 mt-6">
          Halaman ini khusus untuk tim COREÉATERY.
        </p>
      </div>
    </div>
  )
}
