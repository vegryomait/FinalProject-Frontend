import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  FlaskConical,
  CalendarDays,
  Award,
  Clock,
  ArrowRight,
  CheckCircle,
  Search,
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { SERVICE_DETAILS, SERVICE_TYPES } from '../../utils/constants';

export default function ServiceCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const catalog = [
    {
      ...SERVICE_DETAILS[SERVICE_TYPES.ACTIVE_STUDENT],
      icon: FileText,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      requirements: [
        'KRS semester aktif yang telah disahkan DPA',
        'Bukti pelunasan pembayaran SPP/BPP semester berjalan',
        'Tidak sedang dalam masa skorsing atau cuti',
      ],
      output: 'Surat Keterangan Aktif Kuliah Ber-barcode',
    },
    {
      ...SERVICE_DETAILS[SERVICE_TYPES.RESEARCH_LETTER],
      icon: FlaskConical,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      requirements: [
        'Proposal penelitian skripsi/tugas akhir yang disetujui pembimbing',
        'Informasi lengkap nama instansi & pejabat penerima surat',
        'Alamat lengkap dan periode pelaksanaan riset',
      ],
      output: 'Surat Pengantar Izin Penelitian Resmi BAA',
    },
    {
      ...SERVICE_DETAILS[SERVICE_TYPES.ACADEMIC_LEAVE],
      icon: CalendarDays,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      requirements: [
        'Surat permohonan tertulis ditujukan kepada Dekan',
        'Surat persetujuan dari orang tua/wali mahasiswa',
        'Surat keterangan pendukung (surat sakit/surat tugas kerja/magang)',
      ],
      output: 'Surat Keputusan (SK) Cuti Akademik Dekan',
    },
    {
      ...SERVICE_DETAILS[SERVICE_TYPES.GRADE_CORRECTION],
      icon: Award,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      requirements: [
        'Bukti KHS atau tangkapan layar nilai portal / LMS',
        'Bukti pengumpulan tugas / lembar jawaban ujian / presensi',
        'Rincian komponen penilaian yang dikomplain/dikoreksi',
      ],
      output: 'Rekomendasi Dosen & Pengesahan Perubahan Nilai',
    },
  ];

  const filtered = catalog.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Katalog Layanan Administrasi"
        subtitle="Pilih jenis layanan administrasi akademik yang Anda butuhkan dan ajukan secara online."
        breadcrumbs={[
          { label: 'Dashboard', href: '/student/dashboard' },
          { label: 'Katalog Layanan' },
        ]}
      />

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari layanan (misal: aktif kuliah, cuti, riset, komplain nilai)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3478E5] focus:border-transparent transition-all shadow-xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bgColor} ${item.iconColor} group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    {item.processingTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#172033] mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-5">
                  {item.description}
                </p>

                {/* Requirements checklist */}
                <div className="space-y-2 pt-4 border-t border-slate-100 mb-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Persyaratan Dokumen:
                  </p>
                  {item.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/student/services/${item.slug}/new`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#3478E5] text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-sm"
                >
                  <span>Ajukan Layanan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
