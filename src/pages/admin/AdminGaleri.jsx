import { useEffect, useState, useRef, useCallback } from 'react'
import { Upload, Trash2, X, ToggleLeft, ToggleRight, Image as ImageIcon, Check, AlertCircle, Camera } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

const CATS = ['Nusantara', 'Western', 'Rice Bowl', 'Dessert & Drinks', 'Suasana', 'Lainnya']

// Dapat public URL dari Supabase Storage
function getPublicUrl(path) {
  const { data } = supabase.storage.from('gallery').getPublicUrl(path)
  return data?.publicUrl ?? ''
}

// Kompres gambar di browser sebelum upload (max 1200px, quality 85)
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
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      canvas.toBlob((blob) => {
        const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })
        resolve(compressed)
      }, 'image/jpeg', quality)
    }
    img.src = url
  })
}

// ── Upload card: satu foto dalam antrian upload ──────────────
function UploadCard({ file, category, onDone, onRemove }) {
  const [progress, setProgress] = useState(0) // 0–100
  const [status, setStatus]     = useState('idle') // idle|uploading|done|error
  const [error, setError]       = useState(null)
  const [altText, setAltText]   = useState(file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))
  const started = useRef(false)

  const upload = useCallback(async () => {
    if (started.current) return
    started.current = true
    setStatus('uploading')
    setProgress(10)

    try {
      // 1. Kompres
      const compressed = await compressImage(file)
      setProgress(30)

      // 2. Upload ke Supabase Storage
      const ext      = 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const path     = `photos/${fileName}`

      const { error: upErr } = await supabase.storage
        .from('gallery')
        .upload(path, compressed, { contentType: 'image/jpeg', upsert: false })

      if (upErr) throw upErr
      setProgress(70)

      // 3. Simpan metadata ke tabel gallery_items
      const publicUrl = getPublicUrl(path)
      const { error: dbErr } = await supabase.from('gallery_items').insert([{
        file_name:    fileName,
        storage_path: path,
        alt_text:     altText || fileName,
        category,
        is_active:    true,
        sort_order:   0,
      }])

      if (dbErr) throw dbErr
      setProgress(100)
      setStatus('done')
      onDone()
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }, [file, altText, category, onDone])

  return (
    <div className={`rounded-xl border p-4 space-y-3 transition-colors ${
      status === 'done'  ? 'border-green-700/40 bg-green-900/10' :
      status === 'error' ? 'border-ember/40 bg-ember/5' :
      'border-white/8 bg-charcoal'
    }`}>
      {/* Preview */}
      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-obsidian">
        <img
          src={URL.createObjectURL(file)}
          alt={altText}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Alt text input */}
      <input
        value={altText}
        onChange={e => setAltText(e.target.value)}
        placeholder="Keterangan foto (contoh: Ayam Bakar Rempah)"
        disabled={status === 'uploading' || status === 'done'}
        className="w-full bg-obsidian border border-white/10 focus:border-gilt/40 rounded-lg px-3 py-2 text-xs text-bone placeholder:text-stone/50 outline-none transition-colors disabled:opacity-50"
      />

      {/* Progress bar */}
      {status === 'uploading' && (
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gilt rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Status + actions */}
      <div className="flex items-center justify-between gap-2">
        {status === 'idle' && (
          <button
            onClick={upload}
            className="flex-1 rounded-full bg-gilt hover:bg-gilt-soft text-obsidian py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
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
            <Check size={13} />Berhasil diupload
          </span>
        )}
        {status === 'error' && (
          <div className="flex-1 space-y-1">
            <span className="text-[11px] text-ember-light flex items-center gap-1">
              <AlertCircle size={12} />{error}
            </span>
            <button onClick={() => { started.current = false; setStatus('idle'); setError(null) }}
              className="text-[11px] text-gilt-soft underline">Coba lagi</button>
          </div>
        )}
        {status !== 'uploading' && (
          <button onClick={onRemove} className="p-1.5 text-stone hover:text-ember-light transition-colors">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

// ── Halaman utama AdminGaleri ─────────────────────────────────
export default function AdminGaleri() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [category, setCategory] = useState('Nusantara')
  const [queue, setQueue]       = useState([]) // antrian file yang akan diupload
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // Tambah file ke antrian
  const addFiles = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!valid.length) return
    setQueue(q => [...q, ...valid.map(f => ({ file: f, id: `${Date.now()}-${Math.random()}` }))])
  }

  const removeFromQueue = (id) => setQueue(q => q.filter(item => item.id !== id))

  // Drag & drop handlers
  const onDragOver  = (e) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = () => setIsDragging(false)
  const onDrop      = (e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files) }

  // Hapus foto dari DB + Storage
  const deleteItem = async (item) => {
    if (!confirm(`Hapus foto "${item.alt_text}"?`)) return
    await supabase.storage.from('gallery').remove([item.storage_path])
    await supabase.from('gallery_items').delete().eq('id', item.id)
    load()
  }

  const toggleActive = async (item) => {
    await supabase.from('gallery_items').update({ is_active: !item.is_active }).eq('id', item.id)
    load()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-semibold text-2xl md:text-3xl text-bone">Manajemen Galeri</h1>
        <p className="font-body text-sm text-stone mt-1">
          {items.length} foto terpublish — upload langsung dari HP atau komputer
        </p>
      </div>

      {/* Upload section */}
      <div className="rounded-2xl bg-charcoal border border-white/5 p-5 md:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-body font-semibold text-bone flex items-center gap-2">
            <Camera size={18} className="text-gilt" />
            Upload Foto Baru
          </h2>

          {/* Pilih kategori */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone shrink-0">Kategori:</span>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="bg-obsidian border border-white/10 focus:border-gilt/40 rounded-full px-4 py-2 text-sm text-bone outline-none transition-colors"
            >
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-gilt bg-gilt/10 scale-[1.01]'
              : 'border-white/15 hover:border-gilt/40 hover:bg-white/3'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={e => addFiles(e.target.files)}
          />
          <div className="flex flex-col items-center gap-3 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-gilt/10 flex items-center justify-center">
              <Upload size={24} className="text-gilt" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-body font-semibold text-bone text-sm">
                Ketuk untuk pilih foto dari HP
              </p>
              <p className="font-body text-xs text-stone mt-1">
                atau drag & drop di sini · JPG, PNG, WebP · maks 5MB per foto
              </p>
              <p className="font-body text-xs text-stone/50 mt-2">
                Foto akan otomatis dikompres sebelum diupload
              </p>
            </div>
          </div>
        </div>

        {/* Antrian upload */}
        {queue.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-stone font-medium uppercase tracking-wider">
                {queue.length} foto dipilih — kategori: {category}
              </p>
              <button
                onClick={() => setQueue([])}
                className="text-xs text-stone hover:text-ember-light transition-colors"
              >
                Hapus semua
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {queue.map(({ file, id }) => (
                <UploadCard
                  key={id}
                  file={file}
                  category={category}
                  onDone={() => { load() }}
                  onRemove={() => removeFromQueue(id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Daftar foto yang sudah ada */}
      <div>
        <h2 className="font-body font-semibold text-bone mb-4 flex items-center gap-2">
          <ImageIcon size={18} className="text-gilt" />
          Foto Terpublish
        </h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 rounded-full border-2 border-gilt border-t-transparent animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-charcoal border border-white/5 text-center py-20">
            <ImageIcon size={32} className="mx-auto text-stone mb-3" strokeWidth={1} />
            <p className="text-sm text-stone">Belum ada foto. Upload foto pertama di atas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <GalleryItemCard
                key={item.id}
                item={item}
                onDelete={deleteItem}
                onToggle={toggleActive}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Card foto yang sudah diupload ─────────────────────────────
function GalleryItemCard({ item, onDelete, onToggle }) {
  const [imgError, setImgError] = useState(false)
  const publicUrl = getPublicUrl(item.storage_path)

  return (
    <div className="rounded-xl bg-charcoal border border-white/5 overflow-hidden group">
      {/* Preview foto */}
      <div className="aspect-[4/3] bg-obsidian relative overflow-hidden">
        {!imgError ? (
          <img
            src={publicUrl}
            alt={item.alt_text}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={24} className="text-stone/30" strokeWidth={1} />
          </div>
        )}

        {/* Aktif/nonaktif badge */}
        <div className="absolute top-2 left-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            item.is_active ? 'bg-green-900/80 text-green-400' : 'bg-obsidian/80 text-stone'
          }`}>
            {item.is_active ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>
      </div>

      {/* Info + aksi */}
      <div className="p-3 space-y-2">
        <p className="text-xs text-bone font-medium truncate">{item.alt_text}</p>
        <p className="text-[10px] text-stone">{item.category}</p>

        <div className="flex items-center gap-2 pt-1">
          {/* Toggle aktif */}
          <button
            onClick={() => onToggle(item)}
            title={item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            {item.is_active
              ? <ToggleRight size={16} className="text-gilt" />
              : <ToggleLeft  size={16} className="text-stone" />
            }
          </button>

          {/* Hapus */}
          <button
            onClick={() => onDelete(item)}
            title="Hapus foto"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-ember/15 text-stone hover:text-ember-light transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
