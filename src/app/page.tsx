'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function HomePage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: 'demo@thr.com', password: 'password123' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(mode === 'login' ? '/api/auth/login' : '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan')
      toast.success(mode === 'login' ? 'Selamat datang!' : 'Akun berhasil dibuat!')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width: `${i*180}px`, height: `${i*180}px`, top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)', border: '1px solid rgba(245,158,11,0.1)' }} />
      ))}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-3xl p-10"
        style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌙</div>
          <h1 className="text-3xl font-bold" style={{ color: '#f59e0b', fontFamily: 'Georgia, serif' }}>THR Manager</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola THR Hari Raya Anda dengan cerdas</p>
        </div>
        <div className="flex gap-2 mb-7 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: mode === m ? '#f59e0b' : 'transparent', color: mode === m ? '#0f172a' : '#64748b' }}>
              {m === 'login' ? 'Masuk' : 'Daftar'}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Ahmad Rizki" className="input-dark" />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com" className="input-dark" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" required minLength={6} value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="input-dark" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2" style={{ padding: '14px' }}>
            {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Buat Akun'}
          </button>
        </form>
        <p className="text-center text-slate-600 text-xs mt-5">
          Demo: <code className="text-slate-400">demo@thr.com</code> / <code className="text-slate-400">password123</code>
        </p>
      </div>
    </div>
  )
}
