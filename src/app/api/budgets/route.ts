import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  const auth = getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const budgets = await prisma.budget.findMany({ where: { userId: auth.userId }, orderBy: { category: 'asc' } })
  return NextResponse.json(budgets)
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { category, budget_amount } = await req.json()
    if (!category || !budget_amount) return NextResponse.json({ error: 'Wajib diisi' }, { status: 400 })
    const existing = await prisma.budget.findFirst({ where: { userId: auth.userId, category } })
    let budget
    if (existing) {
      budget = await prisma.budget.update({ where: { id: existing.id }, data: { budgetAmount: Number(budget_amount) } })
    } else {
      budget = await prisma.budget.create({ data: { userId: auth.userId, category, budgetAmount: Number(budget_amount), allocatedAmount: 0 } })
    }
    return NextResponse.json(budget, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
