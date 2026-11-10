# SmartPantry Starter

Starter aplikasi manajemen persediaan pangan + rekomendasi resep AI.

## Stack
- Next.js 15 App Router + TypeScript + Tailwind CSS v4
- Supabase Auth + PostgreSQL + Row Level Security
- FastAPI AI Service (Qwen2.5-0.5B-Instruct + adapter LoRA yang sudah dilatih)

## 1. Persiapan Supabase
1. Buat project baru di https://supabase.com.
2. Buka Project Settings > API.
3. Salin Project URL dan anon/public key.
4. Buka SQL Editor dan jalankan seluruh `supabase/schema.sql`.

## 2. Konfigurasi Next.js
Buka terminal pada folder project ini:

```powershell
npm install
Copy-Item .env.example .env.local
```

Edit `.env.local` dan isi nilai asli dari Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUPABASE_ANON_KEY
AI_SERVICE_URL=http://127.0.0.1:8000
```

Jangan pernah memasukkan `service_role` key ke variabel `NEXT_PUBLIC_` atau ke kode frontend.

## 3. Jalankan AI Service
Pastikan AI Service FastAPI yang sudah dibuat sebelumnya berjalan pada port 8000:
```powershell
uvicorn app:app --host 127.0.0.1 --port 8000
```
Pastikan `GET http://127.0.0.1:8000/health` menunjukkan `model_loaded: true`.

## 4. Jalankan Next.js
Buka terminal kedua di folder project:
```powershell
npm run dev
```
Buka http://localhost:3000.

## 5. Alur uji
1. Daftar akun di `/register`.
2. Jika Supabase meminta konfirmasi email, konfirmasi email terlebih dahulu. Untuk demo lokal, pengaturan konfirmasi email dapat diubah di Supabase Auth > Providers > Email.
3. Login di `/login`.
4. Tambahkan bahan di `/dashboard/inventory`, contoh: Nasi, Telur, Bawang putih, Kecap.
5. Buka `/dashboard/recipes`, tekan "Buat rekomendasi AI".

## API yang tersedia
- `GET /api/inventory` - daftar inventaris milik user aktif.
- `POST /api/inventory` - tambah bahan.
- `DELETE /api/inventory/:id` - hapus bahan milik user aktif.
- `POST /api/recipes/recommend` - hitung kecocokan resep dari database lalu minta penjelasan ke AI.

## Catatan teknis penting
- Data stok dihitung backend dari Supabase; frontend tidak mengirim nilai stok sebagai sumber kebenaran.
- RLS membatasi inventaris berdasarkan `auth.uid()`.
- Pencocokan bahan pada starter ini memakai nama yang dinormalisasi secara sederhana. Untuk produksi, sebaiknya tambahkan tabel master bahan dan alias (contoh `cabai merah` vs `cabe merah`) serta konversi satuan.
- AI hanya bertugas menjelaskan hasil pencocokan; AI bukan sumber data stok.
- `AI_SERVICE_URL` yang menunjuk `127.0.0.1` hanya berfungsi untuk pengembangan lokal. Deployment Vercel membutuhkan AI Service yang di-host di server publik/private network yang dapat dijangkau backend.
- Starter ini belum mengimplementasikan edit inventaris, foto bahan, notifikasi, atau manajemen resep admin.
