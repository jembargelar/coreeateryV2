import { useCallback, useState } from 'react'
import { Expand, Camera } from 'lucide-react'
import { galleryPhotos, galleryCategories } from '../data/gallery'
import Lightbox from '../components/gallery/Lightbox'

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const filtered = activeCategory === 'Semua'
    ? galleryPhotos
    : galleryPhotos.filter((p) => p.category === activeCategory)

  const openLightbox = useCallback((idx) => setLightboxIndex(idx), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevPhoto = useCallback(
    () => setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length),
    [filtered.length]
  )
  const nextPhoto = useCallback(
    () => setLightboxIndex((i) => (i + 1) % filtered.length),
    [filtered.length]
  )

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Header */}
      <section className="relative pt-32 md:pt-40 pb-12 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full border border-gilt" />
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[450px] h-[450px] rounded-full border border-gilt" />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera size={18} className="text-gilt" strokeWidth={1.5} />
          </div>
          <p className="font-body text-xs tracking-[0.3em] text-ember-light uppercase mb-3">
            Galeri
          </p>
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-bone">
            Momen dari COREÉATERY
          </h1>
          <p className="font-body text-stone text-sm md:text-base mt-4 max-w-lg mx-auto">
            {galleryPhotos.length} foto — dari sajian di piring hingga suasana meja.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center justify-center gap-2 mt-8 overflow-x-auto no-scrollbar px-5">
          {galleryCategories.map((cat) => (
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

      {/* Masonry grid pakai CSS columns */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-stone">
            Tidak ada foto untuk kategori ini.
          </div>
        ) : (
          <>
            <div
              className="columns-2 sm:columns-3 lg:columns-4 gap-3 md:gap-4"
              style={{ columnFill: 'balance' }}
            >
              {filtered.map((photo, idx) => (
                <GalleryItem
                  key={photo.id}
                  photo={photo}
                  index={idx}
                  onOpen={openLightbox}
                />
              ))}
            </div>

            <p className="text-center text-xs text-stone/50 mt-12 font-body">
              Menampilkan {filtered.length} foto
              {activeCategory !== 'Semua' && ` — kategori ${activeCategory}`}
            </p>
          </>
        )}
      </div>

      {/* Lightbox */}
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
        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/50 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
          <Expand size={22} className="text-bone" />
          <p className="font-body text-[10px] text-bone/80 text-center px-3 leading-snug">
            {photo.alt}
          </p>
        </div>
      </div>

      {/* Category badge */}
      <span className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full bg-obsidian/75 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-gilt-soft">
        {photo.category}
      </span>
    </div>
  )
}
