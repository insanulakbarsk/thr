import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const tx = await prisma.transaction.findFirst({ where: { id: Number(params.id), userId: auth.userId } })
  if (!tx) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 })
  if (tx.type === 'expense') {
    await prisma.budget.updateMany({
      where: { userId: auth.userId, category: tx.category },
      data: { allocatedAmount: { decrement: Number(tx.amount) } },
    })
  }
  await prisma.transaction.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ message: 'Dihapus' })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const updated = await prisma.transaction.update({
    where: { id: Number(params.id) },
    data: {
      amount: body.amount ? Number(body.amount) : undefined,
      category: body.category,
      description: body.description,
      date: body.date ? new Date(body.date) : undefined,
    },
  })
  return NextResponse.json(updated)
}
