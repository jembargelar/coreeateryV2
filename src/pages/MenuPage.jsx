import { useMemo, useState } from 'react'
import {
  Search,
  X,
  Heart,
  ChefHat,
  ThumbsUp,
  Flame,
  LayoutGrid,
} from 'lucide-react'
import { menuCategories, allMenuItems } from '../data/fullMenu'
import { useFavorites } from '../hooks/useFavorites'
import MenuCard from '../components/menu/MenuCard'
import heroNasiGoreng from '../assets/dishes/hero-nasigoreng.jpg'

const BADGE_FILTERS = [
  { id: 'favorite', label: 'Favorit', icon: ThumbsUp },
  { id: 'chef', label: 'Rekomendasi Chef', icon: ChefHat },
  { id: 'spicy', label: 'Pedas', icon: Flame },
]

export default function MenuPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeBadge, setActiveBadge] = useState(null)
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  const isFiltering =
    query.trim() !== '' || activeCategory !== 'all' || activeBadge !== null || favoritesOnly

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allMenuItems.filter((item) => {
      if (favoritesOnly && !favorites.includes(item.id)) return false
      if (activeCategory !== 'all' && item.categoryId !== activeCategory) return false
      if (activeBadge && !item.badges.includes(activeBadge)) return false
      if (q) {
        const haystack = `${item.name} ${item.desc} ${item.categoryName}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [query, activeCategory, activeBadge, favoritesOnly, favorites])

  const resetFilters = () => {
    setQuery('')
    setActiveCategory('all')
    setActiveBadge(null)
    setFavoritesOnly(false)
  }

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Header banner */}
      <section className="relative pt-32 md:pt-40 pb-14 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroNasiGoreng}
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian to-obsidian" />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 md:px-8 text-center">
          <p className="font-body text-xs tracking-[0.3em] text-ember-light uppercase mb-3">
            Menu Lengkap
          </p>
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-bone">
            Semua Hidangan COREÉATERY
          </h1>
          <p className="font-body text-stone text-sm md:text-base mt-4 max-w-xl mx-auto">
            {allMenuItems.length}+ pilihan — dari Nusantara Heritage sampai
            coffee bar. Harga dalam ribuan rupiah (K).
          </p>
        </div>
      </section>

      {/* Search + filters */}
      <div className="sticky top-[60px] md:top-[68px] z-30 bg-obsidian/95 backdrop-blur-sm border-y border-white/5 py-4">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari menu, misalnya 'nasi goreng' atau 'pasta'..."
                className="w-full bg-charcoal border border-white/10 focus:border-gilt/50 rounded-full pl-10 pr-9 py-2.5 text-sm text-bone placeholder:text-stone/60 outline-none transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-bone"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              onClick={() => setFavoritesOnly((v) => !v)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${
                favoritesOnly
                  ? 'bg-ember text-bone'
                  : 'bg-charcoal border border-white/10 text-stone hover:text-bone'
              }`}
            >
              <Heart size={14} className={favoritesOnly ? 'fill-bone' : ''} />
              Favorit Saya {favorites.length > 0 && `(${favorites.length})`}
            </button>
          </div>

          {/* Badge filter chips */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
            {BADGE_FILTERS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveBadge((v) => (v === id ? null : id))}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap transition-colors ${
                  activeBadge === id
                    ? 'bg-gilt text-obsidian font-semibold'
                    : 'bg-white/5 text-stone hover:text-bone'
                }`}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap transition-colors shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-bone text-obsidian font-semibold'
                  : 'bg-white/5 text-stone hover:text-bone'
              }`}
            >
              <LayoutGrid size={12} />
              Semua Kategori
            </button>
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap transition-colors shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-bone text-obsidian font-semibold'
                    : 'bg-white/5 text-stone hover:text-bone'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14">
        {isFiltering ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="font-body text-sm text-stone">
                {filteredItems.length} menu ditemukan
              </p>
              <button
                onClick={resetFilters}
                className="font-body text-xs text-gilt-soft hover:text-gilt underline underline-offset-2"
              >
                Reset filter
              </button>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-xl text-bone mb-2">
                  Ga ketemu menunya
                </p>
                <p className="font-body text-sm text-stone">
                  Coba kata kunci lain atau reset filter di atas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-16">
            {menuCategories.map((cat) => (
              <section key={cat.id} id={cat.id}>
                <div className="flex items-baseline justify-between gap-4 mb-1">
                  <h2 className="font-display font-semibold text-2xl md:text-3xl text-bone">
                    {cat.name}
                  </h2>
                  <span className="font-body text-xs text-stone shrink-0">
                    {cat.items.length} menu
                  </span>
                </div>
                {cat.subtitle && (
                  <p className="font-body text-xs text-gilt-soft mb-5">
                    {cat.subtitle}
                  </p>
                )}
                {!cat.subtitle && <div className="mb-5" />}

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cat.items.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      isFavorite={isFavorite(item.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>

                {cat.notes?.map((note) => (
                  <p
                    key={note}
                    className="font-body text-xs text-stone/70 italic mt-4"
                  >
                    {note}
                  </p>
                ))}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
