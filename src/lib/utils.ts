export const fmtIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

export const fmtShort = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`
  return String(n)
}

export const fmtDate = (d: string | Date) =>
  new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })

export const CATEGORIES = [
  'Pakaian', 'Makanan', 'Zakat', 'Hadiah Lebaran',
  'Transportasi', 'Dekorasi', 'Elektronik', 'Lainnya',
]

export const CAT_COLORS: Record<string, string> = {
  Pakaian: '#f59e0b', Makanan: '#10b981', Zakat: '#3b82f6',
  'Hadiah Lebaran': '#f43f5e', Transportasi: '#8b5cf6',
  Dekorasi: '#06b6d4', Elektronik: '#84cc16', Lainnya: '#6b7280', THR: '#f59e0b',
}
