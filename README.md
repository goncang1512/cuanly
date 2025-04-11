# 💰 Website Pengelola Keuangan

Aplikasi berbasis web untuk membantu pengguna mencatat, mengelola, dan menganalisis keuangan pribadi mereka.

🔗 **Coba Aplikasinya:** [cuanly.vercel.app](http://cuanly.vercel.app/)

---

## ✨ Fitur Utama

- 💳 Website Pengelola Keuangan
- 📥 Tambah pengeluaran & pemasukan
- 📊 Grafik laporan (line, bar & pie chart)
- 🔍 Filter dan pencarian transaksi
- 🔐 Login & Register (Better-Auth)
- 🔄 Kategori transaksi: `add`, `pay`, `move`, `transfer`, `adjust`

---

## 🧱 Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes + Actions server + Prisma ORM
- **Database**: PostgreSQL
- **Auth**: Better-Auth
- **Deployment**: Vercel (frontend + backend)

---

## 🗂️ Struktur Folder

```bash
├── public/
├── prisma/                 # Schema & migration Prisma
├── src/
│   ├── actions
│   ├── app/                # Routing pages (Next.js App Router)
│   │   ├── (tabs)/
│   │   ├── api/auth/[...all]
│   │   ├── auth
│   │   ├── global.css
│   │   ├── global-error.tsx
│   │   └── layout.tsx
│   ├── components/         # Komponen UI (Chart, Table, Modal, dll)
│   └── lib/                # Konfigurasi dan helper (contoh: prisma.ts)
│       ├── types/              # Tipe TypeScript kustom
│       └── utils/              # Fungsi utilitas (formatting, kalkulasi, dll)
├── .env
├── README.md
└── package.json
```

---

## 🧭 Alur Kerja Pengguna

1. Login atau daftar akun baru
2. Masuk ke dashboard
3. Tambah transaksi (income, expense, transfer)
4. Gunakan grafik untuk analisis

---

## 🛠 Environment Variables

Buat file `.env` di root project dan isi dengan variabel berikut:

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=asdf90234jasdfJasdUASDFas
NEXT_PUBLIC_CLOUDINARY_NAME=dandnnad
CLOUDINARY_API_KEY=9asdf0mmas9d9sjkdf9a9sd
CLOUDINARY_API_SECRET=as9dfpasdfasdfklas
```
