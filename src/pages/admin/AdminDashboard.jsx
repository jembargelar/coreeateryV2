import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, Clock, TrendingUp, Bell } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl bg-charcoal border border-white/5 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="font-body text-2xl font-bold text-bone">{value ?? '—'}</p>
        <p className="font-body text-xs text-stone mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    pending:   'bg-gilt/15 text-gilt-soft',
    confirmed: 'bg-green-800/30 text-green-400',
    cancelled: 'bg-ember/15 text-ember-light',
    completed: 'bg-white/10 text-stone',
  }
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize ${map[status] ?? 'bg-white/5 text-stone'}`}>
      {status}
    </span>
  )
}

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null)
  const [recent, setRecent]   = useState([])
  const [loading, setLoading] = useState(true)
  const [newAlert, setNewAlert] = useState(null) // notif realtime

  const loadData = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0]
    const [all, pending, todayR, recentR] = await Promise.all([
      supabase.from('reservasi').select('id', { count: 'exact', head: true }),
      supabase.from('reservasi').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('reservasi').select('id', { count: 'exact', head: true }).eq('tanggal', today),
      supabase.from('reservasi').select('*').order('created_at', { ascending: false }).limit(8),
    ])
    setStats({ total: all.count ?? 0, pending: pending.count ?? 0, today: todayR.count ?? 0 })
    setRecent(recentR.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()

    // Realtime subscription — notif kalau ada reservasi baru masuk
    const channel = supabase
      .channel('reservasi-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reservasi' }, (payload) => {
        const r = payload.new
        setNewAlert(`Reservasi baru: ${r.nama} — ${r.tanggal} ${r.jam?.slice(0,5)}`)
        loadData() // refresh stats + tabel
        // Auto-dismiss setelah 8 detik
        setTimeout(() => setNewAlert(null), 8000)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [loadData])

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-7 h-7 rounded-full border-2 border-gilt border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Realtime alert */}
      {newAlert && (
        <div className="flex items-center gap-3 rounded-xl bg-gilt/15 border border-gilt/30 px-5 py-3 text-sm text-gilt-soft animate-fadeUp">
          <Bell size={16} className="shrink-0" />
          <span>{newAlert}</span>
          <button onClick={() => setNewAlert(null)} className="ml-auto text-stone hover:text-bone text-xs">✕</button>
        </div>
      )}

      <div>
        <h1 className="font-display font-semibold text-2xl md:text-3xl text-bone">Dashboard</h1>
        <p className="font-body text-sm text-stone mt-1">
          Selamat datang kembali di panel COREÉATERY.
          <span className="ml-2 text-[11px] text-stone/50">
            (Reservasi baru muncul otomatis — realtime)
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Reservasi"        value={stats?.total}   icon={TrendingUp}  color="bg-gilt/15 text-gilt" />
        <StatCard label="Menunggu Konfirmasi"    value={stats?.pending}  icon={Clock}       color="bg-amber-800/30 text-amber-400" />
        <StatCard label="Reservasi Hari Ini"     value={stats?.today}   icon={CalendarCheck} color="bg-ember/15 text-ember-light" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-body font-semibold text-bone">Reservasi Terbaru</h2>
          <Link to="/admin/reservasi" className="text-xs text-gilt-soft hover:text-gilt transition-colors">
            Lihat semua →
          </Link>
        </div>
        <div className="rounded-2xl bg-charcoal border border-white/5 overflow-hidden">
          {recent.length === 0 ? (
            <p className="text-center text-sm text-stone py-10">Belum ada reservasi.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-xs text-stone">
                    {['Nama','Tanggal','Jam','Tamu','Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map(r => (
                    <tr key={r.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3 text-bone font-medium">{r.nama}</td>
                      <td className="px-5 py-3 text-stone whitespace-nowrap">{r.tanggal}</td>
                      <td className="px-5 py-3 text-stone whitespace-nowrap">{r.jam?.slice(0,5)} WIB</td>
                      <td className="px-5 py-3 text-stone">{r.jumlah_tamu} org</td>
                      <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
