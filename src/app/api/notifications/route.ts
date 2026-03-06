import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  const auth = getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const notifications = await prisma.notification.findMany({ where: { userId: auth.userId }, orderBy: { createdAt: 'desc' }, take: 50 })
  const unreadCount = notifications.filter(n => n.status === 'unread').length
  return NextResponse.json({ notifications, unreadCount })
}

export async function PUT() {
  const auth = getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.notification.updateMany({ where: { userId: auth.userId, status: 'unread' }, data: { status: 'read' } })
  return NextResponse.json({ message: 'Semua dibaca' })
}
