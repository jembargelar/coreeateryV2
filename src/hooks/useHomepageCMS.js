import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const DEFAULT_SECTIONS = {
  hero: {
    section_key: 'hero', is_visible: true, sort_order: 1,
    title: 'COREÉATERY', subtitle: 'Savor The Taste',
    description: 'Nusantara, Western, dan Jepang bertemu dalam satu meja.',
    cta_text: 'Lihat Menu', cta_url: '/menu', image_path: null,
    extra: { cta2_text: 'Reservasi Sekarang', cta2_url: '/reservasi', badge_text: 'Cianjur — Fusion Dining' }
  },
  about: { section_key: 'about', is_visible: true, sort_order: 2, title: 'Cerita di Balik COREÉATERY', subtitle: 'Tentang Kami', description: '', extra: {} },
  menu_favorit: { section_key: 'menu_favorit', is_visible: true, sort_order: 3, title: 'Hidangan Pilihan Kami', subtitle: 'Menu Favorit', description: '', cta_text: 'Lihat Menu Lengkap', cta_url: '/menu', extra: {} },
  promotion: { section_key: 'promotion', is_visible: true, sort_order: 4, title: 'Promo & Event Terbaru', subtitle: 'Promo', description: '', cta_text: 'Follow @coreeatery', cta_url: 'https://www.instagram.com/coreeatery', extra: {} },
  gallery: { section_key: 'gallery', is_visible: true, sort_order: 5, title: 'Sekilas dari COREÉATERY', subtitle: 'Galeri', description: '', cta_text: 'Lihat Semua Foto', cta_url: '/galeri', extra: {} },
  reviews: { section_key: 'reviews', is_visible: true, sort_order: 6, title: 'Kepuasan Anda Prioritas Kami', subtitle: 'Review', description: '', cta_text: 'Tulis Google Review', extra: {} },
  reservation_cta: { section_key: 'reservation_cta', is_visible: true, sort_order: 7, title: 'Amankan Meja Anda Hari Ini', subtitle: 'Reservasi', description: '', cta_text: 'Reservasi Online', cta_url: '/reservasi', extra: { hours: '10.00 – 22.00 WIB', hours_note: 'Setiap hari', address: 'Jl. Mangunsarkoro No.105, Cianjur' } }
}

export function getImageUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  const { data } = supabase.storage.from('homepage').getPublicUrl(path)
  return data?.publicUrl ?? null
}

export function useHomepageCMS() {
  const [sections, setSections] = useState(DEFAULT_SECTIONS)
  const [loading, setLoading]   = useState(true)

  const load = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .order('sort_order')

      if (error || !data?.length) {
        setLoading(false)
        return
      }

      const map = {}
      data.forEach(s => {
        map[s.section_key] = {
          ...s,
          extra: typeof s.extra === 'string' ? JSON.parse(s.extra) : (s.extra ?? {})
        }
      })
      setSections(prev => ({ ...prev, ...map }))
    } catch {
      // Supabase belum disetup — pakai default, ga error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { sections, loading, reload: load }
}
