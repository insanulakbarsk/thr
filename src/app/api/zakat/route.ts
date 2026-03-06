import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

const fmtIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

export async function GET() {
  const auth = getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const zakats = await prisma.zakat.findMany({ where: { userId: auth.userId }, orderBy: { date: 'desc' } })
  const total = zakats.reduce((s, z) => s + Number(z.amount), 0)
  return NextResponse.json({ zakats, total })
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { type, amount, jiwa } = await req.json()
    if (!type || !amount) return NextResponse.json({ error: 'Wajib diisi' }, { status: 400 })
    if (!['fitrah', 'maal'].includes(type)) return NextResponse.json({ error: 'Tipe tidak valid' }, { status: 400 })

    const zakat = await prisma.zakat.create({
      data: { userId: auth.userId, type, amount: Number(amount), jiwa: jiwa ? Number(jiwa) : null, status: 'paid', date: new Date() },
    })
    await prisma.transaction.create({
      data: { userId: auth.userId, amount: Number(amount), category: 'Zakat', type: 'expense', description: `Zakat ${type === 'fitrah' ? 'Fitrah' : 'Maal'}`, date: new Date() },
    })
    await prisma.notification.create({
      data: { userId: auth.userId, message: `Zakat ${type === 'fitrah' ? 'Fitrah' : 'Maal'} ${fmtIDR(Number(amount))} berhasil dicatat.`, status: 'unread' },
    })
    return NextResponse.json(zakat, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
