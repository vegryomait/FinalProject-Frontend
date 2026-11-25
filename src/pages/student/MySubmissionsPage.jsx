import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  FileText,
  FlaskConical,
  CalendarDays,
  Award,
  ArrowRight,
  Filter,
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import { authService } from '../../services/authService';
import { submissionService } from '../../services/submissionService';
import { SERVICE_DETAILS, SERVICE_TYPES, SUBMISSION_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

export default function MySubmissionsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = authService.getCurrentUser();

  const tabParam = searchParams.get('tab') || 'ALL';
  const [activeTab, setActiveTab] = useState(tabParam.toUpperCase());
  const [searchQuery, setSearchQuery] = useState('');

  const submissions = submissionService.getByStudentId(user?.id);

  // Tabs definitions
  const tabs = [
    { id: 'ALL', label: 'Semua' },
    { id: SUBMISSION_STATUS.PENDING, label: 'Menunggu' },
    { id: SUBMISSION_STATUS.UNDER_REVIEW, label: 'Sedang Ditinjau' },
    { id: SUBMISSION_STATUS.LECTURER_REVIEW, label: 'Review Dosen' },
    { id: SUBMISSION_STATUS.REVISION_REQUIRED, label: 'Perlu Revisi' },
    { id: SUBMISSION_STATUS.APPROVED, label: 'Disetujui' },
    { id: SUBMISSION_STATUS.REJECTED, label: 'Ditolak' },
    { id: SUBMISSION_STATUS.COMPLETED, label: 'Selesai' },
  ];

  // Counts per tab
  const counts = useMemo(() => {
    const res = { ALL: submissions.length };
    Object.values(SUBMISSION_STATUS).forEach((st) => {
      res[st] = submissions.filter((s) => s.status === st).length;
    });
    return res;
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      const matchTab = activeTab === 'ALL' || item.status === activeTab;
      const srvName = SERVICE_DETAILS[item.serviceType]?.title || '';
      const courseName = item.formData?.courseName || '';
      const courseCode = item.formData?.courseCode || '';
      const q = searchQuery.toLowerCase();

      const matchSearch =
        item.submissionNumber.toLowerCase().includes(q) ||
        srvName.toLowerCase().includes(q) ||
        courseName.toLowerCase().includes(q) ||
        courseCode.toLowerCase().includes(q);

      return matchTab && matchSearch;
    });
  }, [submissions, activeTab, searchQuery]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams(tabId === 'ALL' ? {} : { tab: tabId.toLowerCase() });
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case SERVICE_TYPES.RESEARCH_LETTER:
        return FlaskConical;
      case SERVICE_TYPES.ACADEMIC_LEAVE:
        return CalendarDays;
      case SERVICE_TYPES.GRADE_CORRECTION:
        return Award;
      case SERVICE_TYPES.ACTIVE_STUDENT:
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Riwayat Pengajuan Saya"
        subtitle="Pantau status terkini dan rekam jejak dokumen administrasi serta komplain nilai yang telah Anda ajukan."
        breadcrumbs={[
          { label: 'Dashboard', href: '/student/dashboard' },
          { label: 'Pengajuan Saya' },
        ]}
        action={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => navigate('/student/services')}
          >
            Buat Pengajuan Baru
          </Button>
        }
      />

      {/* Tabs & Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs space-y-4">
        {/* Horizontal Scrollable Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100">
          {tabs.map((tab) => {
            const count = counts[tab.id] || 0;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#17365D] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor pengajuan, nama layanan, mata kuliah..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3478E5] focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Submissions List / Table */}
      {filteredSubmissions.length === 0 ? (
        <EmptyState
          title="Tidak Ada Pengajuan Ditemukan"
          description={
            searchQuery
              ? `Tidak ada pengajuan yang cocok dengan pencarian "${searchQuery}".`
              : 'Anda belum memiliki riwayat pengajuan dalam status ini.'
          }
          actionText="Ajukan Layanan Baru"
          onAction={() => navigate('/student/services')}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nomor Pengajuan</th>
                  <th className="px-6 py-4">Jenis Layanan & Keterangan</th>
                  <th className="px-6 py-4">Tanggal Diajukan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((sub) => {
                  const srv = SERVICE_DETAILS[sub.serviceType] || {
                    title: 'Layanan Kampus',
                  };
                  const Icon = getServiceIcon(sub.serviceType);

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/student/submissions/${sub.id}`)}
                    >
                      <td className="px-6 py-4 font-mono font-bold text-[#3478E5]">
                        {sub.submissionNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            sub.serviceType === SERVICE_TYPES.GRADE_CORRECTION ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-[#172033] block">
                              {srv.title}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {sub.serviceType === SERVICE_TYPES.GRADE_CORRECTION && sub.formData?.courseName
                                ? `${sub.formData.courseCode} - ${sub.formData.courseName}`
                                : `${sub.documents?.length || 0} berkas terlampir`}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(sub.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/student/submissions/${sub.id}`);
                          }}
                        >
                          Detail
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredSubmissions.map((sub) => {
              const srv = SERVICE_DETAILS[sub.serviceType] || {
                title: 'Layanan Kampus',
              };
              const Icon = getServiceIcon(sub.serviceType);

              return (
                <div
                  key={sub.id}
                  onClick={() => navigate(`/student/submissions/${sub.id}`)}
                  className="p-4 hover:bg-slate-50 transition-colors space-y-3 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        sub.serviceType === SERVICE_TYPES.GRADE_CORRECTION ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#172033]">{srv.title}</h4>
                        <span className="font-mono text-xs text-[#3478E5]">
                          #{sub.submissionNumber}
                        </span>
                        {sub.serviceType === SERVICE_TYPES.GRADE_CORRECTION && sub.formData?.courseName && (
                          <p className="text-[11px] text-slate-500">
                            {sub.formData.courseCode} - {sub.formData.courseName}
                          </p>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={sub.status} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                    <span>Diajukan: {formatDate(sub.createdAt)}</span>
                    <span className="text-[#3478E5] font-semibold flex items-center gap-1">
                      <span>Lihat Tracking</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
