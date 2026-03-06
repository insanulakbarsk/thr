import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

const fmtIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

export async function sendZakatReminder(to: string, name: string, amount: number) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Pengingat Zakat Fitrah - THR Manager',
    html: `<div style="font-family:sans-serif;max-width:600px;background:#0f172a;color:#f1f5f9;padding:32px;border-radius:16px;">
      <h1 style="color:#f59e0b;">🌙 THR Manager</h1>
      <h2>Pengingat Zakat Fitrah</h2>
      <p>Assalamualaikum <strong>${name}</strong>,</p>
      <p>Jangan lupa tunaikan Zakat Fitrah sebelum sholat Idul Fitri!</p>
      <div style="background:#1e293b;padding:20px;border-radius:12px;margin:20px 0;">
        <p style="margin:0;color:#94a3b8;">Estimasi Zakat Fitrah</p>
        <p style="font-size:28px;color:#f59e0b;margin:8px 0;font-weight:700;">${fmtIDR(amount)}</p>
      </div>
    </div>`,
  })
}

export async function sendBudgetAlert(to: string, name: string, category: string, percentage: number) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Peringatan Anggaran ${category} - THR Manager`,
    html: `<div style="font-family:sans-serif;max-width:600px;background:#0f172a;color:#f1f5f9;padding:32px;border-radius:16px;">
      <h1 style="color:#f59e0b;">⚠️ Peringatan Anggaran</h1>
      <p>Halo <strong>${name}</strong>, anggaran <strong>${category}</strong> sudah terpakai <strong style="color:#f43f5e;">${percentage}%</strong>.</p>
    </div>`,
  })
}

export async function sendWeeklyReport(to: string, name: string, totalExpense: number, totalIncome: number) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Laporan Mingguan THR Anda',
    html: `<div style="font-family:sans-serif;max-width:600px;background:#0f172a;color:#f1f5f9;padding:32px;border-radius:16px;">
      <h1 style="color:#f59e0b;">📊 Laporan Mingguan</h1>
      <p>Halo <strong>${name}</strong></p>
      <p>Pemasukan: <strong style="color:#10b981;">${fmtIDR(totalIncome)}</strong></p>
      <p>Pengeluaran: <strong style="color:#f43f5e;">${fmtIDR(totalExpense)}</strong></p>
      <p>Sisa: <strong style="color:#f59e0b;">${fmtIDR(totalIncome - totalExpense)}</strong></p>
    </div>`,
  })
}
