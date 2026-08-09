import { useCallback, useEffect, useState } from 'react'
import {
  Search, X, Phone, MessageCircle, ChevronDown,
  CheckCircle2, XCircle, RotateCcw, CalendarCheck,
} from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { whatsappLink } from '../../data/siteConfig'

const STATUSES = ['semua', 'pending', 'confirmed', 'cancelled', 'completed']

const STATUS_STYLE = {
  pending:   'bg-gilt/15 text-gilt-soft border-gilt/20',
  confirmed: 'bg-green-500/15 text-green-400 border-green-500/20',
  cancelled: 'bg-ember/15 text-ember-light border-ember/20',
  completed: 'bg-white/10 text-stone border-white/10',
}

const STATUS_NEXT = {
  pending:   [{ label: 'Konfirmasi', value: 'confirmed', icon: CheckCircle2, color: 'text-green-400' },
              { label: 'Batalkan',   value: 'cancelled', icon: XCircle,      color: 'text-ember-light' }],
  confirmed: [{ label: 'Selesai',   value: 'completed', icon: CheckCircle2, color: 'text-stone' },
              { label: 'Batalkan',  value: 'cancelled',  icon: XCircle,      color: 'text-ember-light' }],
  cancelled: [{ label: 'Pending lagi', value: 'pending', icon: RotateCcw, color: 'text-gilt-soft' }],
  completed: [],
}

export default function AdminReservasi() {
  const [reservasi, setReservasi] = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('semua')
  const [query, setQuery]         = useState('')
  const [selected, setSelected]   = useState(null)   // detail drawer
  const [updating, setUpdating]   = useState(null)   // id yang sedang diupdate

  const fetch = useCallback(async () => {
    setLoading(true)
    let q = supabase
      .from('reservasi')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'semua') q = q.eq('status', filter)

    const { data } = await q
    setReservasi(data ?? [])
    setLoading(false)
  }, [filter])

  useEffect(() => { fetch() }, [fetch])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    await supabase
      .from('reservasi')
      .update({ status, confirmed_at: status === 'confirmed' ? new Date().toISOString() : null })
      .eq('id', id)
    await fetch()
    setUpdating(null)
    if (selected?.id === id) setSelected((p) => ({ ...p, status }))
  }

  const filtered = reservasi.filter((r) => {
    if (!query) return true
    const q = query.toLowerCase()
    return r.nama.toLowerCase().includes(q) || r.no_wa.includes(q)
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-semibold text-2xl text-bone mb-1">Reservasi</h1>
        <p className="font-body text-sm text-stone">Kelola reservasi masuk dari tamu.</p>
      </div>

      {/* Filter + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau nomor WA..."
            className="w-full bg-charcoal border border-white/10 focus:border-gilt/40 rounded-xl pl-9 pr-8 py-2.5 text-sm text-bone placeholder:text-stone/50 outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium capitalize transition-colors ${
                filter === s ? 'bg-gilt text-obsidian' : 'bg-charcoal border border-white/10 text-stone hover:text-bone'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-charcoal rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-stone text-sm">Memuat...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-stone text-sm">
            {query ? 'Tidak ada hasil.' : 'Belum ada reservasi.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Nama & WA','Tanggal','Jam','Tamu','Status','Aksi'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-stone uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                    onClick={() => setSelected(r)}
                  >
                    <td className="px-4 py-3">
                      <p className="text-bone font-medium">{r.nama}</p>
                      <p className="text-stone text-xs mt-0.5">{r.no_wa}</p>
                    </td>
                    <td className="px-4 py-3 text-stone whitespace-nowrap">
                      {new Date(r.tanggal + 'T00:00:00').toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-stone">{r.jam?.slice(0,5)}</td>
                    <td className="px-4 py-3 text-stone text-center">{r.jumlah_tamu}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium capitalize border ${STATUS_STYLE[r.status] ?? ''}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1.5">
                        {(STATUS_NEXT[r.status] ?? []).map((action) => (
                          <button
                            key={action.value}
                            disabled={updating === r.id}
                            onClick={() => updateStatus(r.id, action.value)}
                            title={action.label}
                            className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-40 ${action.color}`}
                          >
                            <action.icon size={15} />
                          </button>
                        ))}
                        <a
                          href={whatsappLink(`Halo ${r.nama}, konfirmasi reservasi Anda di COREÉATERY pada tanggal ${r.tanggal} pukul ${r.jam?.slice(0,5)} WIB untuk ${r.jumlah_tamu} orang sudah kami terima.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Hubungi via WA"
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-stone hover:text-green-400"
                        >
                          <MessageCircle size={15} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-stone/50 mt-3">
        {filtered.length} reservasi {filter !== 'semua' ? `(${filter})` : ''}
      </p>

      {/* Detail drawer */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-obsidian/70 backdrop-blur-sm flex justify-end"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-sm bg-charcoal border-l border-white/5 h-full overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-medium text-lg text-bone">Detail Reservasi</h3>
              <button onClick={() => setSelected(null)} className="text-stone hover:text-bone">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <Row label="Nama" value={selected.nama} />
              <Row label="No WA" value={selected.no_wa} />
              {selected.email && <Row label="Email" value={selected.email} />}
              <Row label="Tanggal" value={
                new Date(selected.tanggal + 'T00:00:00').toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })
              } />
              <Row label="Jam" value={`${selected.jam?.slice(0,5)} WIB`} />
              <Row label="Jumlah Tamu" value={`${selected.jumlah_tamu} orang`} />
              {selected.catatan && <Row label="Catatan" value={selected.catatan} />}
              <div className="pt-2">
                <p className="text-xs text-stone mb-1.5">Status</p>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize border ${STATUS_STYLE[selected.status] ?? ''}`}>
                  {selected.status}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <p className="text-xs text-stone uppercase tracking-wider mb-3">Update Status</p>
              {(STATUS_NEXT[selected.status] ?? []).map((action) => (
                <button
                  key={action.value}
                  disabled={updating === selected.id}
                  onClick={() => updateStatus(selected.id, action.value)}
                  className={`w-full flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border border-white/10 hover:border-white/20 transition-colors bg-obsidian ${action.color}`}
                >
                  <action.icon size={16} />
                  {action.label}
                </button>
              ))}
              <a
                href={whatsappLink(`Halo ${selected.nama}, konfirmasi reservasi Anda di COREÉATERY pada tanggal ${selected.tanggal} pukul ${selected.jam?.slice(0,5)} WIB untuk ${selected.jumlah_tamu} orang.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border border-white/10 hover:border-green-500/30 transition-colors bg-obsidian text-stone hover:text-green-400"
              >
                <MessageCircle size={16} />
                Chat WhatsApp
              </a>
            </div>

            <p className="text-xs text-stone/40 mt-6">
              Dibuat: {new Date(selected.created_at).toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div>
      <p className="text-xs text-stone mb-0.5">{label}</p>
      <p className="text-sm text-bone">{value}</p>
    </div>
  )
}
