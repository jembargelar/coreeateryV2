import { useEffect, useState } from 'react'
import { Plus, Trash2, X, ToggleLeft, ToggleRight, Image } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

const CATS = ['Nusantara','Western','Rice Bowl','Dessert & Drinks','Suasana','Lainnya']
const EMPTY = { file_name:'', storage_path:'', alt_text:'', category:'Nusantara', sort_order:0, is_active:true }

export default function AdminGaleri() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState(null)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('gallery_items').select('*').order('sort_order').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (!form.alt_text || !form.storage_path) { setError('Alt text dan path gambar wajib.'); return }
    setSaving(true); setError(null)
    const payload = { ...form }; delete payload.id; delete payload.created_at
    const { error: err } = form.id
      ? await supabase.from('gallery_items').update(payload).eq('id', form.id)
      : await supabase.from('gallery_items').insert([payload])
    setSaving(false)
    if (err) { setError(err.message); return }
    setForm(null); load()
  }

  const del = async (id) => {
    if (!confirm('Hapus foto ini dari galeri?')) return
    await supabase.from('gallery_items').delete().eq('id', id)
    load()
  }

  const toggleActive = async (id, val) => {
    await supabase.from('gallery_items').update({ is_active: !val }).eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl text-bone">Manajemen Galeri</h1>
          <p className="font-body text-sm text-stone mt-1">{items.length} foto terdaftar</p>
        </div>
        <button onClick={() => setForm({ ...EMPTY })}
          className="inline-flex items-center gap-2 rounded-full bg-gilt hover:bg-gilt-soft text-obsidian px-5 py-2.5 text-sm font-semibold transition-colors">
          <Plus size={16}/>Tambah Foto
        </button>
      </div>

      {/* Info Supabase Storage */}
      <div className="rounded-xl bg-gilt/8 border border-gilt/20 px-5 py-4 text-sm text-stone leading-relaxed">
        <p className="font-medium text-gilt-soft mb-1">Cara menambah foto</p>
        <p>1. Upload foto ke <strong className="text-bone">Supabase Storage → bucket "gallery"</strong> terlebih dahulu.</p>
        <p>2. Copy path-nya (misal: <code className="bg-white/5 px-1 rounded text-xs">gallery/nama-foto.jpg</code>) lalu paste di form di bawah.</p>
        <p>3. Foto akan otomatis muncul di halaman galeri publik.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-7 h-7 rounded-full border-2 border-gilt border-t-transparent animate-spin"/></div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-charcoal border border-white/5 text-center py-20">
          <Image size={32} className="mx-auto text-stone mb-3" strokeWidth={1}/>
          <p className="text-sm text-stone">Belum ada foto. Klik "Tambah Foto" untuk mulai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="rounded-xl bg-charcoal border border-white/5 overflow-hidden group">
              <div className="aspect-[4/3] bg-obsidian flex items-center justify-center relative">
                <Image size={28} className="text-stone/30" strokeWidth={1}/>
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => toggleActive(item.id, item.is_active)}>
                    {item.is_active
                      ? <ToggleRight size={18} className="text-gilt"/>
                      : <ToggleLeft size={18} className="text-stone"/>}
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-bone font-medium truncate">{item.alt_text}</p>
                <p className="text-[10px] text-stone mt-0.5">{item.category}</p>
                <p className="text-[10px] text-stone/50 font-mono truncate mt-1">{item.storage_path}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setForm({ ...item })}
                    className="flex-1 rounded-lg py-1.5 text-[11px] bg-white/5 hover:bg-gilt/15 text-stone hover:text-gilt transition-colors text-center">Edit</button>
                  <button onClick={() => del(item.id)}
                    className="rounded-lg px-2.5 py-1.5 bg-white/5 hover:bg-ember/15 text-stone hover:text-ember-light transition-colors">
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {form !== null && (
        <div className="fixed inset-0 z-50 bg-obsidian/90 backdrop-blur-sm flex items-center justify-center px-4 py-8" onClick={() => setForm(null)}>
          <div className="w-full max-w-md bg-charcoal border border-white/10 rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-xl text-bone">{form.id?'Edit':'Tambah'} Foto Galeri</h2>
              <button onClick={() => setForm(null)} className="text-stone hover:text-bone"><X size={20}/></button>
            </div>
            {error && <div className="mb-4 rounded-xl bg-ember/10 border border-ember/20 px-4 py-3 text-sm text-ember-light">{error}</div>}
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="text-[11px] text-stone uppercase tracking-wider mb-1 block">Path Foto di Storage</label>
                <input value={form.storage_path} onChange={e=>setForm(f=>({...f,storage_path:e.target.value}))}
                  placeholder="gallery/nama-foto.jpg"
                  className="w-full bg-obsidian border border-white/10 focus:border-gilt/40 rounded-xl px-4 py-2.5 text-sm text-bone placeholder:text-stone/40 outline-none font-mono"/>
              </div>
              <div>
                <label className="text-[11px] text-stone uppercase tracking-wider mb-1 block">Alt Text / Keterangan</label>
                <input value={form.alt_text} onChange={e=>setForm(f=>({...f,alt_text:e.target.value}))}
                  placeholder="Ayam Bakar Rempah — signature dish"
                  className="w-full bg-obsidian border border-white/10 focus:border-gilt/40 rounded-xl px-4 py-2.5 text-sm text-bone placeholder:text-stone/40 outline-none"/>
              </div>
              <div>
                <label className="text-[11px] text-stone uppercase tracking-wider mb-1 block">Kategori</label>
                <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
                  className="w-full bg-obsidian border border-white/10 focus:border-gilt/40 rounded-xl px-4 py-2.5 text-sm text-bone outline-none">
                  {CATS.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-stone uppercase tracking-wider mb-1 block">Urutan (sort order)</label>
                <input type="number" value={form.sort_order} onChange={e=>setForm(f=>({...f,sort_order:+e.target.value}))}
                  className="w-full bg-obsidian border border-white/10 focus:border-gilt/40 rounded-xl px-4 py-2.5 text-sm text-bone outline-none"/>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-[11px] text-stone uppercase tracking-wider">Aktif</label>
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
