import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'insanulakbar@thr.com' },
    update: {},
    create: { name: 'Insanul Akbar', email: 'insanulakbar@thr.com', passwordHash },
  })

  await prisma.transaction.createMany({
    skipDuplicates: true,
    data: [
      { userId: user.id, amount: 8500000, category: 'THR', type: 'income', description: 'THR dari Perusahaan', date: new Date('2025-03-10') },
      { userId: user.id, amount: 650000, category: 'Pakaian', type: 'expense', description: 'Baju Koko & Gamis', date: new Date('2025-03-12') },
      { userId: user.id, amount: 300000, category: 'Makanan', type: 'expense', description: 'Kue Lebaran', date: new Date('2025-03-13') },
      { userId: user.id, amount: 425000, category: 'Zakat', type: 'expense', description: 'Zakat Fitrah Keluarga', date: new Date('2025-03-14') },
      { userId: user.id, amount: 500000, category: 'Hadiah Lebaran', type: 'expense', description: 'Angpao Anak-anak', date: new Date('2025-03-15') },
      { userId: user.id, amount: 250000, category: 'Transportasi', type: 'expense', description: 'Bensin Mudik', date: new Date('2025-03-16') },
    ],
  })

  await prisma.budget.createMany({
    skipDuplicates: true,
    data: [
      { userId: user.id, category: 'Pakaian', budgetAmount: 1000000, allocatedAmount: 650000 },
      { userId: user.id, category: 'Makanan', budgetAmount: 500000, allocatedAmount: 300000 },
      { userId: user.id, category: 'Zakat', budgetAmount: 500000, allocatedAmount: 425000 },
      { userId: user.id, category: 'Hadiah Lebaran', budgetAmount: 1000000, allocatedAmount: 500000 },
      { userId: user.id, category: 'Transportasi', budgetAmount: 500000, allocatedAmount: 250000 },
    ],
  })

  await prisma.notification.createMany({
    data: [
      { userId: user.id, message: 'Jangan lupa bayar Zakat Fitrah sebelum Idul Fitri!', status: 'unread' },
      { userId: user.id, message: 'Anggaran Pakaian sudah terpakai 65%', status: 'unread' },
      { userId: user.id, message: 'THR berhasil dicatat. Selamat Hari Raya!', status: 'read' },
    ],
  })

  console.log('Seed berhasil! Login: insanulakbar@thr.com / password123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
