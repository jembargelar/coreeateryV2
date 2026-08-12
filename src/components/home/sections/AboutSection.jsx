import { Flame, Sparkles, HeartHandshake } from 'lucide-react'
import { getImageUrl } from '../../../hooks/useHomepageCMS'
import defaultAbout from '../../../assets/dishes/ambiance-interior.jpg'

export default function AboutSection({ data }) {
  const img   = getImageUrl(data.image_path) ?? defaultAbout
  const extra = data.extra ?? {}

  const values = [
    { icon: Flame,         title: extra.nilai_1_title || 'Cita Rasa Otentik',  desc: extra.nilai_1_desc || '' },
    { icon: Sparkles,      title: extra.nilai_2_title || 'Kualitas Premium',   desc: extra.nilai_2_desc || '' },
    { icon: HeartHandshake,title: extra.nilai_3_title || 'Pengalaman Berkesan',desc: extra.nilai_3_desc || '' },
  ]

  return (
    <section id="about" className="relative bg-bone text-obsidian py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-center">
          <div className="relative order-2 md:order-1">
            <div className="rounded-[2rem] overflow-hidden aspect-[4/5] ring-1 ring-obsidian/10">
              <img src={img} alt="Suasana COREÉATERY" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-4 md:-right-8 w-24 h-24 md:w-32 md:h-32 rounded-full border border-gilt-dim bg-obsidian flex items-center justify-center">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border-[3px] border-gilt flex items-center justify-center">
                <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-ember" />
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            {data.subtitle && (
              <p className="font-body text-xs tracking-[0.3em] text-ember uppercase mb-4">{data.subtitle}</p>
            )}
            <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight text-balance">
              {data.title}
            </h2>
            {data.description && (
              <p className="font-body text-obsidian/70 text-base md:text-lg leading-relaxed mt-6">
                {data.description}
              </p>
            )}
            {extra.visi && (
              <p className="font-body text-obsidian/70 text-base md:text-lg leading-relaxed mt-4">
                <span className="font-semibold text-obsidian">Visi kami:</span> {extra.visi}
              </p>
            )}
            <div className="grid sm:grid-cols-3 gap-5 mt-10">
              {values.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-left">
                  <div className="w-10 h-10 rounded-full bg-obsidian/5 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-ember" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-body font-semibold text-sm mb-1.5">{title}</h3>
                  {desc && <p className="font-body text-xs text-obsidian/60 leading-relaxed">{desc}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
