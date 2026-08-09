import { useEffect, useState } from 'react'
import { CalendarCheck, Clock, CheckCircle2, XCircle, TrendingUp } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

function StatCard({ icon: Icon, label, value, color = 'text-gilt-soft', loading }) {
  return (
    <div className="bg-charcoal rounded-2xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="font-body text-xs text-stone uppercase tracking-wider">{label}</p>
        <Icon size={18} className={color} strokeWidth={1.75} />
      </div>
      <p className={`font-display font-semibold text-3xl ${loading ? 'text-stone/30 animate-pulse' : 'text-bone'}`}>
        {loading ? '—' : value}
      </p>
    </div>
  )
}

export default function AdminDashboard() {
  const { role } = useAuth()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [recent, setRecent]   = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split('T')[0]
      const [
        { count: total },
        { count: pending },
        { count: confirmed },
        { count: todayCount },
      ] = await Promise.all([
        supabase.from('reservasi').select('*', { count: 'exact', head: true }),
        supabase.from('reservasi').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('reservasi').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
        supabase.from('reservasi').select('*', { count: 'exact', head: true }).eq('tanggal', today),
      ])
      setStats({ total, pending, confirmed, today: todayCount })

      const { data } = await supabase
        .from('reservasi')
        .select('id,nama,tanggal,jam,jumlah_tamu,status,created_at')
        .order('created_at', { ascending: false })
        .limit(6)
      setRecent(data ?? [])
      setLoading(false)
    }
    fetchStats()
  }, [])

  const STATUS_STYLE = {
    pending:   'bg-gilt/15 text-gilt-soft',
    confirmed: 'bg-green-500/15 text-green-400',
    cancelled: 'bg-ember/15 text-ember-light',
    completed: 'bg-white/10 text-stone',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-semibold text-2xl md:text-3xl text-bone">
          Dashboard
        </h1>
        <p className="font-body text-sm text-stone mt-1">
          Selamat datang{role === 'admin' ? ', Admin' : ''}. Ini ringkasan hari ini.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={CalendarCheck}  label="Total Reservasi"  value={stats?.total}     loading={loading} />
        <StatCard icon={Clock}          label="Menunggu"          value={stats?.pending}   loading={loading} color="text-gilt-soft" />
        <StatCard icon={CheckCircle2}   label="Dikonfirmasi"      value={stats?.confirmed} loading={loading} color="text-green-400" />
        <StatCard icon={TrendingUp}     label="Reservasi Hari Ini" value={stats?.today}   loading={loading} color="text-ember-light" />
      </div>

      {/* Recent reservasi */}
      <div className="bg-charcoal rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-body font-semibold text-sm text-bone">
            Reservasi Terbaru
          </h2>
          <a
            href="/admin/reservasi"
            className="text-xs text-gilt-soft hover:text-gilt underline underline-offset-2"
          >
            Lihat semua
          </a>
        </div>

        {loading ? (
          <div className="p-8 text-center text-stone text-sm">Memuat...</div>
        ) : recent.length === 0 ? (
          <div className="p-8 text-center text-stone text-sm">Belum ada reservasi.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Nama', 'Tanggal', 'Jam', 'Tamu', 'Status'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs text-stone uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recent.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 text-bone font-medium">{r.nama}</td>
                    <td className="px-5 py-3 text-stone">
                      {new Date(r.tanggal + 'T00:00:00').toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3 text-stone">{r.jam?.slice(0,5)} WIB</td>
                    <td className="px-5 py-3 text-stone">{r.jumlah_tamu} org</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${STATUS_STYLE[r.status] ?? ''}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
