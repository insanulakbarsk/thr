import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period') || 'all'

  let dateFilter: any = {}
  const now = new Date()
  if (period === 'week') dateFilter = { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
  else if (period === 'month') dateFilter = { gte: new Date(now.getFullYear(), now.getMonth(), 1) }

  const where: any = { userId: auth.userId }
  if (Object.keys(dateFilter).length) where.date = dateFilter

  const transactions = await prisma.transaction.findMany({ where, orderBy: { date: 'asc' } })
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)

  const byCategory: Record<string, number> = {}
  transactions.filter(t => t.type === 'expense').forEach(t => {
    byCategory[t.category] = (byCategory[t.category] || 0) + Number(t.amount)
  })

  const byDate: Record<string, number> = {}
  transactions.filter(t => t.type === 'expense').forEach(t => {
    const d = new Date(t.date).toISOString().slice(0, 10)
    byDate[d] = (byDate[d] || 0) + Number(t.amount)
  })

  const budgets = await prisma.budget.findMany({ where: { userId: auth.userId } })
  const zakats = await prisma.zakat.findMany({ where: { userId: auth.userId } })

  return NextResponse.json({
    summary: {
      totalIncome, totalExpense, savings: totalIncome - totalExpense,
      percentUsed: totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : '0',
      zakatTotal: zakats.reduce((s, z) => s + Number(z.amount), 0),
    },
    byCategory, byDate, budgets, transactions,
  })
}
