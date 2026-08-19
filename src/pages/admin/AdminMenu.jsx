import { useEffect, useState, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Search, ToggleLeft, ToggleRight, Upload, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

const BADGE_OPTIONS = ['chef', 'favorite', 'spicy']
const EMPTY = { category_id: '', category_name: '', name: '', price: '', description: '', badges: [], image_url: '', is_available: true }

// Kompres gambar di browser sebelum upload
async function compressImage(file, maxPx = 800, quality = 0.82) {
  return new Promise((resolve) => {
    const img = document.createElement('img')
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      canvas.toBlob(blob => {
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
      }, 'image/jpeg', quality)
    }
    img.src = url
  })
}

function getPublicUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
  return data?.publicUrl ?? null
}

// Komponen upload foto untuk item menu
function MenuImageUploader({ currentPath, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState(getPublicUrl(currentPath))
  const [error, setError]         = useState(null)
  const ref = useRef()

  const handleFile = async (file) => {
    if (!file?.type.startsWith('image/')) return
    setError(null)
    setUploading(true)
    try {
      const compressed = await compressImage(file)
      const path = `items/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
      const { error: upErr } = await supabase.storage
        .from('menu-images')
        .upload(path, compressed, { contentType: 'image/jpeg' })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
      setPreview(data.publicUrl)
      onUploaded(path)
    } catch (e) {
      setError('Upload gagal: ' + e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-[11px] text-stone uppercase tracking-wider flex items-center gap-1.5">
        <ImageIcon size={11} />Foto Menu (opsional)
      </label>
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files[0])} />

      {preview ? (
        <div className="relative rounded-xl overflow-hidden">
          <img src={preview} alt="" className="w-full h-36 object-cover" />
          <div className="absolute inset-0 bg-obsidian/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button type="button" onClick={() => ref.current?.click()}
              className="rounded-full bg-gilt text-obsidian px-3 py-1.5 text-xs font-medium flex items-center gap-1">
              <Upload size={12} />Ganti
            </button>
            <button type="button" onClick={() => { setPreview(null); onUploaded('') }}
              className="rounded-full bg-ember text-bone px-2.5 py-1.5 text-xs">
              <X size={12} />
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()}
          className="w-full h-28 rounded-xl border-2 border-dashed border-white/15 hover:border-gilt/40 flex flex-col items-center justify-center gap-1.5 text-stone hover:text-bone transition-colors">
          {uploading ? (
            <div className="flex items-center gap-2 text-xs text-gilt-soft">
              <div className="w-4 h-4 rounded-full border border-gilt border-t-transparent animate-spin" />
              Mengupload...
            </div>
          ) : (
            <>
              <Upload size={20} strokeWidth={1.5} />
              <span className="text-xs">Ketuk untuk pilih foto</span>
              <span className="text-[10px] text-stone/50">dari galeri HP · dikompres otomatis</span>
            </>
          )}
        </button>
      )}
      {error && <p className="text-xs text-ember-light">{error}</p>}
    </div>
  )
}

const inputCls = 'w-full bg-obsidian border border-white/10 focus:border-gilt/40 rounded-xl px-3 py-2.5 text-sm text-bone placeholder:text-stone/40 outline-none transition-colors'

export default function AdminMenu() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [form, setForm]       = useState(null)
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
    setForm(null); load()
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
    ...f, badges: f.badges.includes(b) ? f.badges.filter(x => x !== b) : [...f.badges, b]
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl text-bone">Manajemen Menu</h1>
          <p className="font-body text-sm text-stone mt-1">{items.length} item menu</p>
        </div>
        <button onClick={() => setForm({ ...EMPTY })}
          className="inline-flex items-center gap-2 rounded-full bg-gilt hover:bg-gilt-soft text-obsidian px-5 py-2.5 text-sm font-semibold transition-colors">
          <Plus size={16} />Tambah Item
        </button>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama atau kategori..."
          className="w-full max-w-sm bg-charcoal border border-white/10 focus:border-gilt/40 rounded-full pl-9 pr-4 py-2.5 text-sm text-bone placeholder:text-stone/50 outline-none" />
      </div>

      <div className="rounded-2xl bg-charcoal border border-white/5 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-7 h-7 rounded-full border-2 border-gilt border-t-transparent animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-stone py-16">
            {items.length === 0 ? 'Belum ada item. Tambah dari tombol di atas, atau jalankan SQL import di Supabase.' : 'Tidak ditemukan.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-stone">
                  {['Foto', 'Nama', 'Kategori', 'Harga', 'Badge', 'Ada', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      {item.image_url ? (
                        <img src={getPublicUrl(item.image_url)} alt={item.name}
                          className="w-12 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-10 rounded-lg bg-obsidian flex items-center justify-center">
                          <ImageIcon size={14} className="text-stone/30" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-bone font-medium max-w-[140px]">
                      <p className="truncate">{item.name}</p>
                    </td>
                    <td className="px-4 py-3 text-stone text-xs max-w-[100px]">
                      <p className="truncate">{item.category_name}</p>
                    </td>
                    <td className="px-4 py-3 text-gilt-soft font-medium whitespace-nowrap">{item.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {(item.badges || []).map(b => (
                          <span key={b} className="rounded-full bg-gilt/10 text-gilt-soft px-2 py-0.5 text-[10px] capitalize">{b}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleAvail(item.id, item.is_available)}>
                        {item.is_available ? <ToggleRight size={22} className="text-gilt" /> : <ToggleLeft size={22} className="text-stone" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setForm({ ...item, badges: item.badges || [] })}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-gilt/15 text-stone hover:text-gilt transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => del(item.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-ember/15 text-stone hover:text-ember-light transition-colors">
                          <Trash2 size={14} />
                        </button>
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
        <div className="fixed inset-0 z-50 bg-obsidian/90 backdrop-blur-sm flex items-start justify-center px-4 py-6 overflow-y-auto"
          onClick={() => setForm(null)}>
          <div className="w-full max-w-lg bg-charcoal border border-white/10 rounded-2xl p-5 my-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-xl text-bone">{form.id ? 'Edit' : 'Tambah'} Item Menu</h2>
              <button onClick={() => setForm(null)} className="text-stone hover:text-bone"><X size={20} /></button>
            </div>
            {error && <div className="mb-4 rounded-xl bg-ember/10 border border-ember/20 px-4 py-3 text-sm text-ember-light">{error}</div>}
            <form onSubmit={save} className="space-y-4">

              {/* Upload foto langsung dari HP */}
              <MenuImageUploader
                currentPath={form.image_url}
                onUploaded={path => setForm(f => ({ ...f, image_url: path }))}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-stone uppercase tracking-wider mb-1 block">Nama Item *</label>
                  <input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Tenderloin Steak" className={inputCls} />
                </div>
                <div>
                  <label className="text-[11px] text-stone uppercase tracking-wider mb-1 block">Harga *</label>
                  <input value={form.price || ''} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="130K" className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-stone uppercase tracking-wider mb-1 block">ID Kategori *</label>
                  <input value={form.category_id || ''} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                    placeholder="prime-steaks" className={inputCls} />
                </div>
                <div>
                  <label className="text-[11px] text-stone uppercase tracking-wider mb-1 block">Nama Kategori *</label>
                  <input value={form.category_name || ''} onChange={e => setForm(f => ({ ...f, category_name: e.target.value }))}
                    placeholder="Prime Steaks" className={inputCls} />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-stone uppercase tracking-wider mb-1 block">Deskripsi</label>
                <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2} placeholder="Deskripsi singkat menu..."
                  className={`${inputCls} resize-none`} />
              </div>

              <div>
                <label className="text-[11px] text-stone uppercase tracking-wider mb-2 block">Badge</label>
                <div className="flex gap-2">
                  {BADGE_OPTIONS.map(b => (
                    <button type="button" key={b} onClick={() => toggleBadge(b)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                        form.badges?.includes(b) ? 'bg-gilt text-obsidian' : 'bg-white/5 text-stone hover:text-bone'
                      }`}>{b}</button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-[11px] text-stone uppercase tracking-wider">Tersedia</label>
                <button type="button" onClick={() => setForm(f => ({ ...f, is_available: !f.is_available }))}>
                  {form.is_available
                    ? <ToggleRight size={24} className="text-gilt" />
                    : <ToggleLeft size={24} className="text-stone" />}
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setForm(null)}
                  className="flex-1 rounded-full border border-white/10 py-2.5 text-sm text-stone hover:text-bone transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 rounded-full bg-gilt hover:bg-gilt-soft text-obsidian py-2.5 text-sm font-semibold disabled:opacity-60 transition-colors">
                  {saving ? 'Menyimpan...' : form.id ? 'Simpan Perubahan' : 'Tambahkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
