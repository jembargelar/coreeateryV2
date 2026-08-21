import { useEffect, useState, useRef, useCallback } from 'react'
import { Upload, Trash2, X, ToggleLeft, ToggleRight, Image as ImageIcon, Check, AlertCircle, Camera } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

const CATS = ['Nusantara', 'Western', 'Rice Bowl', 'Dessert & Drinks', 'Suasana', 'Lainnya']

async function compressImage(file, maxPx = 1200, quality = 0.85) {
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
      canvas.toBlob(blob => resolve(new File([blob], 'photo.jpg', { type: 'image/jpeg' })), 'image/jpeg', quality)
    }
    img.src = url
  })
}

function UploadCard({ file, category, onDone, onRemove }) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus]     = useState('idle')
  const [error, setError]       = useState(null)
  const [alt, setAlt] = useState(file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))
  const started = useRef(false)
  const previewUrl = useRef(URL.createObjectURL(file))

  const upload = useCallback(async () => {
    if (started.current) return
    started.current = true
    setStatus('uploading'); setProgress(15)
    try {
      const compressed = await compressImage(file)
      setProgress(40)

      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
      const storagePath = `photos/${fileName}`

      const { error: upErr } = await supabase.storage
        .from('gallery')
        .upload(storagePath, compressed, { contentType: 'image/jpeg', upsert: false })
      if (upErr) throw new Error('Upload storage gagal: ' + upErr.message)
      setProgress(70)

      // Dapatkan public URL
      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(storagePath)
      const publicUrl = urlData?.publicUrl
      if (!publicUrl) throw new Error('Gagal mendapat URL foto dari storage')
      setProgress(85)

      // Insert ke DB dengan image_url yang sudah ada
      const { error: dbErr } = await supabase.from('gallery_items').insert([{
        image_url:  publicUrl,
        alt:        alt.trim() || fileName,
        category:   category,
        sort_order: 0,
        is_visible: true,
      }])
      if (dbErr) throw new Error('Simpan ke DB gagal: ' + dbErr.message)

      setProgress(100)
      setStatus('done')
      onDone()
    } catch (e) {
      console.error(e)
      setError(e.message)
      setStatus('error')
    }
  }, [file, alt, category, onDone])

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${
      status === 'done' ? 'border-green-700/40 bg-green-900/10' :
      status === 'error' ? 'border-ember/40 bg-ember/5' : 'border-white/8 bg-charcoal'
    }`}>
      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-obsidian">
        <img src={previewUrl.current} alt={alt} className="w-full h-full object-cover" />
      </div>
      <input value={alt} onChange={e => setAlt(e.target.value)}
        placeholder="Keterangan foto (contoh: Ayam Bakar Rempah)"
        disabled={status === 'uploading' || status === 'done'}
        className="w-full bg-obsidian border border-white/10 focus:border-gilt/40 rounded-lg px-3 py-2 text-xs text-bone placeholder:text-stone/50 outline-none disabled:opacity-50 transition-colors" />
      {status === 'uploading' && (
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-gilt rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        {status === 'idle' && (
          <button onClick={upload}
            className="flex-1 rounded-full bg-gilt hover:bg-gilt-soft text-obsidian py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
            <Upload size={13} />Upload
          </button>
        )}
        {status === 'uploading' && (
          <span className="text-xs text-stone flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full border border-gilt border-t-transparent animate-spin" />
            Mengupload... {progress}%
          </span>
        )}
        {status === 'done' && (
          <span className="text-xs text-green-400 flex items-center gap-1.5">
            <Check size={13} />Berhasil!
          </span>
        )}
        {status === 'error' && (
          <div className="flex-1">
            <p className="text-[11px] text-ember-light flex items-center gap-1 leading-snug">
              <AlertCircle size={12} className="shrink-0" />{error}
            </p>
            <button onClick={() => { started.current = false; setStatus('idle'); setError(null) }}
              className="text-[11px] text-gilt-soft underline mt-0.5">Coba lagi</button>
          </div>
        )}
        {status !== 'uploading' && (
          <button onClick={onRemove} className="p-1.5 text-stone hover:text-ember-light transition-colors shrink-0">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

function GalleryItemCard({ item, onDelete, onToggle }) {
  return (
    <div className="rounded-xl bg-charcoal border border-white/5 overflow-hidden group">
      <div className="aspect-[4/3] bg-obsidian relative overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.alt} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={24} className="text-stone/30" strokeWidth={1} />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            item.is_visible ? 'bg-green-900/80 text-green-400' : 'bg-obsidian/80 text-stone'
          }`}>{item.is_visible ? 'Aktif' : 'Nonaktif'}</span>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <p className="text-xs text-bone font-medium truncate">{item.alt}</p>
        <p className="text-[10px] text-stone">{item.category}</p>
        <div className="flex items-center gap-2 pt-1">
          <button onClick={() => onToggle(item)}
            className="flex-1 flex items-center justify-center py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            {item.is_visible ? <ToggleRight size={16} className="text-gilt" /> : <ToggleLeft size={16} className="text-stone" />}
          </button>
          <button onClick={() => onDelete(item)}
            className="rounded-lg px-2.5 py-1.5 bg-white/5 hover:bg-ember/15 text-stone hover:text-ember-light transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminGaleri() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [category, setCategory] = useState('Nusantara')
  const [queue, setQueue]       = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('gallery_items').select('*')
      .order('created_at', { ascending: false })
    if (error) console.error('Load gallery error:', error)
    setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const addFiles = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!valid.length) return
    setQueue(q => [...q, ...valid.map(f => ({ file: f, id: `${Date.now()}-${Math.random()}` }))])
  }

  const deleteItem = async (item) => {
    if (!confirm(`Hapus foto "${item.alt}"?`)) return
    if (item.image_url?.includes('/gallery/')) {
      const path = item.image_url.split('/object/public/gallery/')[1]
      if (path) await supabase.storage.from('gallery').remove([decodeURIComponent(path)])
    }
    await supabase.from('gallery_items').delete().eq('id', item.id)
    load()
  }

  const toggleVisible = async (item) => {
    await supabase.from('gallery_items').update({ is_visible: !item.is_visible }).eq('id', item.id)
    load()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-semibold text-2xl md:text-3xl text-bone">Manajemen Galeri</h1>
        <p className="font-body text-sm text-stone mt-1">{items.length} foto terpublish</p>
      </div>

      <div className="rounded-2xl bg-charcoal border border-white/5 p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-body font-semibold text-bone flex items-center gap-2">
            <Camera size={18} className="text-gilt" />Upload Foto Baru
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone shrink-0">Kategori:</span>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="bg-obsidian border border-white/10 rounded-full px-4 py-2 text-sm text-bone outline-none">
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files) }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging ? 'border-gilt bg-gilt/10 scale-[1.01]' : 'border-white/15 hover:border-gilt/40 hover:bg-white/3'
          }`}>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={e => addFiles(e.target.files)} />
          <div className="flex flex-col items-center gap-3 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-gilt/10 flex items-center justify-center">
              <Upload size={24} className="text-gilt" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-body font-semibold text-bone text-sm">Ketuk untuk pilih foto dari HP</p>
              <p className="font-body text-xs text-stone mt-1">atau drag & drop · JPG, PNG, WebP · maks 5MB · dikompres otomatis</p>
            </div>
          </div>
        </div>

        {queue.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-stone font-medium uppercase tracking-wider">
                {queue.length} foto — kategori: {category}
              </p>
              <button onClick={() => setQueue([])}
                className="text-xs text-stone hover:text-ember-light transition-colors">Hapus semua</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {queue.map(({ file, id }) => (
                <UploadCard key={id} file={file} category={category}
                  onDone={load}
                  onRemove={() => setQueue(q => q.filter(i => i.id !== id))} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="font-body font-semibold text-bone mb-4 flex items-center gap-2">
          <ImageIcon size={18} className="text-gilt" />Foto Terpublish
        </h2>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 rounded-full border-2 border-gilt border-t-transparent animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-charcoal border border-white/5 text-center py-20">
            <ImageIcon size={32} className="mx-auto text-stone mb-3" strokeWidth={1} />
            <p className="text-sm text-stone">Belum ada foto. Upload di atas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <GalleryItemCard key={item.id} item={item}
                onDelete={deleteItem} onToggle={toggleVisible} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
