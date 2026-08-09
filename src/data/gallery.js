import ambiance from '../assets/dishes/ambiance-interior.jpg'
import ayambakar from '../assets/dishes/dish-ayambakar.jpg'
import fishnfries from '../assets/dishes/dish-fishnfries.jpg'
import habanero from '../assets/dishes/dish-habanero.jpg'
import nasiGorengAsap from '../assets/dishes/hero-nasigoreng.jpg'
import nasiGorengAsap2 from '../assets/dishes/dish-nasi-goreng-asap2.jpg'
import pasta from '../assets/dishes/dish-pasta.jpg'
import ricebowl from '../assets/dishes/dish-ricebowl.jpg'
import coffee from '../assets/dishes/drinks-coffee.jpg'
import mocktail from '../assets/dishes/drinks-mocktail.jpg'
import tea from '../assets/dishes/drinks-tea.jpg'
import sotoLamongan from '../assets/dishes/dish-soto-lamongan.jpg'

export const galleryCategories = ['Semua', 'Nusantara', 'Western', 'Rice Bowl', 'Dessert & Drinks', 'Suasana']

export const galleryPhotos = [
  {
    id: 'g-ambiance',
    src: ambiance,
    alt: 'Suasana ruang makan COREÉATERY',
    category: 'Suasana',
    // kolom & baris hint buat masonry (relative weight)
    cols: 2, // span 2 kolom di grid desktop
  },
  {
    id: 'g-nasi-goreng-asap-hero',
    src: nasiGorengAsap,
    alt: 'Nasi Goreng Sambal Asap — sajian dramatis',
    category: 'Nusantara',
    cols: 1,
  },
  {
    id: 'g-nasi-goreng-asap2',
    src: nasiGorengAsap2,
    alt: 'Nasi Goreng Sambal Asap — bumbu rempah',
    category: 'Nusantara',
    cols: 2,
  },
  {
    id: 'g-ayambakar',
    src: ayambakar,
    alt: 'Ayam Bakar Rempah',
    category: 'Nusantara',
    cols: 1,
  },
  {
    id: 'g-soto',
    src: sotoLamongan,
    alt: 'Soto Lamongan — kuah kuning rempah',
    category: 'Nusantara',
    cols: 1,
  },
  {
    id: 'g-habanero',
    src: habanero,
    alt: 'Habanero Seafood Soup',
    category: 'Nusantara',
    cols: 2,
  },
  {
    id: 'g-fishnfries',
    src: fishnfries,
    alt: 'Fish n Fries — dory fillet crispy',
    category: 'Western',
    cols: 1,
  },
  {
    id: 'g-pasta',
    src: pasta,
    alt: 'Pasta — Western mains',
    category: 'Western',
    cols: 1,
  },
  {
    id: 'g-ricebowl',
    src: ricebowl,
    alt: 'Rice Bowl Signature',
    category: 'Rice Bowl',
    cols: 2,
  },
  {
    id: 'g-coffee',
    src: coffee,
    alt: 'Coffee bar COREÉATERY',
    category: 'Dessert & Drinks',
    cols: 1,
  },
  {
    id: 'g-mocktail',
    src: mocktail,
    alt: 'Signature mocktails',
    category: 'Dessert & Drinks',
    cols: 1,
  },
  {
    id: 'g-tea',
    src: tea,
    alt: 'Artisan teas',
    category: 'Dessert & Drinks',
    cols: 1,
  },
]
