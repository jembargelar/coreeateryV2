import { useEffect, useState, useCallback } from 'react'
import { Search, X, RefreshCw, MessageCircle, Phone, Users, Calendar, Clock, FileText } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

const STATUS_OPTIONS = ['semua', 'pending', 'confirmed', 'cancelled', 'completed']
const STATUS_COLOR = {
  pending:   'bg-gilt/15 text-gilt-soft border-gilt/20',
  confirmed: 'bg-green-800/30 text-green-400 border-green-800/30',
  cancelled: 'bg-ember/15 text-ember-light border-ember/20',
  completed: 'bg-white/8 text-stone border-white/10',
}

function Badge({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium border capitalize ${STATUS_COLOR[status] ?? 'bg-white/5 text-stone border-white/10'}`}>
      {status}
    </span>
  )
}

export default function AdminReservasi() {
  const { role } = useAuth()
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [filterStatus, setFS]   = useState('semua')
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('reservasi').select('*').order('created_at', { ascending: false })
    if (filterStatus !== 'semua') q = q.eq('status', filterStatus)
    const { data } = await q
    const filtered = (data ?? []).filter(r => {
      if (!search) return true
      const s = search.toLowerCase()
      return r.nama?.toLowerCase().includes(s) || r.no_wa?.includes(s)
    })
    setItems(filtered)
    setLoading(false)
  }, [filterStatus, search])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id, status) => {
    setUpdating(true)
    await supabase.from('reservasi').update({ status, confirmed_by: 'admin', confirmed_at: new Date().toISOString() }).eq('id', id)
    setUpdating(false)
    setSelected(prev => prev ? { ...prev, status } : null)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl text-bone">Manajemen Reservasi</h1>
          <p className="font-body text-sm text-stone mt-1">{items.length} reservasi ditemukan</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-full border border-white/10 hover:border-gilt/30 px-4 py-2 text-xs text-stone hover:text-bone transition-colors">
          <RefreshCw size={14} />Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama atau no WA..."
            className="w-full bg-charcoal border border-white/10 focus:border-gilt/40 rounded-full pl-9 pr-4 py-2.5 text-sm text-bone placeholder:text-stone/50 outline-none transition-colors" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone"><X size={14} /></button>}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => setFS(s)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium capitalize transition-colors ${
                filterStatus === s ? 'bg-gilt text-obsidian' : 'bg-charcoal border border-white/10 text-stone hover:text-bone'
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-charcoal border border-white/5 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-7 h-7 rounded-full border-2 border-gilt border-t-transparent animate-spin" /></div>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-stone py-16">Tidak ada reservasi ditemukan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-stone">
                  {['Nama & WA','Tanggal & Jam','Tamu','Catatan','Status','Aksi'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(r => (
                  <tr key={r.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-bone font-medium">{r.nama}</p>
                      <a href={`https://wa.me/${r.no_wa?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                        className="text-[11px] text-gilt-soft hover:text-gilt flex items-center gap-1">
                        <MessageCircle size={11}/>{r.no_wa}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-stone whitespace-nowrap">
                      <span className="flex items-center gap-1"><Calendar size={12}/>{r.tanggal}</span>
                      <span className="flex items-center gap-1 mt-0.5"><Clock size={12}/>{r.jam?.slice(0,5)}</span>
                    </td>
                    <td className="px-4 py-3 text-stone">
                      <span className="flex items-center gap-1"><Users size={12}/>{r.jumlah_tamu} org</span>
                    </td>
                    <td className="px-4 py-3 text-stone text-xs max-w-[160px]">
                      <span className="line-clamp-2">{r.catatan || '—'}</span>
                    </td>
                    <td className="px-4 py-3"><Badge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(r)}
                        className="rounded-full border border-white/10 hover:border-gilt/40 px-3 py-1 text-xs text-stone hover:text-bone transition-colors">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-obsidian/90 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-charcoal border border-white/10 rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <h2 className="font-display font-semibold text-xl text-bone">Detail Reservasi</h2>
              <button onClick={() => setSelected(null)} className="text-stone hover:text-bone"><X size={20}/></button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ['Nama', selected.nama],
                ['No WA', selected.no_wa],
                ['Email', selected.email || '—'],
                ['Tanggal', selected.tanggal],
                ['Jam', selected.jam?.slice(0,5) + ' WIB'],
                ['Jumlah Tamu', selected.jumlah_tamu + ' orang'],
                ['Catatan', selected.catatan || '—'],
                ['Dibuat', new Date(selected.created_at).toLocaleString('id-ID')],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <span className="text-stone w-28 shrink-0">{k}</span>
                  <span className="text-bone">{v}</span>
                </div>
              ))}
              <div className="flex gap-3 items-center">
                <span className="text-stone w-28 shrink-0">Status</span>
                <Badge status={selected.status} />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-white/5">
              <a href={`https://wa.me/${selected.no_wa?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-green-700 hover:bg-green-600 px-4 py-2 text-xs font-medium text-white transition-colors">
                <MessageCircle size={13}/>Hubungi WA
              </a>
              {selected.status === 'pending' && (
                <button disabled={updating} onClick={() => updateStatus(selected.id, 'confirmed')}
                  className="rounded-full bg-gilt hover:bg-gilt-soft text-obsidian px-4 py-2 text-xs font-medium disabled:opacity-50 transition-colors">
                  ✓ Konfirmasi
                </button>
              )}
              {['pending','confirmed'].includes(selected.status) && (
                <button disabled={updating} onClick={() => updateStatus(selected.id, 'cancelled')}
                  className="rounded-full bg-ember/20 hover:bg-ember/30 text-ember-light px-4 py-2 text-xs font-medium disabled:opacity-50 transition-colors">
                  ✕ Batalkan
                </button>
              )}
              {selected.status === 'confirmed' && (
                <button disabled={updating} onClick={() => updateStatus(selected.id, 'completed')}
                  className="rounded-full bg-white/10 hover:bg-white/15 text-stone px-4 py-2 text-xs font-medium disabled:opacity-50 transition-colors">
                  ✓ Selesai
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
