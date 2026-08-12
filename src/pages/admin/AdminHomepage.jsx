import { useCallback, useEffect, useRef, useState } from 'react'
import {
  GripVertical, Eye, EyeOff, ChevronDown, ChevronUp,
  Save, Upload, X, Check, AlertCircle, RefreshCw,
  LayoutDashboard, Type, Image as ImageIcon, Link2, Settings
} from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

// ── helpers ──────────────────────────────────────────────────
function getPublicUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  const { data } = supabase.storage.from('homepage').getPublicUrl(path)
  return data?.publicUrl ?? null
}

async function compressImage(file, maxPx = 1400, quality = 0.85) {
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

const SECTION_LABELS = {
  hero:            { label: 'Hero / Banner Utama',    icon: '🏠' },
  about:           { label: 'Tentang Kami',           icon: '📖' },
  menu_favorit:    { label: 'Menu Favorit',           icon: '🍽️' },
  promotion:       { label: 'Promo & Event',          icon: '✨' },
  gallery:         { label: 'Galeri Mini',            icon: '🖼️' },
  reviews:         { label: 'Google Review CTA',      icon: '⭐' },
  reservation_cta: { label: 'Reservasi CTA',          icon: '📅' },
}

// ── ImageUploader ─────────────────────────────────────────────
function ImageUploader({ currentPath, onUploaded }) {
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
      const path = `sections/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
      const { error: upErr } = await supabase.storage
        .from('homepage').upload(path, compressed, { contentType: 'image/jpeg' })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('homepage').getPublicUrl(path)
      setPreview(data.publicUrl)
      onUploaded(path)
    } catch (e) { setError(e.message) }
    finally { setUploading(false) }
  }

  return (
    <div className="space-y-2">
      <label className="text-[11px] text-stone uppercase tracking-wider flex items-center gap-1.5">
        <ImageIcon size={11} />Foto Section
      </label>
      <div className="relative">
        {preview ? (
          <div className="relative rounded-xl overflow-hidden">
            <img src={preview} alt="" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-obsidian/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => ref.current?.click()}
                className="rounded-full bg-gilt text-obsidian px-3 py-1.5 text-xs font-medium flex items-center gap-1">
                <Upload size={12} />Ganti Foto
              </button>
              <button onClick={() => { setPreview(null); onUploaded('') }}
                className="rounded-full bg-ember text-bone px-3 py-1.5 text-xs font-medium">
                <X size={12} />
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => ref.current?.click()}
            className="w-full h-32 rounded-xl border-2 border-dashed border-white/15 hover:border-gilt/40 flex flex-col items-center justify-center gap-2 text-stone hover:text-bone transition-colors">
            <Upload size={20} strokeWidth={1.5} />
            <span className="text-xs">Ketuk untuk upload foto</span>
            <span className="text-[10px] text-stone/50">JPG, PNG, WebP · dikompres otomatis</span>
          </button>
        )}
        <input ref={ref} type="file" accept="image/*" className="hidden"
          onChange={e => handleFile(e.target.files[0])} />
      </div>
      {uploading && (
        <div className="flex items-center gap-2 text-xs text-gilt-soft">
          <div className="w-3 h-3 rounded-full border border-gilt border-t-transparent animate-spin" />
          Mengupload...
        </div>
      )}
      {error && <p className="text-xs text-ember-light flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  )
}

// ── Field helpers ─────────────────────────────────────────────
const inputCls = 'w-full bg-obsidian border border-white/10 focus:border-gilt/40 rounded-xl px-3 py-2.5 text-sm text-bone placeholder:text-stone/40 outline-none transition-colors'
const labelCls = 'text-[11px] text-stone uppercase tracking-wider mb-1 block'

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className={`${labelCls} flex items-center gap-1.5`}>
        {Icon && <Icon size={11} />}{label}
      </label>
      {children}
    </div>
  )
}

// ── ExtraFieldEditor: edit field khusus per section ──────────
function ExtraFieldEditor({ sectionKey, extra, onChange }) {
  const set = (k, v) => onChange({ ...extra, [k]: v })

  if (sectionKey === 'hero') return (
    <div className="space-y-3">
      <Field label="Badge Text (atas judul)" icon={Type}>
        <input value={extra.badge_text || ''} onChange={e => set('badge_text', e.target.value)} placeholder="Cianjur — Fusion Dining" className={inputCls} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Teks Tombol 2" icon={Link2}>
          <input value={extra.cta2_text || ''} onChange={e => set('cta2_text', e.target.value)} placeholder="Reservasi Sekarang" className={inputCls} />
        </Field>
        <Field label="URL Tombol 2" icon={Link2}>
          <input value={extra.cta2_url || ''} onChange={e => set('cta2_url', e.target.value)} placeholder="/reservasi" className={inputCls} />
        </Field>
      </div>
    </div>
  )

  if (sectionKey === 'about') return (
    <div className="space-y-3">
      <Field label="Teks Visi" icon={Type}>
        <textarea rows={2} value={extra.visi || ''} onChange={e => set('visi', e.target.value)} placeholder="Visi restoran..." className={`${inputCls} resize-none`} />
      </Field>
      {[1,2,3].map(n => (
        <div key={n} className="grid grid-cols-2 gap-3">
          <Field label={`Nilai ${n} — Judul`} icon={Type}>
            <input value={extra[`nilai_${n}_title`] || ''} onChange={e => set(`nilai_${n}_title`, e.target.value)} placeholder={['Cita Rasa Otentik','Kualitas Premium','Pengalaman Berkesan'][n-1]} className={inputCls} />
          </Field>
          <Field label={`Nilai ${n} — Deskripsi`} icon={Type}>
            <input value={extra[`nilai_${n}_desc`] || ''} onChange={e => set(`nilai_${n}_desc`, e.target.value)} placeholder="Deskripsi singkat..." className={inputCls} />
          </Field>
        </div>
      ))}
    </div>
  )

  if (sectionKey === 'reservation_cta') return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Jam Operasional" icon={Type}>
          <input value={extra.hours || ''} onChange={e => set('hours', e.target.value)} placeholder="10.00 – 22.00 WIB" className={inputCls} />
        </Field>
        <Field label="Keterangan Jam" icon={Type}>
          <input value={extra.hours_note || ''} onChange={e => set('hours_note', e.target.value)} placeholder="Setiap hari" className={inputCls} />
        </Field>
      </div>
      <Field label="Alamat (singkat)" icon={Type}>
        <input value={extra.address || ''} onChange={e => set('address', e.target.value)} placeholder="Jl. Mangunsarkoro No.105, Cianjur" className={inputCls} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Teks Tombol 2 (WA)" icon={Link2}>
          <input value={extra.cta2_text || ''} onChange={e => set('cta2_text', e.target.value)} placeholder="via WhatsApp" className={inputCls} />
        </Field>
      </div>
    </div>
  )

  return null
}

// ── SectionCard: kartu per section ───────────────────────────
function SectionCard({ section, onSave, onToggle, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [expanded, setExpanded] = useState(false)
  const [form, setForm]         = useState(section)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState(null)
  const meta = SECTION_LABELS[section.section_key] ?? { label: section.section_key, icon: '📄' }

  const dirty = JSON.stringify(form) !== JSON.stringify(section)

  const save = async () => {
    setSaving(true); setError(null)
    const { error: err } = await supabase.from('homepage_sections').update({
      title:       form.title,
      subtitle:    form.subtitle,
      description: form.description,
      cta_text:    form.cta_text,
      cta_url:     form.cta_url,
      image_path:  form.image_path,
      extra:       form.extra,
      is_visible:  form.is_visible,
      sort_order:  form.sort_order,
    }).eq('section_key', form.section_key)
    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    onSave(form)
  }

  return (
    <div className={`rounded-2xl border transition-colors ${form.is_visible ? 'bg-charcoal border-white/5' : 'bg-charcoal/50 border-white/3'}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Drag handle / reorder */}
        <div className="flex flex-col gap-0.5 shrink-0">
          <button onClick={onMoveUp} disabled={isFirst}
            className="p-0.5 text-stone/40 hover:text-stone disabled:opacity-20 transition-colors">
            <ChevronUp size={14} />
          </button>
          <GripVertical size={14} className="text-stone/30 mx-auto" />
          <button onClick={onMoveDown} disabled={isLast}
            className="p-0.5 text-stone/40 hover:text-stone disabled:opacity-20 transition-colors">
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Label */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base">{meta.icon}</span>
            <span className={`font-body font-semibold text-sm ${form.is_visible ? 'text-bone' : 'text-stone'}`}>
              {meta.label}
            </span>
            {!form.is_visible && (
              <span className="text-[10px] text-stone bg-white/5 rounded-full px-2 py-0.5">Tersembunyi</span>
            )}
            {dirty && !saving && (
              <span className="text-[10px] text-gilt-soft bg-gilt/10 rounded-full px-2 py-0.5">Ada perubahan</span>
            )}
            {saved && (
              <span className="text-[10px] text-green-400 flex items-center gap-1">
                <Check size={10} />Tersimpan
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone/50 truncate mt-0.5">{form.title || '—'}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Toggle visible */}
          <button onClick={() => { const nv = { ...form, is_visible: !form.is_visible }; setForm(nv); onToggle(nv) }}
            title={form.is_visible ? 'Sembunyikan section' : 'Tampilkan section'}
            className={`p-2 rounded-lg transition-colors ${form.is_visible ? 'text-gilt hover:bg-gilt/10' : 'text-stone/40 hover:bg-white/5 hover:text-stone'}`}>
            {form.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          {/* Expand/collapse */}
          <button onClick={() => setExpanded(v => !v)}
            className="p-2 rounded-lg text-stone hover:text-bone hover:bg-white/5 transition-colors">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Body — expand */}
      {expanded && (
        <div className="px-4 pb-5 space-y-4 border-t border-white/5 pt-4">
          {error && (
            <div className="rounded-xl bg-ember/10 border border-ember/20 px-3 py-2 text-xs text-ember-light flex items-center gap-2">
              <AlertCircle size={12} />{error}
            </div>
          )}

          {/* Foto */}
          <ImageUploader
            currentPath={form.image_path}
            onUploaded={path => setForm(f => ({ ...f, image_path: path }))}
          />

          {/* Field teks umum */}
          <Field label="Judul" icon={Type}>
            <input value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Judul section" className={inputCls} />
          </Field>

          <Field label="Subjudul / Label Kecil" icon={Type}>
            <input value={form.subtitle || ''} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
              placeholder="Label kecil di atas judul" className={inputCls} />
          </Field>

          <Field label="Deskripsi / Teks Isi" icon={Type}>
            <textarea rows={3} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Isi teks section..." className={`${inputCls} resize-none`} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Teks Tombol Utama" icon={Link2}>
              <input value={form.cta_text || ''} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))}
                placeholder="Teks tombol" className={inputCls} />
            </Field>
            <Field label="URL Tombol Utama" icon={Link2}>
              <input value={form.cta_url || ''} onChange={e => setForm(f => ({ ...f, cta_url: e.target.value }))}
                placeholder="/menu atau https://..." className={inputCls} />
            </Field>
          </div>

          {/* Field khusus per section */}
          {['hero','about','reservation_cta'].includes(form.section_key) && (
            <div className="rounded-xl bg-white/3 border border-white/5 p-4 space-y-3">
              <p className="text-[11px] text-stone uppercase tracking-wider flex items-center gap-1.5">
                <Settings size={11} />Pengaturan Khusus
              </p>
              <ExtraFieldEditor
                sectionKey={form.section_key}
                extra={form.extra ?? {}}
                onChange={extra => setForm(f => ({ ...f, extra }))}
              />
            </div>
          )}

          {/* Save button */}
          <button onClick={save} disabled={saving || !dirty}
            className="w-full rounded-full bg-gilt hover:bg-gilt-soft disabled:opacity-40 disabled:cursor-not-allowed text-obsidian py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            {saving ? (
              <><div className="w-4 h-4 rounded-full border-2 border-obsidian border-t-transparent animate-spin" />Menyimpan...</>
            ) : saved ? (
              <><Check size={16} />Tersimpan!</>
            ) : (
              <><Save size={16} />Simpan Perubahan</>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Halaman utama AdminHomepage ───────────────────────────────
export default function AdminHomepage() {
  const [sections, setSections] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const ORDER = ['hero','about','menu_favorit','promotion','gallery','reviews','reservation_cta']

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('sort_order')
    if (err) { setError(err.message); setLoading(false); return }
    const parsed = (data ?? []).map(s => ({
      ...s,
      extra: typeof s.extra === 'string' ? JSON.parse(s.extra) : (s.extra ?? {})
    }))
    // Urutkan sesuai ORDER kalau sort_order sama
    parsed.sort((a, b) => a.sort_order - b.sort_order || ORDER.indexOf(a.section_key) - ORDER.indexOf(b.section_key))
    setSections(parsed)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const updateSort = async (secs) => {
    const updates = secs.map((s, i) => ({ section_key: s.section_key, sort_order: i + 1 }))
    for (const u of updates) {
      await supabase.from('homepage_sections').update({ sort_order: u.sort_order }).eq('section_key', u.section_key)
    }
  }

  const moveUp = (idx) => {
    if (idx === 0) return
    const next = [...sections]
    ;[next[idx-1], next[idx]] = [next[idx], next[idx-1]]
    setSections(next)
    updateSort(next)
  }

  const moveDown = (idx) => {
    if (idx === sections.length - 1) return
    const next = [...sections]
    ;[next[idx], next[idx+1]] = [next[idx+1], next[idx]]
    setSections(next)
    updateSort(next)
  }

  const toggleVisible = async (updated) => {
    await supabase.from('homepage_sections')
      .update({ is_visible: updated.is_visible })
      .eq('section_key', updated.section_key)
    setSections(prev => prev.map(s => s.section_key === updated.section_key ? updated : s))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl md:text-3xl text-bone flex items-center gap-2">
            <LayoutDashboard size={24} className="text-gilt" />
            Halaman Utama
          </h1>
          <p className="font-body text-sm text-stone mt-1">
            Edit semua section homepage — perubahan langsung live tanpa deploy ulang.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 hover:border-gilt/30 px-4 py-2 text-xs text-stone hover:text-bone transition-colors">
            <Eye size={14} />Lihat Website
          </a>
          <button onClick={load}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 hover:border-gilt/30 px-4 py-2 text-xs text-stone hover:text-bone transition-colors">
            <RefreshCw size={14} />Refresh
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl bg-gilt/8 border border-gilt/20 px-5 py-3.5 text-sm text-stone leading-relaxed">
        <p className="font-medium text-gilt-soft mb-1">Cara pakai</p>
        <p>Klik bagian section untuk edit. Setelah selesai klik <strong className="text-bone">Simpan Perubahan</strong>. 
        Gunakan tombol <Eye size={12} className="inline" /> untuk sembunyikan/tampilkan section. 
        Panah ↑↓ untuk ubah urutan section di homepage.</p>
      </div>

      {error && (
        <div className="rounded-xl bg-ember/10 border border-ember/20 px-5 py-3 text-sm text-ember-light flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Koneksi ke Supabase gagal</p>
            <p className="text-xs mt-1 text-ember-light/70">{error}</p>
            <p className="text-xs mt-1">Pastikan schema.sql sudah dijalankan dan Supabase sudah terhubung.</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-gilt border-t-transparent animate-spin" />
        </div>
      ) : sections.length === 0 ? (
        <div className="rounded-2xl bg-charcoal border border-white/5 text-center py-20">
          <LayoutDashboard size={32} className="mx-auto text-stone mb-3" strokeWidth={1} />
          <p className="text-sm text-bone mb-1">Data section belum ada</p>
          <p className="text-xs text-stone max-w-sm mx-auto">
            Jalankan schema.sql di Supabase SQL Editor terlebih dahulu untuk membuat tabel dan mengisi data default.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((s, idx) => (
            <SectionCard
              key={s.section_key}
              section={s}
              onSave={updated => setSections(prev => prev.map(x => x.section_key === updated.section_key ? updated : x))}
              onToggle={toggleVisible}
              onMoveUp={() => moveUp(idx)}
              onMoveDown={() => moveDown(idx)}
              isFirst={idx === 0}
              isLast={idx === sections.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
