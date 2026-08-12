import { useHomepageCMS, getImageUrl } from '../hooks/useHomepageCMS'
import HeroSection from '../components/home/sections/HeroSection'
import AboutSection from '../components/home/sections/AboutSection'
import MenuFavoritSection from '../components/home/sections/MenuFavoritSection'
import PromotionSection from '../components/home/sections/PromotionSection'
import GallerySection from '../components/home/sections/GallerySection'
import ReviewsSection from '../components/home/sections/ReviewsSection'
import ReservationCTASection from '../components/home/sections/ReservationCTASection'
import InstagramSection from '../components/home/InstagramSection'

export default function Home() {
  const { sections, loading } = useHomepageCMS()

  // Sort sections by sort_order
  const sorted = Object.values(sections).sort((a, b) => a.sort_order - b.sort_order)

  const SECTION_MAP = {
    hero:            (s) => <HeroSection key="hero" data={s} />,
    about:           (s) => <AboutSection key="about" data={s} />,
    menu_favorit:    (s) => <MenuFavoritSection key="menu_favorit" data={s} />,
    promotion:       (s) => <PromotionSection key="promotion" data={s} />,
    gallery:         (s) => <GallerySection key="gallery" data={s} />,
    reviews:         (s) => <ReviewsSection key="reviews" data={s} />,
    reservation_cta: (s) => <ReservationCTASection key="reservation_cta" data={s} />,
  }

  return (
    <>
      {sorted.map(s => {
        if (!s.is_visible) return null
        const render = SECTION_MAP[s.section_key]
        return render ? render(s) : null
      })}
      <InstagramSection />
    </>
  )
}
