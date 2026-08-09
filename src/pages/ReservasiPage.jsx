import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Phone, Mail, Calendar, Clock, Users,
  MessageSquare, CheckCircle2, MessageCircle, ArrowLeft, AlertCircle,
} from 'lucide-react'
import { useReservasi, getMinDate, getJamSlots } from '../hooks/useReservasi'
import { siteConfig } from '../data/siteConfig'

const JAM_SLOTS = getJamSlots()
const MIN_DATE  = getMinDate()

const JUMLAH_OPTIONS = [1,2,3,4,5,6,7,8,9,10,'10+']

function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-medium text-stone uppercase tracking-wider mb-2">
        <Icon size={13} />
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-ember-light flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'w-full bg-charcoal border border-white/10 focus:border-gilt/50 rounded-xl px-4 py-3 ' +
  'text-sm text-bone placeholder:text-stone/50 outline-none transition-colors'

function validate(f) {
  const errs = {}
  if (!f.nama.trim())        errs.nama = 'Nama wajib diisi'
  if (!f.no_wa.trim())       errs.no_wa = 'Nomor WA wajib diisi'
  else if (!/^(08|\+628|628)\d{7,13}$/.test(f.no_wa.replace(/[\s-]/g,'')))
                             errs.no_wa = 'Format nomor tidak valid (contoh: 0815-xxxx-xxxx)'
  if (!f.tanggal)            errs.tanggal = 'Pilih tanggal reservasi'
  if (!f.jam)                errs.jam = 'Pilih jam reservasi'
  if (!f.jumlah_tamu)        errs.jumlah_tamu = 'Pilih jumlah tamu'
  return errs
}

export default function ReservasiPage() {
  const { submit, loading, success, error, reset } = useReservasi()
  const [fallbackUrl, setFallbackUrl] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const [form, setForm] = useState({
    nama: '', no_wa: '', email: '',
    tanggal: '', jam: '', jumlah_tamu: '',
    catatan: '',
  })

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }))
    setFieldErrors((p) => ({ ...p, [k]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setFieldErrors(errs); return }

    const result = await submit(form)
    if (!result.ok && result.fallbackWa) {
      setFallbackUrl(result.fallbackWa)
    }
  }

  // ── State: sukses ────────────────────────────────────────────
  if (success) {
    return (
      <SuccessScreen
        nama={form.nama}
        tanggal={form.tanggal}
        jam={form.jam}
        jumlah={form.jumlah_tamu}
        onReset={() => { reset(); setForm({ nama:'',no_wa:'',email:'',tanggal:'',jam:'',jumlah_tamu:'',catatan:'' }) }}
      />
    )
  }

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Hero banner */}
      <section className="relative pt-32 md:pt-40 pb-14 overflow-hidden bg-gradient-to-b from-charcoal to-obsidian">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-gilt" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full border border-gilt" />
        </div>
        <div className="relative max-w-xl mx-auto px-5 text-center">
          <p className="font-body text-xs tracking-[0.3em] text-ember-light uppercase mb-3">
            Reservasi Online
          </p>
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-bone">
            Amankan Meja Anda
          </h1>
          <p className="font-body text-stone text-sm md:text-base mt-4 max-w-md mx-auto leading-relaxed">
            Isi form di bawah — tim kami akan konfirmasi via WhatsApp
            setelah menerima reservasi Anda.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-5 font-body text-xs text-stone/80">
            <span className="flex items-center gap-1.5">
              <Clock size={13} />{siteConfig.hours.display} · {siteConfig.hours.note}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={13} />{siteConfig.contact.whatsappDisplay}
            </span>
          </div>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-xl mx-auto px-5 md:px-8 pb-20">
        {/* Fallback WA warning */}
        {error === 'fallback_wa' && fallbackUrl && (
          <div className="mb-6 rounded-xl bg-gilt/10 border border-gilt/30 p-4 text-sm">
            <p className="font-semibold text-gilt-soft mb-2 flex items-center gap-2">
              <AlertCircle size={16} /> Sistem sedang dalam pemeliharaan
            </p>
            <p className="text-stone mb-3">
              Reservasi online belum bisa diproses saat ini. Klik tombol di
              bawah untuk lanjut via WhatsApp — data Anda sudah otomatis
              terisi.
            </p>
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gilt text-obsidian px-5 py-2.5 text-sm font-semibold"
            >
              <MessageCircle size={15} />
              Lanjut via WhatsApp
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Nama */}
          <Field label="Nama Lengkap" icon={User} error={fieldErrors.nama}>
            <input
              type="text"
              value={form.nama}
              onChange={set('nama')}
              placeholder="Nama pemesan"
              className={`${inputClass} ${fieldErrors.nama ? 'border-ember/60' : ''}`}
            />
          </Field>

          {/* No WA */}
          <Field label="Nomor WhatsApp" icon={Phone} error={fieldErrors.no_wa}>
            <input
              type="tel"
              value={form.no_wa}
              onChange={set('no_wa')}
              placeholder="0815-xxxx-xxxx"
              className={`${inputClass} ${fieldErrors.no_wa ? 'border-ember/60' : ''}`}
            />
          </Field>

          {/* Email (optional) */}
          <Field label="Email (opsional)" icon={Mail}>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="email@contoh.com"
              className={inputClass}
            />
          </Field>

          {/* Tanggal & Jam */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tanggal" icon={Calendar} error={fieldErrors.tanggal}>
              <input
                type="date"
                value={form.tanggal}
                onChange={set('tanggal')}
                min={MIN_DATE}
                className={`${inputClass} ${fieldErrors.tanggal ? 'border-ember/60' : ''} [color-scheme:dark]`}
              />
            </Field>

            <Field label="Jam" icon={Clock} error={fieldErrors.jam}>
              <select
                value={form.jam}
                onChange={set('jam')}
                className={`${inputClass} ${fieldErrors.jam ? 'border-ember/60' : ''}`}
              >
                <option value="" disabled>Pilih jam</option>
                {JAM_SLOTS.map((s) => (
                  <option key={s} value={s}>{s} WIB</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Jumlah tamu */}
          <Field label="Jumlah Tamu" icon={Users} error={fieldErrors.jumlah_tamu}>
            <div className="flex flex-wrap gap-2">
              {JUMLAH_OPTIONS.map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => {
                    setForm((p) => ({ ...p, jumlah_tamu: n }))
                    setFieldErrors((p) => ({ ...p, jumlah_tamu: undefined }))
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    form.jumlah_tamu === n
                      ? 'bg-gilt text-obsidian'
                      : 'bg-charcoal border border-white/10 text-stone hover:border-gilt/40 hover:text-bone'
                  }`}
                >
                  {n === '10+' ? '10+ orang' : `${n} orang`}
                </button>
              ))}
            </div>
            {fieldErrors.jumlah_tamu && (
              <p className="mt-1.5 text-xs text-ember-light flex items-center gap-1">
                <AlertCircle size={12} /> {fieldErrors.jumlah_tamu}
              </p>
            )}
          </Field>

          {/* Catatan */}
          <Field label="Catatan / Permintaan Khusus (opsional)" icon={MessageSquare}>
            <textarea
              value={form.catatan}
              onChange={set('catatan')}
              rows={3}
              placeholder="Contoh: ulang tahun, alergi makanan, prefer meja indoor/outdoor..."
              className={`${inputClass} resize-none`}
            />
          </Field>

          {/* Info konfirmasi */}
          <div className="rounded-xl bg-white/5 border border-white/5 p-4 text-xs text-stone leading-relaxed">
            <p>
              Setelah submit, tim kami akan menghubungi Anda via WhatsApp di
              nomor yang terdaftar untuk konfirmasi ketersediaan meja.
              Reservasi dianggap sah setelah mendapat konfirmasi dari kami.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ember hover:bg-ember-light disabled:opacity-60 disabled:cursor-wait transition-colors py-3.5 text-base font-semibold text-bone"
          >
            {loading ? 'Mengirim reservasi...' : 'Kirim Reservasi'}
          </button>

          <p className="text-center text-xs text-stone">
            Atau reservasi langsung via{' '}
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gilt-soft underline underline-offset-2 hover:text-gilt"
            >
              WhatsApp {siteConfig.contact.whatsappDisplay}
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

// ── Sub-komponen: layar sukses ───────────────────────────────
function SuccessScreen({ nama, tanggal, jam, jumlah, onReset }) {
  const tgl = tanggal
    ? new Date(tanggal + 'T00:00:00').toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : '-'

  return (
    <div className="bg-obsidian min-h-screen flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-gilt/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} className="text-gilt" />
        </div>
        <h1 className="font-display font-semibold text-3xl text-bone mb-3">
          Reservasi Terkirim!
        </h1>
        <p className="font-body text-stone text-sm mb-6 leading-relaxed">
          Halo <span className="text-bone font-medium">{nama}</span>, reservasi
          Anda sudah kami terima. Tim kami akan konfirmasi via WhatsApp
          secepatnya.
        </p>

        <div className="rounded-2xl bg-charcoal border border-white/5 p-5 text-left space-y-3 mb-8">
          <Row label="Tanggal" value={tgl} />
          <Row label="Jam" value={`${jam} WIB`} />
          <Row label="Jumlah Tamu" value={`${jumlah} orang`} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 hover:border-gilt/40 px-6 py-3 text-sm text-stone hover:text-bone transition-colors"
          >
            <ArrowLeft size={15} />
            Reservasi Lagi
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gilt hover:bg-gilt-soft transition-colors px-6 py-3 text-sm font-semibold text-obsidian"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-stone">{label}</span>
      <span className="text-bone font-medium">{value}</span>
    </div>
  )
}
