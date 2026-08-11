import { useCallback, useEffect, useState } from 'react'
import { Camera } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import Lightbox from '../components/gallery/Lightbox'

// Foto statis bawaan (dari asset lokal) — selalu muncul sebagai fallback
import ambiance  from '../assets/dishes/ambiance-interior.jpg'
import ayambakar from '../assets/dishes/dish-ayambakar.jpg'
import fishnfries from '../assets/dishes/dish-fishnfries.jpg'
import habanero  from '../assets/dishes/dish-habanero.jpg'
import nasigoreng from '../assets/dishes/hero-nasigoreng.jpg'
import nasigorengAsap from '../assets/dishes/dish-nasi-goreng-asap2.jpg'
import pasta     from '../assets/dishes/dish-pasta.jpg'
import ricebowl  from '../assets/dishes/dish-ricebowl.jpg'
import coffee    from '../assets/dishes/drinks-coffee.jpg'
import mocktail  from '../assets/dishes/drinks-mocktail.jpg'
import tea       from '../assets/dishes/drinks-tea.jpg'

const STATIC_PHOTOS = [
  { id: 's-ambiance',   src: ambiance,        alt: 'Suasana ruang makan COREÉATERY',   category: 'Suasana' },
  { id: 's-nasigoreng', src: nasigoreng,      alt: 'Nasi Goreng Sambal Asap',           category: 'Nusantara' },
  { id: 's-nasigoreng2',src: nasigorengAsap,  alt: 'Nasi Goreng Sambal Asap — rempah',  category: 'Nusantara' },
  { id: 's-ayambakar',  src: ayambakar,       alt: 'Ayam Bakar Rempah',                 category: 'Nusantara' },
  { id: 's-habanero',   src: habanero,        alt: 'Habanero Seafood Soup',             category: 'Nusantara' },
  { id: 's-fishnfries', src: fishnfries,      alt: 'Fish n Fries',                      category: 'Western' },
  { id: 's-pasta',      src: pasta,           alt: 'Fettucine Carbonara',               category: 'Western' },
  { id: 's-ricebowl',   src: ricebowl,        alt: 'Rice Bowl Signature',               category: 'Rice Bowl' },
  { id: 's-coffee',     src: coffee,          alt: 'Coffee bar COREÉATERY',             category: 'Dessert & Drinks' },
  { id: 's-mocktail',   src: mocktail,        alt: 'Signature mocktails',               category: 'Dessert & Drinks' },
  { id: 's-tea',        src: tea,             alt: 'Artisan teas',                      category: 'Dessert & Drinks' },
]

const ALL_CATS = ['Semua', 'Nusantara', 'Western', 'Rice Bowl', 'Dessert & Drinks', 'Suasana', 'Lainnya']

function getPublicUrl(path) {
  const { data } = supabase.storage.from('gallery').getPublicUrl(path)
  return data?.publicUrl ?? ''
}

export default function GalleryPage() {
  const [dbPhotos, setDbPhotos]     = useState([])
  const [dbLoading, setDbLoading]   = useState(true)
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [lightboxIndex, setLightboxIndex]   = useState(null)

  // Load foto dari Supabase (yang diupload admin)
  useEffect(() => {
    supabase
      .from('gallery_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const mapped = (data ?? []).map(item => ({
          id:       `db-${item.id}`,
          src:      getPublicUrl(item.storage_path),
          alt:      item.alt_text,
          category: item.category,
        }))
        setDbPhotos(mapped)
        setDbLoading(false)
      })
  }, [])

  // Gabung: foto dari DB duluan (lebih baru), lalu foto statis bawaan
  const allPhotos = [...dbPhotos, ...STATIC_PHOTOS]

  const filtered = activeCategory === 'Semua'
    ? allPhotos
    : allPhotos.filter(p => p.category === activeCategory)

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevPhoto = useCallback(() => setLightboxIndex(i => (i - 1 + filtered.length) % filtered.length), [filtered.length])
  const nextPhoto = useCallback(() => setLightboxIndex(i => (i + 1) % filtered.length), [filtered.length])

  // Hanya tampilkan kategori yang punya foto
  const activeCats = ALL_CATS.filter(cat => {
    if (cat === 'Semua') return true
    return allPhotos.some(p => p.category === cat)
  })

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Header */}
      <section className="relative pt-32 md:pt-40 pb-12 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full border border-gilt" />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 text-center">
          <Camera size={18} className="mx-auto text-gilt mb-3" strokeWidth={1.5} />
          <p className="font-body text-xs tracking-[0.3em] text-ember-light uppercase mb-3">Galeri</p>
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-bone">
            Momen dari COREÉATERY
          </h1>
          <p className="font-body text-stone text-sm md:text-base mt-4 max-w-lg mx-auto">
            {allPhotos.length} foto{dbLoading ? '' : ` — termasuk ${dbPhotos.length} foto terbaru`}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center justify-center gap-2 mt-8 overflow-x-auto no-scrollbar px-5">
          {activeCats.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-gilt text-obsidian'
                  : 'bg-white/5 text-stone hover:text-bone'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">

        {/* Loading indicator untuk foto dari DB */}
        {dbLoading && (
          <div className="flex items-center justify-center gap-2 mb-6 text-xs text-stone">
            <div className="w-4 h-4 rounded-full border border-gilt border-t-transparent animate-spin" />
            Memuat foto terbaru...
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-stone">Belum ada foto untuk kategori ini.</div>
        ) : (
          <>
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 md:gap-4" style={{ columnFill: 'balance' }}>
              {filtered.map((photo, idx) => (
                <GalleryItem
                  key={photo.id}
                  photo={photo}
                  index={idx}
                  onOpen={setLightboxIndex}
                />
              ))}
            </div>
            <p className="text-center text-xs text-stone/50 mt-12 font-body">
              {filtered.length} foto{activeCategory !== 'Semua' ? ` — kategori ${activeCategory}` : ''}
            </p>
          </>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </div>
  )
}

function GalleryItem({ photo, index, onOpen }) {
  const [imgError, setImgError] = useState(false)

  if (imgError) return null // skip foto yang gagal load

  return (
    <div
      className="break-inside-avoid mb-3 md:mb-4 group relative overflow-hidden rounded-xl cursor-pointer"
      onClick={() => onOpen(index)}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        onError={() => setImgError(true)}
        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/50 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-1.5 px-3">
          <p className="font-body text-[11px] text-bone/90 text-center leading-snug">{photo.alt}</p>
        </div>
      </div>
      <span className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full bg-obsidian/75 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-gilt-soft">
        {photo.category}
      </span>
    </div>
  )
}
