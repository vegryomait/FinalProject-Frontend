import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  FlaskConical,
  CalendarDays,
  Award,
  ArrowRight,
  Clock,
  Search,
  CheckCircle2,
  FileCheck2,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { submissionService } from '../../services/submissionService';
import { SERVICE_DETAILS, SERVICE_TYPES, SUBMISSION_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const submissions = submissionService.getByStudentId(user?.id);

  // Statistics
  const stats = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter((s) => s.status === SUBMISSION_STATUS.PENDING).length;
    const underReview = submissions.filter((s) => s.status === SUBMISSION_STATUS.UNDER_REVIEW || s.status === SUBMISSION_STATUS.LECTURER_REVIEW).length;
    const approved = submissions.filter((s) => s.status === SUBMISSION_STATUS.APPROVED || s.status === SUBMISSION_STATUS.COMPLETED).length;
    const revision = submissions.filter((s) => s.status === SUBMISSION_STATUS.REVISION_REQUIRED).length;
    return { total, pending, underReview, approved, revision };
  }, [submissions]);

  // Recent 5 submissions
  const recentSubmissions = useMemo(() => {
    return [...submissions].slice(0, 5);
  }, [submissions]);

  const services = [
    {
      ...SERVICE_DETAILS[SERVICE_TYPES.ACTIVE_STUDENT],
      icon: FileText,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      ...SERVICE_DETAILS[SERVICE_TYPES.RESEARCH_LETTER],
      icon: FlaskConical,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      ...SERVICE_DETAILS[SERVICE_TYPES.ACADEMIC_LEAVE],
      icon: CalendarDays,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      ...SERVICE_DETAILS[SERVICE_TYPES.GRADE_CORRECTION],
      icon: Award,
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#17365D] via-[#1E4577] to-[#3478E5] p-6 sm:p-8 text-white shadow-lg">
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-medium mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Portal Layanan Akademik Terpadu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat datang kembali, {user?.name || 'Mahasiswa'}! 👋
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mt-2 leading-relaxed">
            Kelola pengajuan surat dan administrasi perkuliahan Anda dengan mudah, cepat, dan transparan dari satu dashboard.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/student/services')}
              className="text-[#17365D] font-semibold border-none shadow-sm hover:bg-blue-50"
            >
              Ajukan Layanan Baru
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student/submissions')}
              className="border-white/40 text-white hover:bg-white/10"
            >
              Lihat Riwayat Saya
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Pengajuan</p>
            <h3 className="text-xl sm:text-2xl font-bold text-[#172033] mt-0.5">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Menunggu Verifikasi</p>
            <h3 className="text-xl sm:text-2xl font-bold text-[#172033] mt-0.5">{stats.pending}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Sedang Ditinjau</p>
            <h3 className="text-xl sm:text-2xl font-bold text-[#172033] mt-0.5">{stats.underReview}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Telah Disetujui / Selesai</p>
            <h3 className="text-xl sm:text-2xl font-bold text-[#172033] mt-0.5">{stats.approved}</h3>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#172033]">Layanan Mandiri Mahasiswa</h2>
            <p className="text-xs text-slate-500">Pilih jenis layanan administrasi yang Anda perlukan</p>
          </div>
          <Link
            to="/student/services"
            className="text-xs font-semibold text-[#3478E5] hover:underline flex items-center gap-1"
          >
            <span>Semua Layanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${srv.iconBg} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#172033] mb-1 line-clamp-1">{srv.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {srv.processingTime}
                  </span>
                  <Link
                    to={`/student/services/${srv.slug}/new`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3478E5] group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Ajukan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Access Tracking Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#3478E5] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#172033]">Lacak Perkembangan Berkas Anda</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Pantau perjalanan persetujuan surat dan tindak lanjuti jika terdapat catatan revisi dari admin.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/student/submissions')}
          className="whitespace-nowrap flex-shrink-0 shadow-sm"
        >
          Buka Halaman Tracking
        </Button>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#172033]">Pengajuan Terbaru</h3>
            <p className="text-xs text-slate-500">Daftar pengajuan terkini yang pernah Anda buat</p>
          </div>
          <Link
            to="/student/submissions"
            className="text-xs font-semibold text-[#3478E5] hover:underline"
          >
            Lihat Semua ({submissions.length})
          </Link>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Belum ada pengajuan. Silakan pilih layanan untuk membuat pengajuan baru.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentSubmissions.map((sub) => {
              const srvConfig = SERVICE_DETAILS[sub.serviceType] || {
                title: 'Layanan Kampus',
                icon: FileText,
              };

              return (
                <div
                  key={sub.id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#172033]">
                          {srvConfig.title}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          #{sub.submissionNumber}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        Diajukan pada {formatDate(sub.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <StatusBadge status={sub.status} />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/student/submissions/${sub.id}`)}
                      className="text-xs"
                    >
                      Detail
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
