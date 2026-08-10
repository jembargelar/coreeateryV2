import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollManager from './components/ScrollManager'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import MenuPage from './pages/MenuPage'
import ReservasiPage from './pages/ReservasiPage'
import GalleryPage from './pages/GalleryPage'
import ComingSoon from './pages/ComingSoon'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminReservasi from './pages/admin/AdminReservasi'
import AdminMenu from './pages/admin/AdminMenu'
import AdminGaleri from './pages/admin/AdminGaleri'
import AdminPromo from './pages/admin/AdminPromo'

function AdminSection() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route path="*" element={
          <AdminLayout>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="reservasi" element={<AdminReservasi />} />
              <Route path="menu"      element={<AdminMenu />} />
              <Route path="galeri"    element={<AdminGaleri />} />
              <Route path="promo"     element={<AdminPromo />} />
            </Routes>
          </AdminLayout>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes — tanpa Navbar/Footer publik */}
        <Route path="/admin/*" element={<AdminSection />} />

        {/* Public routes */}
        <Route path="/*" element={
          <>
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
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}
