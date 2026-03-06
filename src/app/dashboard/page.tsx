'use client'
import { useEffect, useState } from 'react'
import { Bar, Pie, Line } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js'
import { fmtIDR, fmtShort, fmtDate, CAT_COLORS } from '@/lib/utils'
import Link from 'next/link'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement)

const ttStyle = { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }
const axisStyle = { ticks: { color: '#64748b' as const, font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' as const } }

function StatCard({ icon, label, value, sub, color = '#f59e0b' }: any) {
  return (
    <div className="card flex-1" style={{ minWidth: '150px', borderColor: color + '33' }}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{label}</div>
      <div className="text-xl font-bold" style={{ color, fontFamily: 'Georgia,serif' }}>{fmtShort(value)}</div>
      <div className="text-xs text-slate-600 mt-0.5">{fmtIDR(value)}</div>
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reports').then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center py-32 text-slate-400">Memuat data...</div>
  if (!data) return <div className="text-center py-20 text-slate-500">Gagal memuat</div>

  const { summary, byCategory, byDate, transactions } = data
  const recent = [...(transactions || [])].sort((a: any, b: any) => b.date.localeCompare(a.date)).slice(0, 6)

  const pieLabels = Object.keys(byCategory || {})
  const pieValues = pieLabels.map((k: string) => byCategory[k])
  const pieColors = pieLabels.map((k: string) => CAT_COLORS[k] || '#6b7280')

  const dateLabels = Object.keys(byDate || {}).sort()
  const dateValues = dateLabels.map((d: string) => byDate[d])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100" style={{ fontFamily: 'Georgia,serif' }}>Dashboard THR 🎉</h1>
        <p className="text-slate-500 text-sm mt-1">Selamat Hari Raya! Kelola keuangan Anda dengan bijak.</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <StatCard icon="💰" label="Total THR" value={summary.totalIncome} color="#f59e0b" />
        <StatCard icon="💸" label="Pengeluaran" value={summary.totalExpense} color="#f43f5e" />
        <StatCard icon="🏦" label="Tabungan" value={summary.savings} color="#10b981" />
        <StatCard icon="🕌" label="Total Zakat" value={summary.zakatTotal} color="#3b82f6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="card">
          <h3 className="text-sm font-bold text-slate-200 mb-4">Distribusi Pengeluaran</h3>
          {pieLabels.length > 0
            ? <Pie data={{ labels: pieLabels, datasets: [{ data: pieValues, backgroundColor: pieColors, borderWidth: 0 }] }}
                options={{ responsive: true, plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } }, tooltip: ttStyle } }} />
            : <div className="text-slate-500 text-sm text-center py-12">Belum ada pengeluaran</div>
          }
        </div>
        <div className="card">
          <h3 className="text-sm font-bold text-slate-200 mb-4">Tren Pengeluaran</h3>
          {dateLabels.length > 0
            ? <Line data={{ labels: dateLabels, datasets: [{ label: 'Pengeluaran', data: dateValues, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', tension: 0.4, fill: true }] }}
                options={{ responsive: true, plugins: { legend: { labels: { color: '#94a3b8' as const } }, tooltip: ttStyle }, scales: { x: axisStyle, y: { ...axisStyle, ticks: { ...axisStyle.ticks, callback: (v: any) => fmtShort(v) } } } }} />
            : <div className="text-slate-500 text-sm text-center py-12">Belum ada data</div>
          }
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-200">Transaksi Terbaru</h3>
          <Link href="/dashboard/transactions" className="text-xs text-amber-500 hover:underline">Lihat semua →</Link>
        </div>
        {recent.length === 0
          ? <div className="text-slate-500 text-sm text-center py-8">Belum ada transaksi. <Link href="/dashboard/transactions" className="text-amber-500 underline">Tambah sekarang</Link></div>
          : recent.map((t: any) => (
            <div key={t.id} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: t.type === 'income' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)' }}>
                  {t.type === 'income' ? '💰' : '💸'}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200">{t.description}</div>
                  <div className="text-xs text-slate-500">{t.category} · {fmtDate(t.date)}</div>
                </div>
              </div>
              <div className="font-bold text-sm" style={{ color: t.type === 'income' ? '#10b981' : '#f43f5e' }}>
                {t.type === 'income' ? '+' : '-'}{fmtShort(Number(t.amount))}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
