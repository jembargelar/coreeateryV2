import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import GoogleAnalytics from './components/analytics/GoogleAnalytics'
import ScrollManager from './components/ScrollManager'
import { AuthProvider } from './context/AuthContext'

// Public pages — lazy loaded (code splitting per route)
const Home        = lazy(() => import('./pages/Home'))
const MenuPage    = lazy(() => import('./pages/MenuPage'))
const ReservasiPage = lazy(() => import('./pages/ReservasiPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const ComingSoon  = lazy(() => import('./pages/ComingSoon'))

// Admin pages — lazy loaded (tidak dimuat sama sekali kecuali ke /admin)
const AdminLogin     = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminReservasi = lazy(() => import('./pages/admin/AdminReservasi'))
const AdminMenu      = lazy(() => import('./pages/admin/AdminMenu'))
const AdminGaleri    = lazy(() => import('./pages/admin/AdminGaleri'))
const AdminPromo     = lazy(() => import('./pages/admin/AdminPromo'))
const AdminLayout    = lazy(() => import('./components/admin/AdminLayout'))

function PageLoader() {
  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-gilt border-t-transparent animate-spin" />
    </div>
  )
}

function AdminSection() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="login" element={<AdminLogin />} />
          <Route path="*" element={
            <AdminLayout>
              <Routes>
                <Route index          element={<AdminDashboard />} />
                <Route path="reservasi" element={<AdminReservasi />} />
                <Route path="menu"      element={<AdminMenu />} />
                <Route path="galeri"    element={<AdminGaleri />} />
                <Route path="promo"     element={<AdminPromo />} />
              </Routes>
            </AdminLayout>
          } />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminSection />} />
        <Route path="/*" element={
          <>
            <ScrollManager />
            <GoogleAnalytics />
            <Navbar />
            <main>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/"          element={<Home />} />
                  <Route path="/menu"      element={<MenuPage />} />
                  <Route path="/reservasi" element={<ReservasiPage />} />
                  <Route path="/galeri"    element={<GalleryPage />} />
                  <Route path="*"          element={<ComingSoon title="Halaman" />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}
