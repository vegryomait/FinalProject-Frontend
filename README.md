# Student Service Management System (SSMS)
**Frontend Development Specification & Prototype Implementation**

Aplikasi web portal pelayanan administrasi akademik terpadu satu pintu untuk mahasiswa dan staf tata usaha / administrasi kampus.

---

## 🎯 Layanan Akademik yang Tersedia (4 Layanan)

1. **Surat Aktif Kuliah**: Surat keterangan resmi aktif studi untuk beasiswa, tunjangan orang tua, BPJS, atau visa.
2. **Surat Penelitian**: Surat izin pengantar riset skripsi/tugas akhir ke instansi atau perusahaan mitra.
3. **Cuti Akademik**: Permohonan penghentian studi sementara untuk 1–2 semester.
4. **Komplain Nilai / Perubahan Nilai (Grade Complaint & Correction)** *(Layanan Baru)*:
   - **Komplain Nilai**: Mahasiswa mengajukan peninjauan kembali atas nilai yang dinilai kurang sesuai dengan capaian asesmen.
   - **Koreksi Nilai**: Mahasiswa melaporkan indikasi kesalahan input, kalkulasi rekapitulasi, atau ketidaksesuaian data rekam akademik.

---

## 🔄 Alur Kerja Layanan Komplain Nilai (Lecturer Review Workflow)

Sesuai spesifikasi akademik perguruan tinggi, permohonan perubahan nilai menempuh tahapan:

$$\text{Mahasiswa Submit} \longrightarrow \text{Verifikasi Admin BAA} \longrightarrow \text{Review Dosen Pengampu} \longrightarrow \text{Pengesahan Dekanat/BAA} \longrightarrow \text{Selesai (Completed)}$$

- **Status Berkas**:
  - `PENDING` (Menunggu Verifikasi Administrasi)
  - `UNDER_REVIEW` (Sedang Ditinjau Admin)
  - `LECTURER_REVIEW` (Diteruskan ke Dosen Pengampu untuk Evaluasi Lembar Jawaban & Rekomendasi Grade)
  - `REVISION_REQUIRED` (Admin/Dosen meminta klarifikasi atau dokumen pendukung tambahan)
  - `APPROVED` (Rekomendasi perubahan nilai disetujui pimpinan akademik)
  - `REJECTED` (Komplain ditolak karena nilai sudah sesuai dengan arsip evaluasi)
  - `COMPLETED` (Perubahan nilai resmi telah disahkan oleh Biro Akademik dan disinkronkan ke pangkalan data KHS)

> ⚠️ *Penting: Perubahan nilai resmi hanya dapat disahkan oleh personel akademik yang berwenang (BAA). Persetujuan rekomendasi dosen tidak secara otomatis memodifikasi nilai KHS sebelum proses administrasi diselesaikan.*

---

## 🔑 Akun Demo Kredensial

Aplikasi dilengkapi tombol pemilihan cepat di halaman login:

| Peran (Role) | Email / NIM / ID | Kata Sandi (Password) | Hak Akses |
|---|---|---|---|
| **Mahasiswa** | `student@demo.test` atau `12345678` | `student123` | Portal Mahasiswa (`/student/dashboard`) |
| **Admin** | `admin@demo.test` atau `ADM-2024-001` | `admin123` | Portal Admin (`/admin/dashboard`) |

> 💡 *Tersedia tombol **"Reset Data Demo"** di bagian bawah sidebar untuk mengembalikan seluruh data pengajuan dan pengguna ke kondisi awal bila diperlukan pengujian ulang.*

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite 6
- **Routing**: React Router DOM v6 (Role-based layout & route protection)
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React
- **Charts**: Recharts
- **Data Persistence**: `localStorage` terstruktur melalui `submissionService` & `userService`

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

1. Masuk ke direktori proyek:
   ```bash
   cd "Frontend(Final Project)"
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Buka browser pada alamat yang ditampilkan (biasanya `http://localhost:3000` atau `http://localhost:5173`).

4. Untuk membuat build produksi:
   ```bash
   npm run build
   ```

---

## 📌 Batasan Prototipe (MVP Prototype Scope)

1. **Persistensi Data**: Seluruh data simulasi disimpan dalam `localStorage` peramban. Pembersihan cache atau ganti browser akan mereset data ke seed awal.
2. **Unggahan Dokumen**: Menyimpan metadata berkas simulasi (nama, ukuran, tanggal, tipe) dengan validasi format (PDF, JPG, PNG) dan ukuran 5MB.
3. **Sinkronisasi Nilai Nyata**: Pada lingkungan produksi, tahap `COMPLETED` akan terhubung ke Academic Information System (SIAKAD) via REST API atau webhook. Pada prototipe MVP ini, alur disimulasikan secara lengkap hingga pengesahan SK resmi.
