import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const budget = await prisma.budget.findFirst({ where: { id: Number(params.id), userId: auth.userId } })
  if (!budget) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 })
  await prisma.budget.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ message: 'Dihapus' })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { budget_amount } = await req.json()
  const updated = await prisma.budget.update({ where: { id: Number(params.id) }, data: { budgetAmount: Number(budget_amount) } })
  return NextResponse.json(updated)
}
