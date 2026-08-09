import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import MenuPage from './pages/MenuPage'
import ReservasiPage from './pages/ReservasiPage'
import GalleryPage from './pages/GalleryPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminReservasi from './pages/admin/AdminReservasi'
import AdminMenu from './pages/admin/AdminMenu'
import { AdminGallery, AdminPromo } from './pages/admin/AdminPlaceholders'
import ComingSoon from './pages/ComingSoon'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollManager />
        <Routes>
          {/* === Public routes (dengan Navbar + Footer) === */}
          <Route element={<PublicLayout />}>
            <Route path="/"          element={<Home />} />
            <Route path="/menu"      element={<MenuPage />} />
            <Route path="/reservasi" element={<ReservasiPage />} />
            <Route path="/galeri"    element={<GalleryPage />} />
            <Route path="*"          element={<ComingSoon title="Halaman" />} />
          </Route>

          {/* === Admin routes (sidebar layout, no public nav) === */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin"       element={<AdminLayout />}>
            <Route index              element={<AdminDashboard />} />
            <Route path="reservasi"   element={<AdminReservasi />} />
            <Route path="menu"        element={<AdminMenu />} />
            <Route path="gallery"     element={<AdminGallery />} />
            <Route path="promo"       element={<AdminPromo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

import { Outlet } from 'react-router-dom'
function PublicLayout() {
  return (
    <>
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </>
  )
}
