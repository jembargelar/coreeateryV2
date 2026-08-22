import { useEffect, useMemo, useState } from 'react'
import { Search, X, Heart, ChefHat, ThumbsUp, Flame, LayoutGrid } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { menuCategories, allMenuItems } from '../data/fullMenu'
import { useFavorites } from '../hooks/useFavorites'
import MenuCard from '../components/menu/MenuCard'
import heroNasiGoreng from '../assets/dishes/hero-nasigoreng.jpg'

const BADGE_FILTERS = [
  { id: 'favorite', label: 'Favorit',          icon: ThumbsUp },
  { id: 'chef',     label: 'Rekomendasi Chef',  icon: ChefHat  },
  { id: 'spicy',    label: 'Pedas',             icon: Flame    },
]

// Ubah item dari DB ke format yang sama dengan data statis
function dbToItem(row) {
  return {
    id:           row.id,
    name:         row.name,
    price:        row.price,
    desc:         row.description || '',
    badges:       row.badges || [],
    image:        row.image_url || null,
    categoryId:   row.category_id,
    categoryName: row.category_name,
  }
}

// Ubah kategori dari DB ke format yang sama dengan data statis
function buildCategoriesFromDB(rows) {
  const map = {}
  rows.forEach(row => {
    if (!map[row.category_id]) {
      map[row.category_id] = {
        id:    row.category_id,
        name:  row.category_name,
        items: [],
      }
    }
    map[row.category_id].items.push(dbToItem(row))
  })
  return Object.values(map)
}

export default function MenuPage() {
  const [dbItems, setDbItems]         = useState([])
  const [dbCategories, setDbCategories] = useState([])
  const [dbLoading, setDbLoading]     = useState(true)

  const [query, setQuery]             = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeBadge, setActiveBadge] = useState(null)
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  // Load dari Supabase
  useEffect(() => {
    supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('category_id')
      .order('sort_order')
      .then(({ data, error }) => {
        if (!error && data?.length) {
          setDbItems(data.map(dbToItem))
          setDbCategories(buildCategoriesFromDB(data))
        }
        setDbLoading(false)
      })
  }, [])

  // Pakai data DB kalau ada, fallback ke data statis
  const items      = dbItems.length      > 0 ? dbItems      : allMenuItems
  const categories = dbCategories.length > 0 ? dbCategories : menuCategories

  const isFiltering = query.trim() !== '' || activeCategory !== 'all' || activeBadge !== null || favoritesOnly

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter(item => {
      if (favoritesOnly && !favorites.includes(item.id)) return false
      if (activeCategory !== 'all' && item.categoryId !== activeCategory) return false
      if (activeBadge && !item.badges.includes(activeBadge)) return false
      if (q) {
        const hay = `${item.name} ${item.desc} ${item.categoryName}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [query, activeCategory, activeBadge, favoritesOnly, favorites, items])

  const resetFilters = () => {
    setQuery(''); setActiveCategory('all'); setActiveBadge(null); setFavoritesOnly(false)
  }

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Header */}
      <section className="relative pt-32 md:pt-40 pb-14 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroNasiGoreng} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian to-obsidian" />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 md:px-8 text-center">
          <p className="font-body text-xs tracking-[0.3em] text-ember-light uppercase mb-3">Menu Lengkap</p>
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-bone">
            Semua Hidangan COREÉATERY
          </h1>
          <p className="font-body text-stone text-sm md:text-base mt-4 max-w-xl mx-auto">
            {items.length}+ pilihan — dari Nusantara Heritage sampai coffee bar.
            {dbLoading && <span className="ml-2 text-stone/50 text-xs">Memuat menu...</span>}
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-[60px] md:top-[68px] z-30 bg-obsidian/95 backdrop-blur-sm border-y border-white/5 py-4">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
              <input
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Cari menu, misalnya 'nasi goreng' atau 'pasta'..."
                className="w-full bg-charcoal border border-white/10 focus:border-gilt/50 rounded-full pl-10 pr-9 py-2.5 text-sm text-bone placeholder:text-stone/60 outline-none transition-colors"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-bone">
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => setFavoritesOnly(v => !v)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${
                favoritesOnly ? 'bg-ember text-bone' : 'bg-charcoal border border-white/10 text-stone hover:text-bone'
              }`}
            >
              <Heart size={14} className={favoritesOnly ? 'fill-bone' : ''} />
              Favorit Saya {favorites.length > 0 && `(${favorites.length})`}
            </button>
          </div>

          {/* Badge filter */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
            {BADGE_FILTERS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveBadge(v => v === id ? null : id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap transition-colors ${
                  activeBadge === id ? 'bg-gilt text-obsidian font-semibold' : 'bg-white/5 text-stone hover:text-bone'
                }`}>
                <Icon size={12} />{label}
              </button>
            ))}
          </div>

          {/* Kategori */}
          <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar pb-1">
            <button onClick={() => setActiveCategory('all')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap shrink-0 transition-colors ${
                activeCategory === 'all' ? 'bg-bone text-obsidian font-semibold' : 'bg-white/5 text-stone hover:text-bone'
              }`}>
              <LayoutGrid size={12} />Semua Kategori
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap shrink-0 transition-colors ${
                  activeCategory === cat.id ? 'bg-bone text-obsidian font-semibold' : 'bg-white/5 text-stone hover:text-bone'
                }`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hasil */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14">
        {isFiltering ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="font-body text-sm text-stone">{filteredItems.length} menu ditemukan</p>
              <button onClick={resetFilters}
                className="font-body text-xs text-gilt-soft hover:text-gilt underline underline-offset-2">
                Reset filter
              </button>
            </div>
            {filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-xl text-bone mb-2">Ga ketemu menunya</p>
                <p className="font-body text-sm text-stone">Coba kata kunci lain atau reset filter di atas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map(item => (
                  <MenuCard key={item.id} item={item}
                    isFavorite={isFavorite(item.id)} onToggleFavorite={toggleFavorite} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-16">
            {categories.map(cat => (
              <section key={cat.id} id={cat.id}>
                <div className="flex items-baseline justify-between gap-4 mb-5">
                  <h2 className="font-display font-semibold text-2xl md:text-3xl text-bone">{cat.name}</h2>
                  <span className="font-body text-xs text-stone shrink-0">{cat.items.length} menu</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cat.items.map(item => (
                    <MenuCard key={item.id} item={item}
                      isFavorite={isFavorite(item.id)} onToggleFavorite={toggleFavorite} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
