import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'coreeatery:favorites'

function readStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(readStorage)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // localStorage tidak tersedia (private browsing dsb) — abaikan, tetap
      // jalan normal dalam sesi ini, cuma ga persist antar kunjungan.
    }
  }, [favorites])

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }, [])

  return { favorites, isFavorite, toggleFavorite }
}
