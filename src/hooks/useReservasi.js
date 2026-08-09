import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { whatsappLink } from '../data/siteConfig'

// Batas minimum: reservasi minimal H-1 biar staff punya waktu persiapan
const MIN_DAYS_AHEAD = 0 // 0 = bisa hari ini, ganti ke 1 kalau mau wajib H-1

export function useReservasi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)   // string | null
  const [success, setSuccess] = useState(false)

  const submit = async (formData) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error: sbErr } = await supabase.from('reservasi').insert([
        {
          nama: formData.nama.trim(),
          no_wa: formData.no_wa.trim(),
          email: formData.email?.trim() || null,
          jumlah_tamu: Number(formData.jumlah_tamu),
          tanggal: formData.tanggal,
          jam: formData.jam,
          catatan: formData.catatan?.trim() || null,
          status: 'pending',
        },
      ])

      if (sbErr) throw sbErr

      setSuccess(true)
      return { ok: true }
    } catch (err) {
      console.error('[Reservasi] Supabase error:', err)
      // Kalau Supabase belum di-setup / error koneksi → fallback WA
      // User tetap bisa reservasi, jangan biarkan mereka ketahan
      const waText =
        `Halo COREÉATERY, saya ingin reservasi meja.\n\n` +
        `Nama: ${formData.nama}\n` +
        `WhatsApp: ${formData.no_wa}\n` +
        `Tanggal: ${formData.tanggal}\n` +
        `Jam: ${formData.jam} WIB\n` +
        `Jumlah tamu: ${formData.jumlah_tamu} orang\n` +
        (formData.catatan ? `Catatan: ${formData.catatan}\n` : '') +
        `\nMohon konfirmasi ketersediaan meja. Terima kasih!`

      setError('fallback_wa')
      return { ok: false, fallbackWa: whatsappLink(waText) }
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setError(null)
    setSuccess(false)
  }

  return { submit, loading, error, success, reset }
}

// Helper: tanggal minimum yang bisa dipilih di date picker
export function getMinDate() {
  const d = new Date()
  d.setDate(d.getDate() + MIN_DAYS_AHEAD)
  return d.toISOString().split('T')[0]
}

// Helper: daftar slot jam operasional (10.00–21.00, per 30 menit)
// Slot 21.30 & 22.00 dikosongkan biar ada buffer sebelum tutup jam 22.00
export function getJamSlots() {
  const slots = []
  for (let h = 10; h <= 21; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
    if (h < 21) slots.push(`${String(h).padStart(2, '0')}:30`)
  }
  return slots
}
