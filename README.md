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