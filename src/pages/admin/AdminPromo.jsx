import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, Tag } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

const EMPTY = { title:'', description:'', image_url:'', valid_from:'', valid_until:'', is_active:true }

export default function AdminPromo() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState(null)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('promos').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (!form.title) { setError('Judul promo wajib diisi.'); return }
    setSaving(true); setError(null)
    const payload = { ...form }; delete payload.id; delete payload.created_at; delete payload.updated_at
    const { error: err } = form.id
      ? await supabase.from('promos').update(payload).eq('id', form.id)
      : await supabase.from('promos').insert([payload])
    setSaving(false)
    if (err) { setError(err.message); return }
    setForm(null); load()
  }

  const del = async (id) => {
    if (!confirm('Hapus promo ini?')) return
    await supabase.from('promos').delete().eq('id', id)
    load()
  }

  const toggle = async (id, val) => {
    await supabase.from('promos').update({ is_active: !val }).eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl text-bone">Manajemen Promo</h1>
          <p className="font-body text-sm text-stone mt-1">{items.length} promo terdaftar</p>
        </div>
        <button onClick={() => setForm({ ...EMPTY })}
          className="inline-flex items-center gap-2 rounded-full bg-gilt hover:bg-gilt-soft text-obsidian px-5 py-2.5 text-sm font-semibold transition-colors">
          <Plus size={16}/>Tambah Promo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-7 h-7 rounded-full border-2 border-gilt border-t-transparent animate-spin"/></div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-charcoal border border-white/5 text-center py-20">
          <Tag size={32} className="mx-auto text-stone mb-3" strokeWidth={1}/>
          <p className="text-sm text-stone">Belum ada promo aktif.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="rounded-xl bg-charcoal border border-white/5 px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-body font-semibold text-bone truncate">{item.title}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${item.is_active?'bg-green-800/30 text-green-400':'bg-white/8 text-stone'}`}>
                    {item.is_active?'Aktif':'Nonaktif'}
                  </span>
                </div>
                <p className="text-sm text-stone line-clamp-2">{item.description || '—'}</p>
                {(item.valid_from || item.valid_until) && (
                  <p className="text-[11px] text-stone/60 mt-1">
                    {item.valid_from} — {item.valid_until || 'tidak ada batas'}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggle(item.id, item.is_active)}>
                  {item.is_active?<ToggleRight size={22} className="text-gilt"/>:<ToggleLeft size={22} className="text-stone"/>}
                </button>
                <button onClick={() => setForm({ ...item })} className="p-1.5 rounded-lg bg-white/5 hover:bg-gilt/15 text-stone hover:text-gilt transition-colors"><Pencil size={14}/></button>
                <button onClick={() => del(item.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-ember/15 text-stone hover:text-ember-light transition-colors"><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {form !== null && (
        <div className="fixed inset-0 z-50 bg-obsidian/90 backdrop-blur-sm flex items-center justify-center px-4 py-8" onClick={() => setForm(null)}>
          <div className="w-full max-w-md bg-charcoal border border-white/10 rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-xl text-bone">{form.id?'Edit':'Tambah'} Promo</h2>
              <button onClick={() => setForm(null)} className="text-stone hover:text-bone"><X size={20}/></button>
            </div>
            {error && <div className="mb-4 rounded-xl bg-ember/10 border border-ember/20 px-4 py-3 text-sm text-ember-light">{error}</div>}
            <form onSubmit={save} className="space-y-4">
              {[
                {label:'Judul Promo',key:'title',ph:'Diskon Spesial Weekend'},
                {label:'URL Gambar (opsional)',key:'image_url',ph:'https://...'},
              ].map(({label,key,ph})=>(
                <div key={key}>
                  <label className="text-[11px] text-stone uppercase tracking-wider mb-1 block">{label}</label>
                  <input value={form[key]||''} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph}
                    className="w-full bg-obsidian border border-white/10 focus:border-gilt/40 rounded-xl px-4 py-2.5 text-sm text-bone placeholder:text-stone/40 outline-none transition-colors"/>
                </div>
              ))}
              <div>
                <label className="text-[11px] text-stone uppercase tracking-wider mb-1 block">Deskripsi</label>
                <textarea value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} placeholder="Detail promo..."
                  className="w-full bg-obsidian border border-white/10 focus:border-gilt/40 rounded-xl px-4 py-2.5 text-sm text-bone placeholder:text-stone/40 outline-none resize-none"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[['Berlaku Dari','valid_from'],['Berlaku Sampai','valid_until']].map(([l,k])=>(
                  <div key={k}>
                    <label className="text-[11px] text-stone uppercase tracking-wider mb-1 block">{l}</label>
                    <input type="date" value={form[k]||''} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                      className="w-full bg-obsidian border border-white/10 focus:border-gilt/40 rounded-xl px-4 py-2.5 text-sm text-bone outline-none [color-scheme:dark]"/>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <label className="text-[11px] text-stone uppercase tracking-wider">Aktifkan</label>
                <button type="button" onClick={()=>setForm(f=>({...f,is_active:!f.is_active}))}>
                  {form.is_active?<ToggleRight size={24} className="text-gilt"/>:<ToggleLeft size={24} className="text-stone"/>}
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setForm(null)} className="flex-1 rounded-full border border-white/10 py-2.5 text-sm text-stone hover:text-bone transition-colors">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 rounded-full bg-gilt hover:bg-gilt-soft text-obsidian py-2.5 text-sm font-semibold disabled:opacity-60 transition-colors">
                  {saving?'Menyimpan...':form.id?'Simpan':'Tambahkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
