import { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const photo = photos[index]

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-obsidian/97 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Tutup"
        className="absolute top-4 right-4 z-10 p-2 text-bone/70 hover:text-bone transition-colors bg-obsidian/50 rounded-full"
      >
        <X size={24} />
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label="Foto sebelumnya"
        className="absolute left-3 md:left-6 z-10 p-3 text-bone/70 hover:text-bone transition-colors bg-obsidian/50 rounded-full"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Image */}
      <div
        className="max-h-[85vh] max-w-[90vw] md:max-w-[80vw] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-[85vh] max-w-[90vw] md:max-w-[80vw] object-contain rounded-lg shadow-2xl"
        />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-obsidian/80 to-transparent rounded-b-lg px-4 py-3">
          <p className="font-body text-sm text-bone/90">{photo.alt}</p>
          <p className="font-body text-xs text-stone mt-0.5">
            {index + 1} / {photos.length}
          </p>
        </div>
      </div>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="Foto selanjutnya"
        className="absolute right-3 md:right-6 z-10 p-3 text-bone/70 hover:text-bone transition-colors bg-obsidian/50 rounded-full"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
        {photos.map((_, i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === index ? 'bg-gilt' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
