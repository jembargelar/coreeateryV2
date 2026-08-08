import Hero from '../components/home/Hero'
import About from '../components/home/About'
import MenuFavorit from '../components/home/MenuFavorit'
import Promotion from '../components/home/Promotion'
import Gallery from '../components/home/Gallery'
import Reviews from '../components/home/Reviews'
import ReservationCTA from '../components/home/ReservationCTA'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <MenuFavorit />
      <Promotion />
      <Gallery />
      <Reviews />
      <ReservationCTA />
    </>
  )
}
