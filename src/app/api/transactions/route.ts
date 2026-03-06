import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const where: any = { userId: auth.userId }
  if (type) where.type = type
  const transactions = await prisma.transaction.findMany({ where, orderBy: { date: 'desc' } })
  return NextResponse.json(transactions)
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { amount, category, type, description, date } = await req.json()
    if (!amount || !category || !type || !description || !date)
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    if (!['income', 'expense'].includes(type))
      return NextResponse.json({ error: 'Tipe tidak valid' }, { status: 400 })

    const tx = await prisma.transaction.create({
      data: { userId: auth.userId, amount: Number(amount), category, type, description, date: new Date(date) },
    })

    if (type === 'expense') {
      await prisma.budget.updateMany({
        where: { userId: auth.userId, category },
        data: { allocatedAmount: { increment: Number(amount) } },
      })
      const budget = await prisma.budget.findFirst({ where: { userId: auth.userId, category } })
      if (budget) {
        const pct = (Number(budget.allocatedAmount) / Number(budget.budgetAmount)) * 100
        if (pct >= 80) {
          await prisma.notification.create({
            data: { userId: auth.userId, message: `Anggaran ${category} sudah terpakai ${pct.toFixed(0)}%!`, status: 'unread' },
          })
        }
      }
    }
    return NextResponse.json(tx, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
