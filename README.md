# Task Manager — Next.js + Node.js API

Aplikasi Task Manager yang dibangun dengan **Next.js 14 App Router** dan **Node.js API Routes** built-in, menggunakan **SQLite** sebagai database lokal.

## 🗂️ Struktur Proyek

```
taskmanager-nextjs/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts          # GET (list) + POST (create)
│   │       └── [id]/route.ts     # PUT (update) + DELETE (hapus)
│   ├── components/
│   │   ├── TaskForm.tsx          # Form buat/edit task
│   │   └── TaskList.tsx          # Daftar task
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Halaman utama
├── lib/
│   ├── db.ts                     # SQLite helper (pengganti Supabase)
│   └── taskApi.ts                # Client-side fetch helper
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js 18+
- npm atau yarn

### Langkah

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Buka browser
http://localhost:3000
```

Database SQLite (`tasks.db`) akan **otomatis dibuat** di root proyek saat pertama kali dijalankan. Tidak perlu konfigurasi database apapun!

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/tasks` | Ambil semua task |
| POST | `/api/tasks` | Buat task baru |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Hapus task |

### Contoh Request

**Buat Task Baru:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "x-session-id: your-session-id" \
  -d '{"title":"Belajar Next.js","description":"Pelajari App Router","status":"pending"}'
```

**Update Task:**
```bash
curl -X PUT http://localhost:3000/api/tasks/{id} \
  -H "Content-Type: application/json" \
  -H "x-session-id: your-session-id" \
  -d '{"status":"completed"}'
```

## 🔄 Perbandingan dengan Versi Asli

| Aspek | Asli (Vite) | Versi Baru (Next.js) |
|---|---|---|
| Frontend | React + Vite | Next.js 14 App Router |
| Backend | Supabase (cloud) | Node.js API Routes built-in |
| Database | Supabase PostgreSQL | SQLite (lokal) |
| Deploy | Netlify | Vercel / VPS |
| Konfigurasi | `.env` dengan API keys | Tidak perlu konfigurasi |

## 🛠️ Build untuk Produksi

```bash
npm run build
npm start
```

## 📦 Deploy ke Vercel

```bash
npm install -g vercel
vercel
```

> **Catatan:** Untuk deploy di Vercel, ganti SQLite dengan database cloud seperti **Turso**, **PlanetScale**, atau **Neon** karena Vercel menggunakan filesystem read-only.
