import { useCallback, useEffect, useState } from 'react'
import { Plus, Search, X, Pencil, Trash2, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { menuCategories } from '../../data/fullMenu'

const BADGE_OPTIONS = ['chef', 'favorite', 'spicy']

function Modal({ item, onClose, onSaved }) {
  const isEdit = Boolean(item?.id)
  const [form, setForm] = useState({
    name: item?.name ?? '',
    category_id: item?.category_id ?? menuCategories[0].id,
    category_name: item?.category_name ?? menuCategories[0].name,
    price: item?.price ?? '',
    description: item?.description ?? '',
    badges: item?.badges ?? [],
    is_available: item?.is_available ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleCategoryChange = (e) => {
    const cat = menuCategories.find((c) => c.id === e.target.value)
    setForm((p) => ({ ...p, category_id: cat.id, category_name: cat.name }))
  }

  const toggleBadge = (b) => {
    setForm((p) => ({
      ...p,
      badges: p.badges.includes(b) ? p.badges.filter((x) => x !== b) : [...p.badges, b],
    }))
  }

  const save = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      setError('Nama dan harga wajib diisi.')
      return
    }
    setSaving(true)
    const payload = { ...form }
    const { error: err } = isEdit
      ? await supabase.from('menu_items').update(payload).eq('id', item.id)
      : await supabase.from('menu_items').insert([payload])
    setSaving(false)
    if (err) { setError(err.message); return }
    onSaved()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-charcoal rounded-2xl border border-white/5 w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-medium text-lg text-bone">
            {isEdit ? 'Edit Menu' : 'Tambah Menu Baru'}
          </h3>
          <button onClick={onClose} className="text-stone hover:text-bone"><X size={20} /></button>
        </div>

        {error && (
          <div className="mb-4 text-xs text-ember-light flex items-center gap-1.5 bg-ember/10 px-3 py-2.5 rounded-xl">
            <AlertCircle size={13} />{error}
          </div>
        )}

        <div className="space-y-4">
          <Field label="Nama Menu">
            <input value={form.name} onChange={set('name')} placeholder="Nama menu" className={INPUT} />
          </Field>
          <Field label="Kategori">
            <select value={form.category_id} onChange={handleCategoryChange} className={INPUT}>
              {menuCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Harga">
            <input value={form.price} onChange={set('price')} placeholder="contoh: 45K atau 50K / 53K" className={INPUT} />
          </Field>
          <Field label="Deskripsi">
            <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Deskripsi singkat menu" className={`${INPUT} resize-none`} />
          </Field>
          <Field label="Badge">
            <div className="flex gap-2 flex-wrap">
              {BADGE_OPTIONS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBadge(b)}
                  className={`rounded-full px-3.5 py-1.5 text-xs capitalize transition-colors ${
                    form.badges.includes(b)
                      ? 'bg-gilt text-obsidian font-semibold'
                      : 'bg-obsidian border border-white/10 text-stone hover:text-bone'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </Field>
          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-xs text-stone uppercase tracking-wider">Tersedia</span>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, is_available: !p.is_available }))}
              className={`transition-colors ${form.is_available ? 'text-green-400' : 'text-stone'}`}
            >
              {form.is_available ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
            </button>
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 rounded-full border border-white/10 text-stone py-2.5 text-sm hover:text-bone transition-colors">
            Batal
          </button>
          <button onClick={save} disabled={saving} className="flex-1 rounded-full bg-gilt text-obsidian py-2.5 text-sm font-semibold hover:bg-gilt-soft transition-colors disabled:opacity-60">
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}

const INPUT = 'w-full bg-obsidian border border-white/10 focus:border-gilt/40 rounded-xl px-3.5 py-2.5 text-sm text-bone placeholder:text-stone/50 outline-none transition-colors'

function Field({ label, children }) {
  return (
    <div>
      <p className="text-xs text-stone uppercase tracking-wider mb-1.5">{label}</p>
      {children}
    </div>
  )
}

export default function AdminMenu() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery]     = useState('')
  const [modal, setModal]     = useState(null)  // null | {} | item
  const [deleting, setDel]    = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .order('category_id')
      .order('sort_order')
    setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin hapus item ini?')) return
    setDel(id)
    await supabase.from('menu_items').delete().eq('id', id)
    await fetch()
    setDel(null)
  }

  const toggleAvailable = async (item) => {
    await supabase.from('menu_items').update({ is_available: !item.is_available }).eq('id', item.id)
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, is_available: !i.is_available } : i))
  }

  const filtered = items.filter((i) =>
    !query || i.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display font-semibold text-2xl text-bone">Menu</h1>
          <p className="font-body text-sm text-stone mt-1">{items.length} item tersimpan di database.</p>
        </div>
        <button
          onClick={() => setModal({})}
          className="inline-flex items-center gap-2 rounded-full bg-gilt hover:bg-gilt-soft text-obsidian px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          <Plus size={16} /> Tambah Menu
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama menu..."
          className="w-full max-w-sm bg-charcoal border border-white/10 focus:border-gilt/40 rounded-xl pl-9 py-2.5 text-sm text-bone placeholder:text-stone/50 outline-none"
        />
      </div>

      <div className="bg-charcoal rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-stone text-sm">Memuat...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-stone text-sm">
            {query ? 'Tidak ditemukan.' : 'Belum ada item menu di database. Klik "Tambah Menu" untuk mulai.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Nama','Kategori','Harga','Badge','Status','Aksi'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-stone uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3 text-bone font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-stone text-xs">{item.category_name}</td>
                    <td className="px-4 py-3 text-gilt-soft">{item.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {(item.badges ?? []).map((b) => (
                          <span key={b} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-stone capitalize">{b}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleAvailable(item)} className={item.is_available ? 'text-green-400' : 'text-stone'}>
                        {item.is_available ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => setModal(item)} className="p-1.5 rounded-lg hover:bg-white/10 text-stone hover:text-gilt-soft transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button
                          disabled={deleting === item.id}
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-stone hover:text-ember-light transition-colors disabled:opacity-40"
                        >
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

      {modal !== null && (
        <Modal
          item={Object.keys(modal).length ? modal : null}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetch() }}
        />
      )}
    </div>
  )
}
