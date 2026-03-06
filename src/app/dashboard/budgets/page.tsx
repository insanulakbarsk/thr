'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { fmtIDR, CATEGORIES } from '@/lib/utils'

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('Pakaian')
  const [amount, setAmount] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => { setLoading(true); fetch('/api/budgets').then(r => r.json()).then(d => { setBudgets(d); setLoading(false) }) }
  useEffect(load, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (Number(amount) <= 0) return toast.error('Jumlah harus lebih dari 0')
    setSaving(true)
    try {
      const res = await fetch('/api/budgets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category, budget_amount: Number(amount) }) })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success('Anggaran tersimpan!'); setAmount(''); load()
    } catch (err: any) { toast.error(err.message) } finally { setSaving(false) }
  }

  const del = async (id: number) => {
    if (!confirm('Hapus anggaran ini?')) return
    await fetch(`/api/budgets/${id}`, { method: 'DELETE' })
    toast.success('Dihapus'); load()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-100 mb-6" style={{ fontFamily: 'Georgia,serif' }}>Pengelolaan Anggaran</h1>

      <div className="card mb-6" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
        <h2 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-5">+ Set Anggaran</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Kategori</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="input-dark">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Limit Anggaran (Rp)</label>
              <input type="number" min="1" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="1000000" className="input-dark" />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-10">Memuat...</div>
      ) : budgets.length === 0 ? (
        <div className="text-slate-500 text-center py-16">
          <div className="text-4xl mb-3">🎯</div>
          <p>Belum ada anggaran. Tambahkan di atas.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {budgets.map((b: any) => {
            const pct = b.budgetAmount > 0 ? Math.min((Number(b.allocatedAmount) / Number(b.budgetAmount)) * 100, 100) : 0
            const color = pct >= 90 ? '#f43f5e' : pct >= 70 ? '#f59e0b' : '#10b981'
            return (
              <div key={b.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-bold text-slate-100">{b.category}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{fmtIDR(Number(b.allocatedAmount))} dari {fmtIDR(Number(b.budgetAmount))}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xl font-bold" style={{ color, fontFamily: 'Georgia,serif' }}>{pct.toFixed(0)}%</div>
                    <button onClick={() => del(b.id)} className="text-slate-600 hover:text-red-400 transition-colors text-lg" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑</button>
                  </div>
                </div>
                <div className="progress-track mb-2">
                  <div className="progress-bar" style={{ width: `${pct}%`, background: color }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Sisa: <span className="text-slate-300 font-medium">{fmtIDR(Math.max(Number(b.budgetAmount) - Number(b.allocatedAmount), 0))}</span></span>
                  {pct >= 90 && <span className="font-semibold" style={{ color: '#f43f5e' }}>⚠ Hampir Habis!</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
