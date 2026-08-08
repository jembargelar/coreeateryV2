import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react'

import heroImg from '../../assets/dishes/hero-nasigoreng.jpg'
import ayambakar from '../../assets/dishes/dish-ayambakar.jpg'
import fishnfries from '../../assets/dishes/dish-fishnfries.jpg'
import habanero from '../../assets/dishes/dish-habanero.jpg'
import pasta from '../../assets/dishes/dish-pasta.jpg'
import ricebowl from '../../assets/dishes/dish-ricebowl.jpg'
import ambiance from '../../assets/dishes/ambiance-interior.jpg'
import mocktail from '../../assets/dishes/drinks-mocktail.jpg'
import coffee from '../../assets/dishes/drinks-coffee.jpg'
import tea from '../../assets/dishes/drinks-tea.jpg'

const PHOTOS = [
  { src: ambiance, alt: 'Suasana ruang makan COREÉATERY', span: 'sm:col-span-2' },
  { src: heroImg, alt: 'Nasi Goreng Sambal Asap' },
  { src: mocktail, alt: 'Signature mocktail' },
  { src: ayambakar, alt: 'Ayam Bakar Rempah' },
  { src: fishnfries, alt: 'Fish n Fries' },
  { src: coffee, alt: 'Coffee bar COREÉATERY', span: 'sm:row-span-2' },
  { src: pasta, alt: 'Fettucine Carbonara' },
  { src: habanero, alt: 'Habanero Seafood Soup' },
  { src: ricebowl, alt: 'Rice Bowl Signature' },
  { src: tea, alt: 'Signature tea' },
]

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null)

  const close = () => setActiveIndex(null)
  const prev = () =>
    setActiveIndex((i) => (i - 1 + PHOTOS.length) % PHOTOS.length)
  const next = () => setActiveIndex((i) => (i + 1) % PHOTOS.length)

  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [activeIndex])

  return (
    <section id="galeri" className="relative bg-obsidian py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col items-center text-center mb-14 ring-divider pt-6">
          <p className="font-body text-xs tracking-[0.3em] text-ember-light uppercase mb-3 mt-2">
            Galeri
          </p>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl text-bone text-balance">
            Sekilas dari COREÉATERY
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[160px] sm:auto-rows-[200px] gap-3 md:gap-4">
          {PHOTOS.map((photo, i) => (
            <button
              key={photo.alt}
              onClick={() => setActiveIndex(i)}
              className={`group relative rounded-xl overflow-hidden ${photo.span ?? ''}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/40 transition-colors flex items-center justify-center">
                <Expand
                  size={20}
                  className="text-bone opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-obsidian/95 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={close}
        >
          <button
            onClick={close}
            aria-label="Tutup"
            className="absolute top-5 right-5 text-bone/80 hover:text-bone p-2"
          >
            <X size={28} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="Sebelumnya"
            className="absolute left-3 md:left-8 text-bone/70 hover:text-bone p-2"
          >
            <ChevronLeft size={32} />
          </button>
          <img
            src={PHOTOS[activeIndex].src}
            alt={PHOTOS[activeIndex].alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] max-w-[85vw] object-contain rounded-lg"
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="Selanjutnya"
            className="absolute right-3 md:right-8 text-bone/70 hover:text-bone p-2"
          >
            <ChevronRight size={32} />
          </button>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-stone text-sm font-body">
            {PHOTOS[activeIndex].alt}
          </p>
        </div>
      )}
    </section>
  )
}
