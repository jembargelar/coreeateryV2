import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChefHat, ThumbsUp, Flame, Star } from 'lucide-react'
import { supabase } from '../../../lib/supabaseClient'
import { menuFavorites, badgeMeta } from '../../../data/menuFavorites'

const BADGE_ICON = { favorite: ThumbsUp, chef: ChefHat, spicy: Flame, signature: Star }

function getPublicUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  const { data } = supabase.storage.from('homepage').getPublicUrl(path)
  return data?.publicUrl ?? null
}

function DishCard({ item }) {
  const imgSrc = item.image_url ? getPublicUrl(item.image_url) : (item.image ?? null)
  return (
    <div className="group rounded-2xl bg-charcoal border border-white/5 overflow-hidden hover:border-gilt/30 transition-colors">
      <div className="relative aspect-[4/3] overflow-hidden bg-obsidian">
        {imgSrc ? (
          <img src={imgSrc} alt={item.name} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border border-gilt/30 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-gilt/50 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-ember/70" />
              </div>
            </div>
          </div>
        )}
        {item.badges?.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {item.badges.map(b => {
              const Icon = BADGE_ICON[b]
              const meta = badgeMeta[b]
              if (!Icon || !meta) return null
              return (
                <span key={b} className={`inline-flex items-center gap-1 rounded-full bg-obsidian/85 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium ${meta.color}`}>
                  <Icon size={11} />{meta.label}
                </span>
              )
            })}
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-[10px] tracking-[0.2em] text-stone uppercase mb-1.5">{item.category || item.categoryName}</p>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-medium text-lg text-bone leading-snug">{item.name}</h3>
          <span className="font-body font-semibold text-gilt-soft whitespace-nowrap text-sm mt-1">{item.price}</span>
        </div>
        {(item.desc || item.description) && (
          <p className="font-body text-sm text-stone leading-relaxed mt-2">{item.desc || item.description}</p>
        )}
      </div>
    </div>
  )
}

export default function MenuFavoritSection({ data }) {
  const [dbItems, setDbItems] = useState([])

  // Coba ambil menu_items featured dari Supabase
  useEffect(() => {
    const featuredIds = data?.extra?.featured_ids
    if (!featuredIds?.length) return

    supabase.from('menu_items')
      .select('*')
      .eq('is_available', true)
      .limit(8)
      .then(({ data: rows }) => {
        if (rows?.length) setDbItems(rows)
      })
  }, [data?.extra?.featured_ids])

  // Pakai data DB kalau ada, fallback ke static menuFavorites
  const items = dbItems.length > 0 ? dbItems : menuFavorites

  return (
    <section id="menu" className="relative bg-obsidian py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col items-center text-center mb-14 ring-divider pt-6">
          {data?.subtitle && (
            <p className="font-body text-xs tracking-[0.3em] text-ember-light uppercase mb-3 mt-2">{data.subtitle}</p>
          )}
          <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl text-bone text-balance">
            {data?.title || 'Hidangan Pilihan Kami'}
          </h2>
          {data?.description && (
            <p className="font-body text-stone text-base mt-4 max-w-xl">{data.description}</p>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(item => <DishCard key={item.id} item={item} />)}
        </div>
        {data?.cta_text && data?.cta_url && (
          <div className="flex justify-center mt-12">
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
