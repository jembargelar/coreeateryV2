import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logoIcon from '../../assets/logo-icon-gold.jpg'

export default function AdminLogin() {
  const { user, signIn } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  if (user) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Email dan password wajib diisi.'); return }
    setLoading(true)
    setError(null)
    const { error: authErr } = await signIn(email.trim(), password)
    if (authErr) {
      setError(
        authErr.message === 'Invalid login credentials'
          ? 'Email atau password salah.'
          : authErr.message
      )
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img src={logoIcon} alt="COREÉATERY" className="w-16 h-16 rounded-full ring-2 ring-gilt/40 mb-4" />
          <h1 className="font-display font-semibold text-2xl text-bone">
            <span className="text-ember-light">CORE</span>ÉATERY
          </h1>
          <p className="font-body text-xs text-stone mt-1 tracking-widest uppercase">Admin Dashboard</p>
        </div>

        <div className="rounded-2xl bg-charcoal border border-white/8 p-7">
          <h2 className="font-body font-semibold text-bone mb-6 text-center">Masuk ke Dashboard</h2>

          {error && (
            <div className="mb-4 rounded-xl bg-ember/10 border border-ember/30 px-4 py-3 flex items-start gap-2 text-sm text-ember-light">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-[11px] font-medium text-stone uppercase tracking-wider mb-2">
                <Mail size={12} />Email
              </label>
              <input type="email" value={email} onChange={(e)=>{setEmail(e.target.value);setError(null)}}
                placeholder="admin@coreeatery.com" autoComplete="email"
                className="w-full bg-obsidian border border-white/10 focus:border-gilt/50 rounded-xl px-4 py-3 text-sm text-bone placeholder:text-stone/40 outline-none transition-colors" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-[11px] font-medium text-stone uppercase tracking-wider mb-2">
                <Lock size={12} />Password
              </label>
              <div className="relative">
                <input type={showPass?'text':'password'} value={password}
                  onChange={(e)=>{setPassword(e.target.value);setError(null)}}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full bg-obsidian border border-white/10 focus:border-gilt/50 rounded-xl px-4 py-3 pr-11 text-sm text-bone placeholder:text-stone/40 outline-none transition-colors" />
                <button type="button" onClick={()=>setShowPass(v=>!v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-bone" tabIndex={-1}>
                  {showPass?<EyeOff size={16}/>:<Eye size={16}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded-full bg-ember hover:bg-ember-light disabled:opacity-60 disabled:cursor-wait transition-colors py-3 text-sm font-semibold text-bone mt-2">
              {loading?'Masuk...':'Masuk'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-stone/40 mt-6">Akses terbatas untuk tim COREÉATERY</p>
      </div>
    </div>
  )
}
