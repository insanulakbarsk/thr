'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/transactions', label: 'Transaksi', icon: '💸' },
  { href: '/dashboard/budgets', label: 'Anggaran', icon: '🎯' },
  { href: '/dashboard/zakat', label: 'Zakat', icon: '🕌' },
  { href: '/dashboard/reports', label: 'Laporan', icon: '📈' },
  { href: '/dashboard/notifications', label: 'Notifikasi', icon: '🔔' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [unread, setUnread] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(setUser)
      .catch(() => router.push('/'))
    fetch('/api/notifications')
      .then(r => r.json())
      .then(d => setUnread(d.unreadCount || 0))
      .catch(() => {})
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Sampai jumpa!')
    router.push('/')
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#0f172a' }}>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen z-30 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ width: '230px', flexShrink: 0, background: '#0a1120', borderRight: '1px solid rgba(245,158,11,0.12)' }}>
        
        <div className="p-6 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-4xl mb-1">🌙</div>
          <div className="font-bold text-lg" style={{ color: '#f59e0b', fontFamily: 'Georgia, serif' }}>THR Manager</div>
          <div className="text-xs text-slate-500 mt-0.5">Kelola THR Lebaran Anda</div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`nav-item ${isActive ? 'active' : ''}`}>
                <span className="text-lg w-6">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.label === 'Notifikasi' && unread > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold min-w-[20px] text-center">
                    {unread}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {user && (
          <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#0f172a' }}>
                {user.name[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-100 truncate">{user.name}</div>
                <div className="text-xs text-slate-500 truncate">{user.email}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full py-2 rounded-lg text-xs text-slate-500 hover:text-slate-300 transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', cursor: 'pointer' }}>
              Keluar
            </button>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-10"
          style={{ background: '#0a1120', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setSidebarOpen(true)} className="text-2xl text-slate-400 p-1" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>☰</button>
          <span style={{ color: '#f59e0b', fontFamily: 'Georgia,serif', fontWeight: 700 }}>THR Manager</span>
          <span className="text-2xl">🌙</span>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
