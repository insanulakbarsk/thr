'use client'
import { useEffect, useState } from 'react'
import { Bar, Pie, Line } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js'
import { fmtIDR, fmtShort, CAT_COLORS } from '@/lib/utils'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement)
const tt = { backgroundColor: '#1e293b' as const, titleColor: '#f1f5f9' as const, bodyColor: '#94a3b8' as const, borderColor: 'rgba(255,255,255,0.1)' as const, borderWidth: 1 }
const ax = { ticks: { color: '#64748b' as const, font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' as const } }

export default function ReportsPage() {
  const [data, setData] = useState<any>(null)
  const [period, setPeriod] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => { setLoading(true); fetch(`/api/reports?period=${period}`).then(r => r.json()).then(d => { setData(d); setLoading(false) }) }, [period])

  if (loading) return <div className="text-slate-400 text-center py-20">Memuat laporan...</div>
  if (!data) return null
  const { summary, byCategory, byDate, budgets } = data
  const pLabels = Object.keys(byCategory || {})
  const pVals = pLabels.map(k => byCategory[k])
  const pColors = pLabels.map(k => CAT_COLORS[k] || '#6b7280')
  const dLabels = Object.keys(byDate || {}).sort()
  const dVals = dLabels.map(d => byDate[d])

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-slate-100" style={{ fontFamily: 'Georgia,serif' }}>Laporan Keuangan THR</h1>
        <div className="flex gap-2">
          {[['all','Semua'],['month','Bulan Ini'],['week','Minggu Ini']].map(([v,l]) => (
            <button key={v} onClick={() => setPeriod(v)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              style={{ background: period === v ? '#f59e0b' : 'rgba(255,255,255,0.06)', color: period === v ? '#0f172a' : '#64748b', border: 'none' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[['📥','Pemasukan',summary.totalIncome,'#10b981'],['📤','Pengeluaran',summary.totalExpense,'#f43f5e'],['🏦','Tabungan',summary.savings,'#f59e0b'],['🕌','Zakat',summary.zakatTotal,'#3b82f6']].map(([icon,lbl,val,clr],i) => (
          <div key={i} className="card" style={{ borderColor: (clr as string) + '33' }}>
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{lbl}</div>
            <div className="text-lg font-bold" style={{ color: clr as string, fontFamily: 'Georgia,serif' }}>{fmtShort(val as number)}</div>
            <div className="text-xs text-slate-600 mt-0.5">{fmtIDR(val as number)}</div>
          </div>
        ))}
      </div>

      <div className="card mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">THR Terpakai</span>
          <span className="text-sm font-bold" style={{ color: '#f59e0b' }}>{summary.percentUsed}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${Math.min(Number(summary.percentUsed),100)}%`, background: Number(summary.percentUsed) >= 90 ? '#f43f5e' : Number(summary.percentUsed) >= 70 ? '#f59e0b' : '#10b981' }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500"><span>Rp0</span><span>{fmtIDR(summary.totalIncome)}</span></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="card">
          <h3 className="text-sm font-bold text-slate-200 mb-4">Distribusi per Kategori</h3>
          {pLabels.length > 0
            ? <Pie data={{ labels: pLabels, datasets: [{ data: pVals, backgroundColor: pColors, borderWidth: 0 }] }} options={{ responsive: true, plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } }, tooltip: tt } }} />
            : <div className="text-slate-500 text-sm text-center py-10">Belum ada data</div>}
        </div>
        <div className="card">
          <h3 className="text-sm font-bold text-slate-200 mb-4">Pengeluaran Harian</h3>
          {dLabels.length > 0
            ? <Line data={{ labels: dLabels, datasets: [{ label: 'Pengeluaran', data: dVals, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', tension: 0.4, fill: true }] }}
                options={{ responsive: true, plugins: { legend: { labels: { color: '#94a3b8' as const } }, tooltip: tt }, scales: { x: ax, y: { ...ax, ticks: { ...ax.ticks, callback: (v: any) => fmtShort(v) } } } }} />
            : <div className="text-slate-500 text-sm text-center py-10">Belum ada data</div>}
        </div>
      </div>

      {budgets.length > 0 && (
        <div className="card overflow-hidden p-0">
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-sm font-bold text-slate-200">Anggaran vs Realisasi</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Kategori','Anggaran','Terpakai','Sisa','%'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {budgets.map((b: any) => {
                  const pct = b.budgetAmount > 0 ? (Number(b.allocatedAmount) / Number(b.budgetAmount)) * 100 : 0
                  const clr = pct >= 90 ? '#f43f5e' : pct >= 70 ? '#f59e0b' : '#10b981'
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td className="px-5 py-3 text-sm font-medium text-slate-200">{b.category}</td>
                      <td className="px-5 py-3 text-sm text-slate-300">{fmtIDR(Number(b.budgetAmount))}</td>
                      <td className="px-5 py-3 text-sm text-slate-300">{fmtIDR(Number(b.allocatedAmount))}</td>
                      <td className="px-5 py-3 text-sm text-slate-300">{fmtIDR(Math.max(Number(b.budgetAmount)-Number(b.allocatedAmount),0))}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="progress-track w-16"><div className="progress-bar" style={{ width: `${Math.min(pct,100)}%`, background: clr }} /></div>
                          <span className="text-xs font-bold" style={{ color: clr }}>{pct.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
