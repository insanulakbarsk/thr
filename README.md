# 🌙 THR Manager — Full Stack Next.js + MySQL

## Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL + Prisma ORM
- **Auth**: JWT (httpOnly cookie) + bcrypt
- **Charts**: Chart.js + react-chartjs-2
- **Email**: NodeMailer

---

## ✅ Prasyarat
- Node.js 18+ → https://nodejs.org
- MySQL 8+ → https://dev.mysql.com/downloads/

---

## 🚀 Instalasi Step-by-Step

### 1. Install dependencies
```bash
npm install
```

### 2. Buat database MySQL
```bash
mysql -u root -p
```
```sql
CREATE DATABASE thr_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 3. Konfigurasi .env
```bash
cp .env.example .env
```
Edit `.env` dan isi:
```
DATABASE_URL="mysql://root:PASSWORD_MYSQL_ANDA@localhost:3306/thr_manager"
JWT_SECRET="random-string-panjang-minimal-32-karakter"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="email@gmail.com"
SMTP_PASS="app-password-gmail"
SMTP_FROM="THR Manager <email@gmail.com>"
```

### 4. Generate Prisma & buat tabel
```bash
npx prisma generate
npx prisma db push
```

### 5. Isi data demo
```bash
npm run db:seed
```

### 6. Jalankan aplikasi
```bash
npm run dev
```

Buka: **http://localhost:3000**
Login demo: `demo@thr.com` / `password123`

---

## 📁 Struktur Proyek
```
thr-manager/
├── prisma/
│   ├── schema.prisma       ← Skema 5 tabel MySQL
│   └── seed.ts             ← Data demo
├── src/
│   ├── app/
│   │   ├── page.tsx                          ← Halaman Login/Register
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── api/
│   │   │   ├── auth/login/route.ts
│   │   │   ├── auth/register/route.ts
│   │   │   ├── auth/logout/route.ts
│   │   │   ├── auth/me/route.ts
│   │   │   ├── transactions/route.ts
│   │   │   ├── transactions/[id]/route.ts
│   │   │   ├── budgets/route.ts
│   │   │   ├── budgets/[id]/route.ts
│   │   │   ├── zakat/route.ts
│   │   │   ├── notifications/route.ts
│   │   │   ├── notifications/[id]/route.ts
│   │   │   └── reports/route.ts
│   │   └── dashboard/
│   │       ├── layout.tsx                    ← Sidebar navigasi
│   │       ├── page.tsx                      ← Dashboard + grafik
│   │       ├── transactions/page.tsx
│   │       ├── budgets/page.tsx
│   │       ├── zakat/page.tsx
│   │       ├── reports/page.tsx
│   │       └── notifications/page.tsx
│   └── lib/
│       ├── prisma.ts       ← Prisma client
│       ├── auth.ts         ← JWT utils
│       ├── mailer.ts       ← NodeMailer
│       └── utils.ts        ← Format helpers
├── .env.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔌 API Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/transactions          ?type=income|expense
POST   /api/transactions
DELETE /api/transactions/:id
PUT    /api/transactions/:id

GET    /api/budgets
POST   /api/budgets
DELETE /api/budgets/:id
PUT    /api/budgets/:id

GET    /api/zakat
POST   /api/zakat

GET    /api/notifications
PUT    /api/notifications          ← tandai semua dibaca
PUT    /api/notifications/:id      ← tandai satu dibaca

GET    /api/reports               ?period=all|month|week
```

---

## 🛠 Perintah Lain
```bash
npm run db:studio    # Buka GUI database Prisma Studio
npm run build        # Build production
npm run start        # Jalankan production
```

## Selamat Hari Raya! 🌙🎉
