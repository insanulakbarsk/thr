'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { fmtDate } from '@/lib/utils'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetch('/api/notifications').then(r => r.json()).then(d => {
      setNotifications(d.notifications || [])
      setUnreadCount(d.unreadCount || 0)
      setLoading(false)
    })
  }
  useEffect(load, [])

  const markOne = async (id: number) => {
    await fetch(`/api/notifications/${id}`, { method: 'PUT' })
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read' } : n))
    setUnreadCount(prev => Math.max(prev - 1, 0))
  }

  const markAll = async () => {
    await fetch('/api/notifications', { method: 'PUT' })
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })))
    setUnreadCount(0)
    toast.success('Semua ditandai dibaca')
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100" style={{ fontFamily: 'Georgia,serif' }}>Notifikasi & Pengingat</h1>
          <p className="text-slate-500 text-sm mt-1">{unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua telah dibaca'}</p>
        </div>
        {unreadCount > 0 && <button onClick={markAll} className="btn-primary text-sm">Tandai Semua Dibaca</button>}
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-10">Memuat...</div>
      ) : notifications.length === 0 ? (
        <div className="text-slate-500 text-center py-16"><div className="text-5xl mb-3">🔔</div><p>Belum ada notifikasi</p></div>
      ) : (
        <div className="space-y-3 mb-8">
          {notifications.map(n => (
            <div key={n.id} className="card flex items-start justify-between gap-4"
              style={{ borderColor: n.status === 'unread' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)', background: n.status === 'unread' ? 'rgba(245,158,11,0.05)' : 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-start gap-3 flex-1">
                <div className="text-2xl flex-shrink-0 mt-0.5">{n.status === 'unread' ? '🔔' : '✅'}</div>
                <div>
                  <p className={`text-sm ${n.status === 'unread' ? 'font-semibold text-slate-100' : 'text-slate-400'}`}>{n.message}</p>
                  <p className="text-xs text-slate-600 mt-1">{fmtDate(n.createdAt)}</p>
                </div>
              </div>
              {n.status === 'unread' && (
                <button onClick={() => markOne(n.id)} className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'none' }}>
                  Baca
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h3 className="text-sm font-bold text-slate-200 mb-3">📧 Konfigurasi Email Otomatis (NodeMailer)</h3>
        <p className="text-slate-500 text-xs leading-relaxed mb-4">Notifikasi email otomatis tersedia untuk:</p>
        <div className="space-y-2 mb-4">
          {['7 hari sebelum Idul Fitri → Pengingat Zakat Fitrah','Anggaran ≥ 80% → Peringatan Limit Anggaran','Setiap Senin pagi → Ringkasan Pengeluaran Mingguan'].map((s,i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-400"><span className="text-emerald-400">✓</span>{s}</div>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {['NodeMailer Aktif','Jadwal Ramadan Aktif'].map((s,i) => (
            <span key={i} className="text-xs px-3 py-1.5 rounded-lg font-semibold"
              style={{ background: i===0?'rgba(16,185,129,0.1)':'rgba(59,130,246,0.1)', color: i===0?'#10b981':'#3b82f6', border: `1px solid ${i===0?'rgba(16,185,129,0.2)':'rgba(59,130,246,0.2)'}` }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
