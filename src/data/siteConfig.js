// Semua data bisnis COREÉATERY terpusat di sini.
// Ganti nilai di sini kalau ada perubahan alamat/jam/kontak.
// PENTING: VITE_GA_ID diisi di .env setelah dapat ID dari Google Analytics.

export const siteConfig = {
  name: 'COREÉATERY',
  tagline: 'Savor The Taste',
  description:
    'Restoran fusion yang memadukan kekayaan cita rasa Nusantara dengan sentuhan Western dan Jepang, di jantung Cianjur.',

  address: {
    full: 'Jl. Mangunsarkoro No.105, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211',
    short: 'Jl. Mangunsarkoro No.105, Cianjur',
  },

  contact: {
    whatsapp: '6281510290168',
    whatsappDisplay: '0815-1029-0168',
    ownerContact: '081 123 168 03 (Andrew)',
  },

  hours: {
    display: '10.00 – 22.00 WIB',
    note: 'Setiap hari',
  },

  social: {
    instagram: 'https://www.instagram.com/coreeatery',
    instagramHandle: '@coreeatery',
    instagramEmbedUrl: 'https://www.instagram.com/coreeatery/embed',
  },

  maps: {
    // Google Maps Embed tanpa API key (pakai /maps?q= endpoint)
    embedSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.5!2d107.1400!3d-6.8218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDknMTguNSJTIDEwN8KwMDgnMjQuMCJF!5e0!3m2!1sid!2sid!4v1699999999999!5m2!1sid!2sid',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=' +
      encodeURIComponent('Jl. Mangunsarkoro No.105, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211'),
    reviewUrl:
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('COREEATERY Cianjur Jl Mangunsarkoro'),
    searchUrl:
      'https://www.google.com/maps/search/COREEATERY+Cianjur+Jl+Mangunsarkoro',
  },

  // Google Analytics — isi di .env: VITE_GA_ID=G-XXXXXXXXXX
  analytics: {
    gaId: import.meta.env.VITE_GA_ID ?? '',
  },

  seo: {
    siteUrl: 'https://coreeatery.vercel.app',
    ogImage: 'https://coreeatery.vercel.app/og-image.jpg',
  },
}

export const whatsappLink = (message) =>
  `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`
