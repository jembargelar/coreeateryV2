import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Search, ToggleLeft, ToggleRight } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

const EMPTY = { category_id:'', category_name:'', name:'', price:'', description:'', badges:[], image_url:'', is_available:true }
const BADGE_OPTIONS = ['chef','favorite','spicy']

export default function AdminMenu() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [form, setForm]       = useState(null) // null=closed, obj=open
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('menu_items').select('*').order('category_id').order('sort_order')
    setItems(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = items.filter(i => {
    const s = search.toLowerCase()
    return !s || i.name?.toLowerCase().includes(s) || i.category_name?.toLowerCase().includes(s)
  })

  const openNew = () => setForm({ ...EMPTY })
  const openEdit = (item) => setForm({ ...item })
  const closeForm = () => { setForm(null); setError(null) }

  const save = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.category_id) { setError('Nama, harga, dan kategori wajib diisi.'); return }
    setSaving(true); setError(null)
    const payload = { ...form }
    delete payload.id; delete payload.created_at; delete payload.updated_at
    const { error: err } = form.id
      ? await supabase.from('menu_items').update(payload).eq('id', form.id)
      : await supabase.from('menu_items').insert([payload])
    setSaving(false)
    if (err) { setError(err.message); return }
    closeForm(); load()
  }

  const del = async (id) => {
    if (!confirm('Hapus item ini?')) return
    await supabase.from('menu_items').delete().eq('id', id)
    load()
  }

  const toggleAvail = async (id, val) => {
    await supabase.from('menu_items').update({ is_available: !val }).eq('id', id)
    load()
  }

  const toggleBadge = (b) => setForm(f => ({
    ...f,
    badges: f.badges.includes(b) ? f.badges.filter(x=>x!==b) : [...f.badges, b]
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl text-bone">Manajemen Menu</h1>
          <p className="font-body text-sm text-stone mt-1">{items.length} item menu</p>
        </div>
        <button onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-gilt hover:bg-gilt-soft text-obsidian px-5 py-2.5 text-sm font-semibold transition-colors">
          <Plus size={16}/>Tambah Item
        </button>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari nama atau kategori..."
          className="w-full max-w-sm bg-charcoal border border-white/10 focus:border-gilt/40 rounded-full pl-9 pr-4 py-2.5 text-sm text-bone placeholder:text-stone/50 outline-none transition-colors" />
      </div>

      <div className="rounded-2xl bg-charcoal border border-white/5 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-7 h-7 rounded-full border-2 border-gilt border-t-transparent animate-spin"/></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-stone py-16">
            {items.length === 0 ? 'Belum ada item. Tambah dari tombol di atas, atau import dari PDF menu.' : 'Tidak ditemukan.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-stone">
                  {['Nama','Kategori','Harga','Badge','Tersedia','Aksi'].map(h=>(
                    <th key={h} className="text-left px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(item=>(
                  <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-bone font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-stone text-xs">{item.category_name}</td>
                    <td className="px-4 py-3 text-gilt-soft font-medium">{item.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {(item.badges||[]).map(b=>(
                          <span key={b} className="rounded-full bg-gilt/10 text-gilt-soft px-2 py-0.5 text-[10px]">{b}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={()=>toggleAvail(item.id, item.is_available)} className="text-stone hover:text-gilt transition-colors">
                        {item.is_available ? <ToggleRight size={22} className="text-gilt"/> : <ToggleLeft size={22}/>}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={()=>openEdit(item)} className="p-1.5 rounded-lg bg-white/5 hover:bg-gilt/15 text-stone hover:text-gilt transition-colors"><Pencil size={14}/></button>
                        <button onClick={()=>del(item.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-ember/15 text-stone hover:text-ember-light transition-colors"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form modal */}
      {form !== null && (
        <div className="fixed inset-0 z-50 bg-obsidian/90 backdrop-blur-sm flex items-start justify-center px-4 py-8 overflow-y-auto" onClick={closeForm}>
          <div className="w-full max-w-lg bg-charcoal border border-white/10 rounded-2xl p-6 my-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-xl text-bone">{form.id?'Edit':'Tambah'} Item Menu</h2>
              <button onClick={closeForm} className="text-stone hover:text-bone"><X size={20}/></button>
            </div>
            {error && <div className="mb-4 rounded-xl bg-ember/10 border border-ember/20 px-4 py-3 text-sm text-ember-light">{error}</div>}
            <form onSubmit={save} className="space-y-4">
              {[
                {label:'Nama Item',key:'name',ph:'Tenderloin Steak'},
                {label:'Harga',key:'price',ph:'130K'},
                {label:'ID Kategori',key:'category_id',ph:'prime-steaks'},
                {label:'Nama Kategori',key:'category_name',ph:'Prime Steaks'},
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
                <textarea value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2} placeholder="Deskripsi singkat menu..."
                  className="w-full bg-obsidian border border-white/10 focus:border-gilt/40 rounded-xl px-4 py-2.5 text-sm text-bone placeholder:text-stone/40 outline-none transition-colors resize-none"/>
              </div>
              <div>
                <label className="text-[11px] text-stone uppercase tracking-wider mb-2 block">Badge</label>
                <div className="flex gap-2">
                  {BADGE_OPTIONS.map(b=>(
                    <button type="button" key={b} onClick={()=>toggleBadge(b)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                        form.badges?.includes(b)?'bg-gilt text-obsidian':'bg-white/5 text-stone hover:text-bone'
                      }`}>{b}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-[11px] text-stone uppercase tracking-wider">Tersedia</label>
                <button type="button" onClick={()=>setForm(f=>({...f,is_available:!f.is_available}))}>
                  {form.is_available?<ToggleRight size={24} className="text-gilt"/>:<ToggleLeft size={24} className="text-stone"/>}
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="flex-1 rounded-full border border-white/10 py-2.5 text-sm text-stone hover:text-bone transition-colors">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 rounded-full bg-gilt hover:bg-gilt-soft text-obsidian py-2.5 text-sm font-semibold disabled:opacity-60 transition-colors">
                  {saving?'Menyimpan...':form.id?'Simpan Perubahan':'Tambahkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
