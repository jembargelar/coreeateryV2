import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import MenuPage from './pages/MenuPage'
import ComingSoon from './pages/ComingSoon'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/reservasi" element={<ComingSoon title="Reservasi Online" />} />
          <Route path="/galeri" element={<ComingSoon title="Galeri Lengkap" />} />
          <Route path="*" element={<ComingSoon title="Halaman" />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
