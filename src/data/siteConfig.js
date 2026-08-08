// Semua data bisnis COREÉATERY terpusat di sini.
// Ganti nilai di sini kalau ada perubahan alamat/jam/kontak — otomatis
// ke-update di seluruh halaman.

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
    whatsapp: '6281510290168', // format internasional tanpa + / spasi, untuk wa.me
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
  },

  maps: {
    embedSrc:
      'https://www.google.com/maps?q=' +
      encodeURIComponent(
        'Jl. Mangunsarkoro No.105, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211'
      ) +
      '&output=embed',
    directionsUrl:
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(
        'Jl. Mangunsarkoro No.105, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211'
      ),
    reviewUrl:
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('COREEATERY Cianjur'),
  },
}

export const whatsappLink = (message) =>
  `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`
