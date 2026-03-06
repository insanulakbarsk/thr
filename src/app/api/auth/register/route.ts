import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    if (password.length < 6) return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { name, email, passwordHash } })

    await prisma.notification.create({
      data: { userId: user.id, message: `Selamat datang ${name}! Mulai catat THR Anda 🎉`, status: 'unread' },
    })

    const token = signToken({ userId: user.id, email: user.email, name: user.name })
    const res = NextResponse.json({ message: 'Registrasi berhasil' })
    res.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 604800 })
    return res
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
