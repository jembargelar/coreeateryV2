import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import MenuPage from './pages/MenuPage'
import ReservasiPage from './pages/ReservasiPage'
import GalleryPage from './pages/GalleryPage'
import ComingSoon from './pages/ComingSoon'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Navbar />
      <main>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/menu"      element={<MenuPage />} />
          <Route path="/reservasi" element={<ReservasiPage />} />
          <Route path="/galeri"    element={<GalleryPage />} />
          <Route path="*"          element={<ComingSoon title="Halaman" />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
