import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Expand } from 'lucide-react'
import { supabase } from '../../../lib/supabaseClient'

import heroImg   from '../../../assets/dishes/hero-nasigoreng.jpg'
import ayambakar from '../../../assets/dishes/dish-ayambakar.jpg'
import fishnfries from '../../../assets/dishes/dish-fishnfries.jpg'
import habanero  from '../../../assets/dishes/dish-habanero.jpg'
import pasta     from '../../../assets/dishes/dish-pasta.jpg'
import ricebowl  from '../../../assets/dishes/dish-ricebowl.jpg'
import ambiance  from '../../../assets/dishes/ambiance-interior.jpg'
import mocktail  from '../../../assets/dishes/drinks-mocktail.jpg'
import coffee    from '../../../assets/dishes/drinks-coffee.jpg'
import tea       from '../../../assets/dishes/drinks-tea.jpg'

const STATIC = [
  { src: ambiance, alt: 'Suasana COREÉATERY', span: 'sm:col-span-2' },
  { src: heroImg,  alt: 'Nasi Goreng Sambal Asap' },
  { src: mocktail, alt: 'Signature mocktail' },
  { src: ayambakar,alt: 'Ayam Bakar Rempah' },
  { src: fishnfries,alt: 'Fish n Fries' },
  { src: coffee,   alt: 'Coffee bar', span: 'sm:row-span-2' },
  { src: pasta,    alt: 'Fettucine Carbonara' },
  { src: habanero, alt: 'Habanero Seafood Soup' },
  { src: ricebowl, alt: 'Rice Bowl Signature' },
  { src: tea,      alt: 'Artisan tea' },
]

function getPublicUrl(path) {
  const { data } = supabase.storage.from('gallery').getPublicUrl(path)
  return data?.publicUrl ?? ''
}

export default function GallerySection({ data }) {
  const [dbPhotos, setDbPhotos] = useState([])

  useEffect(() => {
    supabase.from('gallery_items').select('*').eq('is_active', true)
      .order('sort_order').order('created_at', { ascending: false }).limit(6)
      .then(({ data: rows }) => {
        if (rows?.length) {
          setDbPhotos(rows.map(r => ({ src: getPublicUrl(r.storage_path), alt: r.alt_text })))
        }
      })
  }, [])

  // Pakai foto dari DB kalau ada, fallback ke static
  const photos = dbPhotos.length > 0
    ? [...dbPhotos.map((p, i) => ({ ...p, span: i === 0 ? 'sm:col-span-2' : '' })), ...STATIC.slice(dbPhotos.length)]
    : STATIC

  return (
    <section id="galeri" className="relative bg-obsidian py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col items-center text-center mb-14 ring-divider pt-6">
          {data.subtitle && (
            <p className="font-body text-xs tracking-[0.3em] text-ember-light uppercase mb-3 mt-2">{data.subtitle}</p>
          )}
          <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl text-bone text-balance">
            {data.title}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[160px] sm:auto-rows-[200px] gap-3 md:gap-4">
          {photos.map((photo, i) => (
            <Link key={i} to="/galeri" className={`group relative rounded-xl overflow-hidden ${photo.span ?? ''}`}>
              <img src={photo.src} alt={photo.alt} loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/40 transition-colors flex items-center justify-center">
                <Expand size={20} className="text-bone opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
        {data.cta_text && data.cta_url && (
          <div className="flex justify-center mt-10">
            <Link to={data.cta_url}
              className="inline-flex items-center gap-2 rounded-full border border-gilt/40 hover:bg-gilt hover:text-obsidian transition-colors px-7 py-3 text-sm font-medium text-gilt-soft">
              {data.cta_text}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
