import fishnfries from '../assets/dishes/dish-fishnfries.jpg'
import habanero from '../assets/dishes/dish-habanero.jpg'
import ayambakar from '../assets/dishes/dish-ayambakar.jpg'
import pasta from '../assets/dishes/dish-pasta.jpg'
import ricebowl from '../assets/dishes/dish-ricebowl.jpg'

// Data harga & deskripsi diambil langsung dari menu PDF asli COREÉATERY.
// Badge hanya dipasang kalau memang ada di menu aslinya — tidak dikarang.
export const menuFavorites = [
  {
    id: 'fish-n-fries',
    name: 'Fish n Fries',
    price: '38K',
    category: 'Western Mains',
    desc: 'Dory fillet crispy dengan kentang goreng & salad segar.',
    badges: ['favorite'],
    image: fishnfries,
  },
  {
    id: 'habanero-seafood',
    name: 'Habanero Seafood Soup',
    price: '60K',
    category: 'Habanero Signature Soup',
    desc: 'Squid, shrimp, telur rebus & noodle glaze. Untuk 1–2 orang.',
    badges: ['favorite', 'spicy'],
    image: habanero,
  },
  {
    id: 'ayam-rempah-bakar',
    name: 'Paket Ayam Rempah Bakar',
    price: '53K',
    category: 'Nusantara Heritage',
    desc: 'Ayam bakar berbumbu rempah meresap, disajikan dengan nasi, tempe, tahu, dan sambal otentik.',
    badges: ['signature'],
    image: ayambakar,
  },
  {
    id: 'fettucine-carbonara',
    name: 'Fettucine Carbonara',
    price: '42K',
    category: 'Western Mains & Pasta',
    desc: 'Pasta fettucine dengan saus carbonara klasik & smoke beef.',
    badges: ['favorite'],
    image: pasta,
  },
  {
    id: 'beef-teriyaki-don',
    name: 'Beef Teriyaki Don',
    price: '40K',
    category: 'Rice Bowl Signature',
    desc: 'Irisan daging sapi lembut dengan pilihan saus teriyaki, disajikan di atas nasi hangat.',
    badges: [],
    image: ricebowl,
  },
  {
    id: 'sop-iga-bakar',
    name: 'Sop Iga Bakar',
    price: '83K',
    category: 'Traditional Soups & Soto',
    desc: 'Iga empuk dengan sop hangat, nasi, sambal, dan keripik.',
    badges: ['favorite'],
    image: null,
  },
  {
    id: 'chicken-sambal-matah',
    name: 'Chicken Rice Sambal Matah',
    price: '38K',
    category: 'Nusantara Heritage',
    desc: 'Ayam fillet pan-seared dengan sambal matah Bali segar.',
    badges: ['chef', 'spicy'],
    image: null,
  },
]

export const badgeMeta = {
  favorite: { label: 'Paling Favorit', color: 'text-gilt' },
  chef: { label: 'Rekomendasi Chef', color: 'text-gilt' },
  spicy: { label: 'Pedas', color: 'text-ember-light' },
  signature: { label: 'Menu Signature', color: 'text-gilt' },
}
