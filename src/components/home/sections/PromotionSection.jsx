import { Sparkles } from 'lucide-react'
import IconInstagram from '../../icons/IconInstagram'

export default function PromotionSection({ data }) {
  return (
    <section className="relative bg-charcoal py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-gilt" />
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-gilt" />
      </div>
      <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
        <Sparkles className="mx-auto text-gilt mb-5" size={26} strokeWidth={1.5} />
        <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-bone text-balance">
          {data.title}
        </h2>
        {data.description && (
          <p className="font-body text-stone text-sm md:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            {data.description}
          </p>
        )}
        {data.cta_text && data.cta_url && (
          <a href={data.cta_url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-bone hover:bg-gilt-soft transition-colors px-7 py-3 text-sm font-semibold text-obsidian mt-7">
            <IconInstagram size={16} />{data.cta_text}
          </a>
        )}
      </div>
    </section>
  )
}
