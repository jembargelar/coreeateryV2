import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const DEFAULT_SECTIONS = {
  hero: {
    section_key: 'hero', is_visible: true, sort_order: 1,
    title: 'COREÉATERY', subtitle: 'Savor The Taste',
    description: 'Nusantara, Western, dan Jepang bertemu dalam satu meja — dari steak dan pasta, rice bowl dan soto hangat, hingga dessert artisan. Disajikan dalam suasana premium di jantung Cianjur.',
    cta_text: 'Lihat Menu', cta_url: '/menu', image_path: null,
    extra: { cta2_text: 'Reservasi Sekarang', cta2_url: '/reservasi', badge_text: 'Cianjur — Fusion Dining' }
  },
  about: {
    section_key: 'about', is_visible: true, sort_order: 2,
    title: 'Cerita di Balik COREÉATERY', subtitle: 'Tentang Kami',
    description: 'COREÉATERY hadir merayakan pertemuan tiga dunia rasa — kehangatan Nusantara, kemewahan Western, dan presisi Jepang. Dari kalio khas Padang hingga porterhouse steak, dari rice bowl teriyaki hingga habanero soup, setiap hidangan diracik dengan bahan pilihan dan bumbu yang meresap sempurna.',
    image_path: null,
    extra: {
      visi: 'Menjadi ruang makan pilihan yang menghadirkan pengalaman fusion premium.',
      nilai_1_title: 'Cita Rasa Otentik',   nilai_1_desc: 'Setiap resep diracik dengan bumbu pilihan dan teknik matang.',
      nilai_2_title: 'Kualitas Premium',    nilai_2_desc: 'Bahan segar, penyajian rapi, standar dapur konsisten.',
      nilai_3_title: 'Pengalaman Berkesan', nilai_3_desc: 'Dari sambutan hingga suapan terakhir, momen yang layak dikenang.',
    }
  },
  menu_favorit: {
    section_key: 'menu_favorit', is_visible: true, sort_order: 3,
    title: 'Hidangan Pilihan Kami', subtitle: 'Menu Favorit',
    description: 'Sebagian dari yang paling dicari tamu kami — harga dalam ribuan rupiah (K).',
    cta_text: 'Lihat Menu Lengkap', cta_url: '/menu', extra: {}
  },
  promotion: {
    section_key: 'promotion', is_visible: true, sort_order: 4,
    title: 'Promo & Event Terbaru', subtitle: 'Promo',
    description: 'Info diskon, menu musiman, dan event spesial kami umumkan lebih dulu di Instagram. Follow @coreeatery biar ga ketinggalan.',
    cta_text: 'Follow @coreeatery', cta_url: 'https://www.instagram.com/coreeatery', extra: {}
  },
  gallery: {
    section_key: 'gallery', is_visible: true, sort_order: 5,
    title: 'Sekilas dari COREÉATERY', subtitle: 'Galeri',
    cta_text: 'Lihat Semua Foto', cta_url: '/galeri', extra: {}
  },
  reviews: {
    section_key: 'reviews', is_visible: true, sort_order: 6,
    title: 'Kepuasan Anda Prioritas Kami', subtitle: 'Review',
    description: 'Sudah makan di COREÉATERY? Bagikan momen berharga Anda lewat Google Review — sebagai ucapan terima kasih, dapatkan ice cream gratis untuk kunjungan berikutnya.',
    cta_text: 'Tulis Google Review',
    cta_url: 'https://www.google.com/maps/search/?api=1&query=COREEATERY+Cianjur', extra: {}
  },
  reservation_cta: {
    section_key: 'reservation_cta', is_visible: true, sort_order: 7,
    title: 'Amankan Meja Anda Hari Ini', subtitle: 'Reservasi',
    description: 'Chat langsung tim kami di WhatsApp untuk reservasi — sebutkan nama, tanggal, jam, dan jumlah tamu.',
    cta_text: 'Reservasi Online', cta_url: '/reservasi',
    extra: { cta2_text: 'via WhatsApp', hours: '10.00 – 22.00 WIB', hours_note: 'Setiap hari', address: 'Jl. Mangunsarkoro No.105, Cianjur' }
  },
}

export function getImageUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  const { data } = supabase.storage.from('homepage').getPublicUrl(path)
  return data?.publicUrl ?? null
}

export function useHomepageCMS() {
  // PENTING: loading=false dari awal — render default dulu, update dari DB kalau ada
  const [sections, setSections] = useState(DEFAULT_SECTIONS)
  const [loading, setLoading]   = useState(false)

  useCallback(async () => {
    try {
      const { data } = await supabase
        .from('homepage_sections')
        .select('*')
        .order('sort_order')

      if (!data?.length) return

      const map = {}
      data.forEach(s => {
        map[s.section_key] = {
          ...s,
          extra: typeof s.extra === 'string' ? JSON.parse(s.extra) : (s.extra ?? {})
        }
      })
      setSections(prev => ({ ...prev, ...map }))
    } catch {
      // Supabase belum setup / tidak bisa dicapai — default tetap tampil
    }
  }, [])

  // Load di background, tidak block render
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('homepage_sections')
          .select('*')
          .order('sort_order')
        if (!data?.length) return
        const map = {}
        data.forEach(s => {
          map[s.section_key] = {
            ...s,
            extra: typeof s.extra === 'string' ? JSON.parse(s.extra) : (s.extra ?? {})
          }
        })
        setSections(prev => ({ ...prev, ...map }))
      } catch { /* silent - pakai default */ }
    }
    load()
  }, [])

  return { sections, loading }
}
