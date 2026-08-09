import { ChefHat, ThumbsUp, Flame, Heart } from 'lucide-react'
import { badgeMeta } from '../../data/fullMenu'

const BADGE_ICON = { chef: ChefHat, favorite: ThumbsUp, spicy: Flame }

export default function MenuCard({ item, isFavorite, onToggleFavorite }) {
  return (
    <div className="group relative rounded-xl bg-charcoal border border-white/5 hover:border-gilt/25 transition-colors overflow-hidden">
      {item.image && (
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-medium text-base text-bone leading-snug">
            {item.name}
          </h3>
          <button
            onClick={() => onToggleFavorite(item.id)}
            aria-label={
              isFavorite ? 'Hapus dari favorit saya' : 'Simpan ke favorit saya'
            }
            aria-pressed={isFavorite}
            className="shrink-0 p-1 -m-1 text-stone hover:text-ember-light transition-colors"
          >
            <Heart
              size={18}
              className={isFavorite ? 'fill-ember-light text-ember-light' : ''}
            />
          </button>
        </div>

        <p className="font-body font-semibold text-gilt-soft text-sm mt-1">
          {item.price}
        </p>

        {item.desc && (
          <p className="font-body text-xs text-stone leading-relaxed mt-2">
            {item.desc}
          </p>
        )}

        {item.badges?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {item.badges.map((b) => {
              const Icon = BADGE_ICON[b]
              return (
                <span
                  key={b}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    b === 'spicy'
                      ? 'bg-ember/15 text-ember-light'
                      : 'bg-gilt/15 text-gilt-soft'
                  }`}
                >
                  <Icon size={10} />
                  {badgeMeta[b].label}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
