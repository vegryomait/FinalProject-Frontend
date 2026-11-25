import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Award,
  UserCheck,
  CheckCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { submissionService } from '../../services/submissionService';
import { userService } from '../../services/userService';
import { SERVICE_DETAILS, SERVICE_TYPES, SUBMISSION_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const submissions = submissionService.getAll();
  const users = userService.getUsers();

  // Statistics calculation for all submissions
  const stats = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter((s) => s.status === SUBMISSION_STATUS.PENDING).length;
    const underReview = submissions.filter((s) => s.status === SUBMISSION_STATUS.UNDER_REVIEW).length;
    const lecturerReview = submissions.filter((s) => s.status === SUBMISSION_STATUS.LECTURER_REVIEW).length;
    const approved = submissions.filter((s) => s.status === SUBMISSION_STATUS.APPROVED).length;
    const rejected = submissions.filter((s) => s.status === SUBMISSION_STATUS.REJECTED).length;
    const completed = submissions.filter((s) => s.status === SUBMISSION_STATUS.COMPLETED).length;
    const revision = submissions.filter((s) => s.status === SUBMISSION_STATUS.REVISION_REQUIRED).length;
    return { total, pending, underReview, lecturerReview, approved, rejected, completed, revision };
  }, [submissions]);

  // Statistics specific to Grade Complaints (Requirement 5)
  const gradeStats = useMemo(() => {
    const gradeSubs = submissions.filter((s) => s.serviceType === SERVICE_TYPES.GRADE_CORRECTION);
    return {
      total: gradeSubs.length,
      pending: gradeSubs.filter((s) => s.status === SUBMISSION_STATUS.PENDING).length,
      awaitingLecturer: gradeSubs.filter((s) => s.status === SUBMISSION_STATUS.LECTURER_REVIEW).length,
      approved: gradeSubs.filter((s) => s.status === SUBMISSION_STATUS.APPROVED).length,
      rejected: gradeSubs.filter((s) => s.status === SUBMISSION_STATUS.REJECTED).length,
      completed: gradeSubs.filter((s) => s.status === SUBMISSION_STATUS.COMPLETED).length,
    };
  }, [submissions]);

  // Queue that needs action (Pending, Under Review, or Lecturer Review)
  const actionQueue = useMemo(() => {
    return submissions
      .filter((s) =>
        s.status === SUBMISSION_STATUS.PENDING ||
        s.status === SUBMISSION_STATUS.UNDER_REVIEW ||
        s.status === SUBMISSION_STATUS.LECTURER_REVIEW
      )
      .slice(0, 4);
  }, [submissions]);

  // Recent 6 submissions
  const recentSubmissions = useMemo(() => {
    return [...submissions].slice(0, 6);
  }, [submissions]);

  // Monthly trend mock data
  const chartData = [
    { month: 'Jun', total: 24, approved: 18 },
    { month: 'Jul', total: 42, approved: 35 },
    { month: 'Agu', total: 68, approved: 52 },
    { month: 'Sep', total: 95, approved: 80 },
    { month: 'Okt', total: 120, approved: 104 },
    { month: 'Nov', total: 152, approved: 130 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title="Dashboard Administrasi"
        subtitle="Ringkasan berkas pengajuan mahasiswa dan statistik operasional akademik."
        action={
          <Button
            variant="navy"
            size="md"
            icon={FileCheck2}
            onClick={() => navigate('/admin/submissions')}
          >
            Kelola Seluruh Pengajuan
          </Button>
        }
      />

      {/* 4 Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Seluruh Pengajuan"
          value={stats.total}
          trend="+12% bln ini"
          trendType="up"
          icon={FileText}
          iconColorClass="text-[#3478E5] bg-blue-50"
        />
        <StatCard
          title="Menunggu Review / Tindakan"
          value={stats.pending + stats.underReview + stats.lecturerReview}
          trend="+5 antrean"
          trendType="up"
          icon={Clock}
          iconColorClass="text-amber-600 bg-amber-50"
        />
        <StatCard
          title="Disetujui & Selesai"
          value={stats.approved + stats.completed}
          trend="+8% sukses"
          trendType="up"
          icon={CheckCircle2}
          iconColorClass="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          title="Ditolak (Rejected)"
          value={stats.rejected}
          trend="-2% rasio"
          trendType="down"
          icon={XCircle}
          iconColorClass="text-red-600 bg-red-50"
        />
      </div>

      {/* DEDICATED SECTION: REKAPITULASI KOMPLAIN & PERUBAHAN NILAI (REQUIREMENT 5) */}
      <div className="bg-gradient-to-br from-purple-900 via-[#17365D] to-[#1E4577] text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-purple-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Rekapitulasi Layanan Komplain & Perubahan Nilai
              </h3>
              <p className="text-xs text-blue-200">
                Pemantauan alur verifikasi berkas nilai mahasiswa dan status rekomendasi dosen pengampu
              </p>
            </div>
          </div>
          <Link
            to="/admin/submissions?service=GRADE_CORRECTION"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-white"
          >
            <span>Lihat Antrean Nilai</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Metrics Grid for Grade Complaints */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-blue-200 block mb-1">Total Komplain</span>
            <p className="text-xl font-bold font-mono text-white">{gradeStats.total}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-amber-300 block mb-1">Pending (Baru)</span>
            <p className="text-xl font-bold font-mono text-amber-300">{gradeStats.pending}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-purple-300 block mb-1">Review Dosen</span>
            <p className="text-xl font-bold font-mono text-purple-300">{gradeStats.awaitingLecturer}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-emerald-300 block mb-1">Disetujui Dekan</span>
            <p className="text-xl font-bold font-mono text-emerald-300">{gradeStats.approved}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-teal-300 block mb-1">Koreksi Selesai</span>
            <p className="text-xl font-bold font-mono text-teal-300">{gradeStats.completed}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-rose-300 block mb-1">Ditolak</span>
            <p className="text-xl font-bold font-mono text-rose-300">{gradeStats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Chart & Action Queue Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Submission Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#172033]">Tren Pengajuan Berkas</h3>
              <p className="text-xs text-slate-500">Volume pengajuan per bulan pada tahun 2026</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              Naik 18.4%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3478E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3478E5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#172033',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total Pengajuan"
                  stroke="#3478E5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Antrean Membutuhkan Tindakan */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#172033]">Perlu Tindakan Segera</h3>
                <p className="text-xs text-slate-500">Antrean berkas masuk menunggu verifikasi</p>
              </div>
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center">
                {stats.pending + stats.lecturerReview}
              </span>
            </div>

            {actionQueue.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Tidak ada berkas yang menunggu tindakan saat ini.
              </div>
            ) : (
              <div className="space-y-3">
                {actionQueue.map((item) => {
                  const srv = SERVICE_DETAILS[item.serviceType];
                  return (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/admin/submissions/${item.id}`)}
                      className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#172033] group-hover:text-[#3478E5]">
                          {item.studentName}
                        </span>
                        <StatusBadge status={item.status} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {srv?.title || 'Layanan'} • NIM: {item.studentIdentifier}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/admin/submissions?status=PENDING"
              className="text-xs font-semibold text-[#3478E5] hover:underline flex items-center justify-center gap-1.5"
            >
              <span>Buka Antrean Pending</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#172033]">Pengajuan Terbaru Masuk</h3>
            <p className="text-xs text-slate-500">Daftar berkas mahasiswa yang masuk ke sistem SSMS</p>
          </div>
          <Link
            to="/admin/submissions"
            className="text-xs font-semibold text-[#3478E5] hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua Pengajuan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Nomor Pengajuan</th>
                <th className="px-6 py-3.5">Nama Mahasiswa & NIM</th>
                <th className="px-6 py-3.5">Jenis Layanan</th>
                <th className="px-6 py-3.5">Tanggal</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSubmissions.map((sub) => {
                const srv = SERVICE_DETAILS[sub.serviceType] || { title: 'Layanan' };
                return (
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/submissions/${sub.id}`)}
                  >
                    <td className="px-6 py-4 font-mono font-bold text-[#3478E5]">
                      {sub.submissionNumber}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#172033]">{sub.studentName}</p>
                      <p className="text-[11px] text-slate-400">NIM: {sub.studentIdentifier}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{srv.title}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(sub.createdAt)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/submissions/${sub.id}`);
                        }}
                      >
                        Periksa
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
