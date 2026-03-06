'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { fmtIDR, fmtDate } from '@/lib/utils'

const FITRAH_PER_JIWA = 45000

export default function ZakatPage() {
  const [zakats, setZakats] = useState<any[]>([])
  const [totalZakat, setTotalZakat] = useState(0)
  const [totalTHR, setTotalTHR] = useState(0)
  const [jiwa, setJiwa] = useState(4)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null)

  const load = () => {
    Promise.all([fetch('/api/zakat').then(r => r.json()), fetch('/api/transactions?type=income').then(r => r.json())])
      .then(([z, tx]) => {
        setZakats(z.zakats || [])
        setTotalZakat(z.total || 0)
        setTotalTHR((tx || []).reduce((s: number, t: any) => s + Number(t.amount), 0))
        setLoading(false)
      })
  }
  useEffect(load, [])

  const bayar = async (type: 'fitrah' | 'maal', amount: number) => {
    setSubmitting(type)
    try {
      const res = await fetch('/api/zakat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, amount, jiwa: type === 'fitrah' ? jiwa : undefined }) })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success(`Zakat ${type === 'fitrah' ? 'Fitrah' : 'Maal'} berhasil dicatat!`)
      load()
    } catch (err: any) { toast.error(err.message) } finally { setSubmitting(null) }
  }

  const zakatFitrah = FITRAH_PER_JIWA * jiwa
  const zakatMaal = totalTHR * 0.025
  const fitrahLunas = totalZakat >= zakatFitrah

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-100 mb-2" style={{ fontFamily: 'Georgia,serif' }}>Pengelolaan Zakat 🕌</h1>
      <p className="text-slate-500 text-sm mb-6">Tunaikan zakat tepat waktu sebelum sholat Idul Fitri</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="card" style={{ borderColor: 'rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.05)' }}>
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4">🕌 Zakat Fitrah</div>
          <div className="mb-4">
            <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Jumlah Jiwa</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setJiwa(Math.max(1, jiwa - 1))} className="w-9 h-9 rounded-lg font-bold text-blue-400 hover:bg-blue-400/20 transition-all"
                style={{ border: '1px solid rgba(59,130,246,0.3)', background: 'transparent', cursor: 'pointer', fontSize: '18px' }}>-</button>
              <span className="text-3xl font-bold text-slate-100 w-10 text-center">{jiwa}</span>
              <button onClick={() => setJiwa(jiwa + 1)} className="w-9 h-9 rounded-lg font-bold text-blue-400 hover:bg-blue-400/20 transition-all"
                style={{ border: '1px solid rgba(59,130,246,0.3)', background: 'transparent', cursor: 'pointer', fontSize: '18px' }}>+</button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-1">Estimasi Zakat Fitrah</p>
          <p className="text-3xl font-bold mb-1" style={{ color: '#3b82f6', fontFamily: 'Georgia,serif' }}>{fmtIDR(zakatFitrah)}</p>
          <p className="text-xs text-slate-500 mb-5">{fmtIDR(FITRAH_PER_JIWA)} × {jiwa} jiwa (estimasi beras 2.5kg)</p>
          <button onClick={() => bayar('fitrah', zakatFitrah)} disabled={submitting === 'fitrah'}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'rgba(59,130,246,0.2)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', cursor: 'pointer', opacity: submitting === 'fitrah' ? 0.7 : 1 }}>
            {submitting === 'fitrah' ? 'Memproses...' : 'Catat Pembayaran Zakat Fitrah'}
          </button>
        </div>

        <div className="card" style={{ borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)' }}>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">💰 Zakat Maal (2.5% THR)</div>
          <p className="text-xs text-slate-400 mb-1">Total THR Diterima</p>
          <p className="text-base font-semibold text-slate-200 mb-3">{fmtIDR(totalTHR)}</p>
          <p className="text-xs text-slate-400 mb-1">Zakat Maal (2.5%)</p>
          <p className="text-3xl font-bold mb-1" style={{ color: '#f59e0b', fontFamily: 'Georgia,serif' }}>{fmtIDR(zakatMaal)}</p>
          <p className="text-xs text-slate-500 mb-5">Wajib jika THR melebihi nisab ±Rp10 juta</p>
          <button onClick={() => bayar('maal', zakatMaal)} disabled={submitting === 'maal' || zakatMaal === 0}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', cursor: 'pointer', opacity: zakatMaal === 0 || submitting === 'maal' ? 0.5 : 1 }}>
            {submitting === 'maal' ? 'Memproses...' : 'Catat Pembayaran Zakat Maal'}
          </button>
        </div>
      </div>

      <div className="card mb-6 flex items-center justify-between" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
        <div>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Total Zakat Dibayar</p>
          <p className="text-3xl font-bold text-slate-100" style={{ fontFamily: 'Georgia,serif' }}>{fmtIDR(totalZakat)}</p>
        </div>
        {fitrahLunas
          ? <span className="px-4 py-2 rounded-xl text-sm font-bold" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>✓ Zakat Fitrah Lunas</span>
          : <span className="px-4 py-2 rounded-xl text-sm font-bold" style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e' }}>⚠ Belum Lunas</span>
        }
      </div>

      {!loading && zakats.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-bold text-slate-200 mb-4">Riwayat Pembayaran Zakat</h3>
          {zakats.map((z: any) => (
            <div key={z.id} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div>
                <p className="text-sm font-medium text-slate-200">Zakat {z.type === 'fitrah' ? 'Fitrah' : 'Maal'}{z.jiwa ? ` (${z.jiwa} jiwa)` : ''}</p>
                <p className="text-xs text-slate-500">{fmtDate(z.date)}</p>
              </div>
              <p className="text-sm font-bold text-blue-400">{fmtIDR(Number(z.amount))}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
