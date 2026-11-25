import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Download,
  Calendar,
  Award,
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { submissionService } from '../../services/submissionService';
import {
  SERVICE_DETAILS,
  SERVICE_TYPES,
  SUBMISSION_STATUS,
  COMPLAINT_TYPES,
} from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

export default function ManageSubmissionsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlStatus = searchParams.get('status') || 'ALL';
  const urlService = searchParams.get('service') || 'ALL';

  const [selectedStatus, setSelectedStatus] = useState(urlStatus.toUpperCase());
  const [selectedService, setSelectedService] = useState(urlService.toUpperCase());
  const [selectedComplaintType, setSelectedComplaintType] = useState('ALL');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const submissions = submissionService.getAll();

  // Status Tabs including Lecturer Review & Completed
  const statusTabs = [
    { id: 'ALL', label: 'Semua' },
    { id: SUBMISSION_STATUS.PENDING, label: 'Pending' },
    { id: SUBMISSION_STATUS.UNDER_REVIEW, label: 'Under Review' },
    { id: SUBMISSION_STATUS.LECTURER_REVIEW, label: 'Review Dosen' },
    { id: SUBMISSION_STATUS.REVISION_REQUIRED, label: 'Revision' },
    { id: SUBMISSION_STATUS.APPROVED, label: 'Approved' },
    { id: SUBMISSION_STATUS.REJECTED, label: 'Rejected' },
    { id: SUBMISSION_STATUS.COMPLETED, label: 'Completed' },
  ];

  // Counts for tabs
  const counts = useMemo(() => {
    const res = { ALL: submissions.length };
    Object.values(SUBMISSION_STATUS).forEach((st) => {
      res[st] = submissions.filter((s) => s.status === st).length;
    });
    return res;
  }, [submissions]);

  // Extract unique courses and semesters for filter dropdowns
  const availableCourses = useMemo(() => {
    const set = new Set();
    submissions.forEach((s) => {
      if (s.formData?.courseName) {
        set.add(`${s.formData.courseCode ? s.formData.courseCode + ' - ' : ''}${s.formData.courseName}`);
      }
    });
    return Array.from(set);
  }, [submissions]);

  const availableSemesters = useMemo(() => {
    const set = new Set();
    submissions.forEach((s) => {
      const sem = s.formData?.semester || s.formData?.academicSemester || s.formData?.leaveSemester;
      if (sem) set.add(sem);
    });
    return Array.from(set);
  }, [submissions]);

  // Filtering by status, service, complaint type, semester, course, search
  const filteredList = useMemo(() => {
    return submissions.filter((item) => {
      const matchStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
      const matchService = selectedService === 'ALL' || item.serviceType === selectedService;
      const matchComplaintType =
        selectedComplaintType === 'ALL' ||
        item.formData?.complaintType === selectedComplaintType;

      const itemSemester =
        item.formData?.semester ||
        item.formData?.academicSemester ||
        item.formData?.leaveSemester;
      const matchSemester =
        selectedSemester === 'ALL' || itemSemester === selectedSemester;

      const q = searchQuery.toLowerCase();
      const matchSearch =
        item.submissionNumber.toLowerCase().includes(q) ||
        item.studentName.toLowerCase().includes(q) ||
        item.studentIdentifier.toLowerCase().includes(q) ||
        (item.formData?.courseName && item.formData.courseName.toLowerCase().includes(q)) ||
        (item.formData?.courseCode && item.formData.courseCode.toLowerCase().includes(q)) ||
        (item.formData?.lecturerName && item.formData.lecturerName.toLowerCase().includes(q));

      return matchStatus && matchService && matchComplaintType && matchSemester && matchSearch;
    });
  }, [
    submissions,
    selectedStatus,
    selectedService,
    selectedComplaintType,
    selectedSemester,
    searchQuery,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage, pageSize]);

  const handleStatusChange = (statusId) => {
    setSelectedStatus(statusId);
    setCurrentPage(1);
    setSearchParams(statusId === 'ALL' ? {} : { status: statusId });
  };

  const handleResetFilters = () => {
    setSelectedStatus('ALL');
    setSelectedService('ALL');
    setSelectedComplaintType('ALL');
    setSelectedSemester('ALL');
    setSearchQuery('');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Daftar Pengajuan Mahasiswa"
        subtitle="Kelola, verifikasi kelengkapan berkas, koordinasi review dosen, dan tetapkan status keputusan layanan."
        breadcrumbs={[
          { label: 'Dashboard Admin', href: '/admin/dashboard' },
          { label: 'Kelola Pengajuan' },
        ]}
      />

      {/* Tabs like wireframe */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100">
          {statusTabs.map((tab) => {
            const count = counts[tab.id] || 0;
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleStatusChange(tab.id)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#17365D] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters Row (Requirement 5: Filter by complaint type, course, semester, status) */}
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari nama, NIM, no. berkas, mata kuliah, dosen..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3478E5] focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              {/* Service filter */}
              <select
                value={selectedService}
                onChange={(e) => {
                  setSelectedService(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#3478E5] focus:bg-white"
              >
                <option value="ALL">Semua Jenis Layanan</option>
                {Object.values(SERVICE_DETAILS).map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.title}
                  </option>
                ))}
              </select>

              {/* Semester filter */}
              <select
                value={selectedSemester}
                onChange={(e) => {
                  setSelectedSemester(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#3478E5] focus:bg-white"
              >
                <option value="ALL">Semua Semester</option>
                {availableSemesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>

              {/* Complaint Type filter (Active for Grade Correction) */}
              <select
                value={selectedComplaintType}
                onChange={(e) => {
                  setSelectedComplaintType(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#3478E5] focus:bg-white"
              >
                <option value="ALL">Semua Jenis Komplain</option>
                <option value="KOMPLAIN_NILAI">Komplain Nilai (Review)</option>
                <option value="KOREKSI_NILAI">Koreksi Nilai (Kesalahan Input)</option>
              </select>

              {(searchQuery ||
                selectedService !== 'ALL' ||
                selectedStatus !== 'ALL' ||
                selectedComplaintType !== 'ALL' ||
                selectedSemester !== 'ALL') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Reset Filter"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      {filteredList.length === 0 ? (
        <EmptyState
          title="Tidak Ada Berkas Ditemukan"
          description="Tidak ada pengajuan yang cocok dengan kriteria filter atau pencarian Anda."
          actionText="Reset Filter"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">No.</th>
                  <th className="px-6 py-4">Nomor Pengajuan</th>
                  <th className="px-6 py-4">Nama Mahasiswa / NIM</th>
                  <th className="px-6 py-4">Jenis Layanan & Mata Kuliah</th>
                  <th className="px-6 py-4">Tanggal Masuk</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedList.map((item, idx) => {
                  const srv = SERVICE_DETAILS[item.serviceType] || { title: 'Layanan' };
                  const itemNumber = (currentPage - 1) * pageSize + idx + 1;
                  const isGrade = item.serviceType === SERVICE_TYPES.GRADE_CORRECTION;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => navigate(`/admin/submissions/${item.id}`)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 text-center text-slate-400 font-medium">
                        {itemNumber}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-[#3478E5]">
                        {item.submissionNumber}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#172033] group-hover:text-[#3478E5] transition-colors">
                          {item.studentName}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          NIM: {item.studentIdentifier}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-800 block">{srv.title}</span>
                        {isGrade && item.formData?.courseName ? (
                          <span className="text-[11px] text-purple-700 font-medium">
                            {item.formData.courseCode} - {item.formData.courseName} (Nilai: {item.formData.currentGrade})
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            {item.documents?.length || 0} lampiran berkas
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/submissions/${item.id}`);
                          }}
                          className="text-xs"
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

          {/* Table Footer: Pagination & Count info */}
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Menampilkan{' '}
              <strong className="text-[#172033]">
                {Math.min(filteredList.length, (currentPage - 1) * pageSize + 1)} -{' '}
                {Math.min(filteredList.length, currentPage * pageSize)}
              </strong>{' '}
              dari <strong className="text-[#172033]">{filteredList.length}</strong> total berkas
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  onClick={() => setCurrentPage(pg)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === pg
                      ? 'bg-[#3478E5] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
