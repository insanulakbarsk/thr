import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function PUT(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const updated = await prisma.notification.update({ where: { id: Number(params.id) }, data: { status: 'read' } })
  return NextResponse.json(updated)
}
