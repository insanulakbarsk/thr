'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { fmtIDR, fmtDate, CATEGORIES } from '@/lib/utils'

const todayStr = () => new Date().toISOString().slice(0, 10)
const LBL = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ type: 'expense', amount: '', category: 'Pakaian', description: '', date: todayStr() })
  const [saving, setSaving] = useState(false)

  const load = () => { setLoading(true); fetch('/api/transactions').then(r => r.json()).then(d => { setTransactions(d); setLoading(false) }) }
  useEffect(load, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (Number(form.amount) <= 0) return toast.error('Jumlah harus lebih dari 0')
    setSaving(true)
    try {
      const res = await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success('Transaksi tersimpan!')
      setForm({ type: 'expense', amount: '', category: 'Pakaian', description: '', date: todayStr() })
      load()
    } catch (err: any) { toast.error(err.message) } finally { setSaving(false) }
  }

  const del = async (id: number) => {
    if (!confirm('Hapus transaksi ini?')) return
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    toast.success('Dihapus'); load()
  }

  const filtered = transactions.filter(t => filter === 'all' ? true : t.type === filter)

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-100 mb-6" style={{ fontFamily: 'Georgia,serif' }}>Transaksi THR</h1>

      <div className="card mb-6" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
        <h2 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-5">+ Tambah Transaksi</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={LBL}>Tipe</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value, category: e.target.value === 'income' ? 'THR' : 'Pakaian' })} className="input-dark">
                <option value="income">Pemasukan (THR)</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>
            <div>
              <label className={LBL}>Kategori</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-dark">
                {form.type === 'income' ? <option value="THR">THR</option> : CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={LBL}>Jumlah (Rp)</label>
              <input type="number" min="1" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" className="input-dark" />
            </div>
            <div>
              <label className={LBL}>Tanggal</label>
              <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-dark" />
            </div>
            <div className="sm:col-span-2">
              <label className={LBL}>Deskripsi</label>
              <input required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Keterangan transaksi..." className="input-dark" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary mt-5">{saving ? 'Menyimpan...' : 'Simpan Transaksi'}</button>
        </form>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {[['all','Semua'],['income','Pemasukan'],['expense','Pengeluaran']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} className="px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
            style={{ background: filter === v ? '#f59e0b' : 'rgba(255,255,255,0.06)', color: filter === v ? '#0f172a' : '#64748b', border: 'none' }}>
            {l}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500 self-center">{filtered.length} transaksi</span>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Deskripsi','Kategori','Tipe','Tanggal','Jumlah',''].map((h, i) => (
                  <th key={i} className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500">Memuat...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500">Belum ada transaksi</td></tr>
              ) : filtered.map((t: any) => (
                <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-slate-200">{t.description}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-md font-semibold" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>{t.category}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-md font-semibold"
                      style={{ background: t.type === 'income' ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)', color: t.type === 'income' ? '#10b981' : '#f43f5e' }}>
                      {t.type === 'income' ? 'Masuk' : 'Keluar'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-400 whitespace-nowrap">{fmtDate(t.date)}</td>
                  <td className="px-5 py-3 font-bold text-sm whitespace-nowrap" style={{ color: t.type === 'income' ? '#10b981' : '#f43f5e' }}>
                    {t.type === 'income' ? '+' : '-'}{fmtIDR(Number(t.amount))}
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => del(t.id)} className="text-slate-600 hover:text-red-400 transition-colors text-lg" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
