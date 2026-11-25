import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  FileText,
  Calendar,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Send,
  Eye,
  Clock,
  UserCheck,
  CheckCheck,
  Award,
  AlertTriangle,
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import Timeline from '../../components/ui/Timeline';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import DocumentViewerModal from '../../components/ui/DocumentViewerModal';
import { submissionService } from '../../services/submissionService';
import { authService } from '../../services/authService';
import {
  SERVICE_DETAILS,
  SERVICE_TYPES,
  SUBMISSION_STATUS,
  COMPLAINT_TYPES,
  ASSESSMENT_COMPONENTS,
} from '../../utils/constants';
import { formatDateTime, formatDate, formatFileSize } from '../../utils/formatters';
import { useToast } from '../../components/ui/Toast';

export default function ApprovalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const adminUser = authService.getCurrentUser();

  const [submission, setSubmission] = useState(() => submissionService.getById(id));
  const [decision, setDecision] = useState('');
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Lecturer Review Form States
  const [lecturerRec, setLecturerRec] = useState('APPROVE'); // 'APPROVE' | 'REJECT' | 'REQUEST_INFO'
  const [recommendedGrade, setRecommendedGrade] = useState('');
  const [lecturerNotes, setLecturerNotes] = useState('');

  // Academic Officer Finalization States
  const [skNumber, setSkNumber] = useState('');
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);

  if (!submission) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-auto mt-12 border border-slate-100 shadow-sm">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#172033]">Pengajuan Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Nomor berkas pengajuan tidak ditemukan di database antrean admin.
        </p>
        <Button variant="primary" onClick={() => navigate('/admin/submissions')}>
          Kembali ke Daftar Pengajuan
        </Button>
      </div>
    );
  }

  const srv = SERVICE_DETAILS[submission.serviceType] || { title: 'Layanan Kampus' };
  const isGrade = submission.serviceType === SERVICE_TYPES.GRADE_CORRECTION;

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    setNoteError('');

    if (!decision) {
      toast.warning('Silakan pilih salah satu keputusan.');
      return;
    }

    if (
      (decision === SUBMISSION_STATUS.REJECTED ||
        decision === SUBMISSION_STATUS.REVISION_REQUIRED) &&
      !note.trim()
    ) {
      setNoteError('Catatan / alasan wajib diisi untuk keputusan Penolakan atau Permintaan Revisi.');
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleExecuteDecision = async () => {
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const updated = submissionService.updateStatus(
        submission.id,
        decision,
        note,
        adminUser
      );

      setSubmission(updated);
      setIsConfirmModalOpen(false);
      setDecision('');
      setNote('');

      const actionLabels = {
        [SUBMISSION_STATUS.APPROVED]: 'disetujui',
        [SUBMISSION_STATUS.REJECTED]: 'ditolak',
        [SUBMISSION_STATUS.REVISION_REQUIRED]: 'diminta revisi',
        [SUBMISSION_STATUS.LECTURER_REVIEW]: 'diteruskan ke Review Dosen',
      };

      toast.success(
        `Pengajuan ${updated.submissionNumber} berhasil ${actionLabels[decision] || 'diperbarui'}!`
      );
    } catch {
      toast.error('Gagal memproses keputusan.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler for Lecturer Review Stage Execution (Requirement 6)
  const handleLecturerReviewSubmit = async (e) => {
    e.preventDefault();
    if (!lecturerNotes.trim()) {
      toast.warning('Harap berikan catatan evaluasi dosen pengampu.');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 500));

      const lecturerName =
        submission.formData?.lecturerName || 'Dosen Pengampu';

      const reviewData = {
        lecturerName,
        recommendation: lecturerRec,
        recommendedGrade: lecturerRec === 'APPROVE' ? (recommendedGrade || submission.formData?.expectedGrade || 'A') : null,
        notes: lecturerNotes,
        reviewedAt: new Date().toISOString(),
      };

      let nextStatus = SUBMISSION_STATUS.APPROVED;
      let title = 'Review Dosen: Rekomendasi Disetujui';
      let desc = `Dosen pengampu (${lecturerName}) menyetujui koreksi nilai ke grade ${reviewData.recommendedGrade}. Catatan: ${lecturerNotes}`;

      if (lecturerRec === 'REJECT') {
        nextStatus = SUBMISSION_STATUS.REJECTED;
        title = 'Review Dosen: Komplain Ditolak';
        desc = `Dosen pengampu (${lecturerName}) menolak komplain nilai. Alasan: ${lecturerNotes}`;
      } else if (lecturerRec === 'REQUEST_INFO') {
        nextStatus = SUBMISSION_STATUS.REVISION_REQUIRED;
        title = 'Review Dosen: Permintaan Klarifikasi Tambahan';
        desc = `Dosen pengampu (${lecturerName}) meminta dokumen/klarifikasi tambahan: ${lecturerNotes}`;
      }

      const updated = submissionService.updateStatus(
        submission.id,
        nextStatus,
        lecturerNotes,
        adminUser,
        {
          lecturerReview: reviewData,
          customTitle: title,
          customDescription: desc,
          actorName: lecturerName,
          actorRole: 'LECTURER',
        }
      );

      setSubmission(updated);
      setLecturerNotes('');
      setRecommendedGrade('');
      toast.success('Hasil telaah dosen pengampu berhasil dicatat ke sistem!');
    } catch {
      toast.error('Gagal menyimpan telaah dosen.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler for Authorized Academic Processing (Requirement 6: Final Grade Adjustment)
  const handleFinalizeGradeCorrection = async () => {
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const refNote = skNumber.trim()
        ? `SK Dekan No. ${skNumber}. Perubahan nilai resmi telah disahkan dan diubah pada pangkalan data akademik.`
        : 'Perubahan nilai resmi telah disahkan oleh Pejabat Akademik Berwenang dan disinkronkan ke KHS resmi.';

      const updated = submissionService.updateStatus(
        submission.id,
        SUBMISSION_STATUS.COMPLETED,
        refNote,
        adminUser,
        {
          customTitle: 'Penyesuaian Nilai Resmi Selesai',
          customDescription: refNote,
          actorName: 'Biro Administrasi Akademik (BAA)',
          actorRole: 'ACADEMIC_OFFICER',
        }
      );

      setSubmission(updated);
      setIsFinalizeModalOpen(false);
      setSkNumber('');
      toast.success(`Pengajuan ${updated.submissionNumber} telah diselesaikan secara resmi!`);
    } catch {
      toast.error('Gagal menyelesaikan penyesuaian nilai.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/submissions"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#3478E5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Kelola Pengajuan</span>
        </Link>

        <span className="text-xs text-slate-400">
          Status saat ini: <strong className="text-[#172033]">{submission.status}</strong>
        </span>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-bold text-[#172033]">
              Detail Verifikasi Pengajuan
            </h1>
            <StatusBadge status={submission.status} size="lg" />
          </div>
          <p className="font-mono text-sm font-bold text-[#3478E5]">
            #{submission.submissionNumber}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Waktu pengajuan: {formatDateTime(submission.createdAt)}
          </p>
        </div>

        {/* Quick action badges */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 px-4 text-xs">
          <span className="text-slate-400 block mb-0.5">Layanan Akademik:</span>
          <span className="font-bold text-[#172033]">{srv.title}</span>
        </div>
      </div>

      {/* Grid: Details on Left, Decision Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student Details, Grade Fields, Documents & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#172033] mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Profil Mahasiswa Pemohon</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Nama Lengkap:</span>
                <p className="font-bold text-[#172033] text-sm">{submission.studentName}</p>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Nomor Induk Mahasiswa (NIM):</span>
                <p className="font-mono font-bold text-[#3478E5] text-sm">
                  {submission.studentIdentifier}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Program Studi:</span>
                <p className="font-medium text-slate-800">
                  {submission.studentProgram || 'Teknik Informatika (S1)'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Email Mahasiswa:</span>
                <p className="font-medium text-slate-800">{submission.studentEmail}</p>
              </div>
            </div>
          </div>

          {/* Form Content / Rincian Formulir */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#172033] mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Isian Formulir Permohonan</span>
              </div>
              {isGrade && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {COMPLAINT_TYPES[submission.formData?.complaintType]?.label || 'Komplain Nilai'}
                </span>
              )}
            </h3>

            <div className="space-y-4 text-xs">
              {isGrade ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-50">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Mata Kuliah:</span>
                      <p className="font-bold text-[#172033] text-sm">
                        {submission.formData?.courseCode} - {submission.formData?.courseName}
                      </p>
                      {submission.formData?.courseClass && (
                        <span className="text-[11px] text-slate-500">
                          Kelas: {submission.formData.courseClass}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Dosen Pengampu:</span>
                      <p className="font-semibold text-slate-800 text-sm">
                        {submission.formData?.lecturerName}
                      </p>
                      <span className="text-[11px] text-slate-500">
                        Semester: {submission.formData?.academicSemester}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-50">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Nilai Saat Ini:</span>
                      <span className="inline-block px-3 py-1 rounded-lg font-mono font-bold text-sm bg-amber-100 text-amber-800">
                        {submission.formData?.currentGrade}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Nilai yang Diharapkan:</span>
                      <span className="inline-block px-3 py-1 rounded-lg font-mono font-bold text-sm bg-blue-100 text-blue-800">
                        {submission.formData?.expectedGrade || '-'}
                      </span>
                    </div>
                  </div>

                  <div className="pb-3 border-b border-slate-50">
                    <span className="text-slate-400 block mb-1">
                      Komponen Penilaian yang Dipermasalahkan:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(submission.formData?.assessmentComponents || []).map((c) => {
                        const label = ASSESSMENT_COMPONENTS.find((item) => item.id === c)?.label || c;
                        return (
                          <span
                            key={c}
                            className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200"
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pb-3 border-b border-slate-50">
                    <span className="text-slate-400 block mb-0.5">Alasan & Uraian Lengkap:</span>
                    <p className="font-medium text-slate-800 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed mt-1">
                      {submission.formData?.reason}
                    </p>
                  </div>
                </>
              ) : (
                Object.entries(submission.formData || {}).map(([key, val]) => {
                  if (typeof val === 'boolean') {
                    return (
                      <div key={key} className="pb-3 border-b border-slate-50">
                        <span className="text-slate-400 block mb-0.5">Pernyataan Kejujuran Data:</span>
                        <p className="font-semibold text-emerald-700">
                          {val ? '✓ Telah menyetujui pernyataan kebenaran data' : 'Tidak disetujui'}
                        </p>
                      </div>
                    );
                  }

                  const labels = {
                    semester: 'Semester Berjalan',
                    reason: 'Keperluan / Alasan Pengajuan',
                    contactNumber: 'Nomor Kontak',
                    researchTitle: 'Judul Penelitian',
                    targetInstitution: 'Instansi / Perusahaan Tujuan',
                    institutionAddress: 'Alamat Lokasi Riset',
                    researchPeriod: 'Periode Waktu Penelitian',
                    supervisorName: 'Dosen Pembimbing',
                    leaveSemester: 'Semester Mulai Cuti',
                    leaveDuration: 'Durasi Cuti Akademik',
                  };

                  return (
                    <div key={key} className="pb-3 border-b border-slate-50">
                      <span className="text-slate-400 block mb-0.5">{labels[key] || key}:</span>
                      <p className="font-medium text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">
                        {val || '-'}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Existing Lecturer Review Note if present */}
          {submission.lecturerReview && (
            <div className="bg-purple-50/70 rounded-3xl border border-purple-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-200">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-700" />
                  <h3 className="text-sm font-bold text-purple-950">
                    Hasil Telaah Dosen Pengampu
                  </h3>
                </div>
                <span className="text-[11px] text-purple-600">
                  {formatDateTime(submission.lecturerReview.reviewedAt)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
                <div>
                  <span className="text-purple-600 block mb-0.5">Dosen Penelaah:</span>
                  <p className="font-bold text-purple-950">{submission.lecturerReview.lecturerName}</p>
                </div>
                <div>
                  <span className="text-purple-600 block mb-0.5">Rekomendasi:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {submission.lecturerReview.recommendation === 'APPROVE'
                      ? `Disetujui (Grade Rekomendasi: ${submission.lecturerReview.recommendedGrade})`
                      : submission.lecturerReview.recommendation}
                  </span>
                </div>
              </div>

              <div className="text-xs">
                <span className="text-purple-600 block mb-1">Catatan Evaluasi Dosen:</span>
                <p className="p-3 bg-white rounded-xl border border-purple-100 text-purple-900 leading-relaxed italic">
                  "{submission.lecturerReview.notes}"
                </p>
              </div>
            </div>
          )}

          {/* Documents Checklist Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#172033]">
                Dokumen Pendukung Mahasiswa ({submission.documents?.length || 0})
              </h3>
              <span className="text-[11px] text-slate-400">Wajib diperiksa sebelum keputusan</span>
            </div>

            {submission.documents && submission.documents.length > 0 ? (
              <div className="space-y-3">
                {submission.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#172033] truncate max-w-xs sm:max-w-md">
                          {doc.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {formatFileSize(doc.size)} • Diunggah {formatDate(doc.uploadDate)}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Eye}
                      onClick={() => setPreviewDoc(doc)}
                      className="text-xs"
                    >
                      Lihat Dokumen
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Tidak ada dokumen yang dilampirkan.</p>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#172033] mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Riwayat Aktivitas & Perubahan Status</span>
            </h3>
            <Timeline activities={submission.timeline} />
          </div>
        </div>

        {/* Right Column: Workflow Action Box */}
        <div className="space-y-6">
          {/* LECTURER REVIEW STAGE ACTION PANEL (Requirement 6) */}
          {isGrade && submission.status === SUBMISSION_STATUS.LECTURER_REVIEW ? (
            <div className="bg-purple-50/70 border-2 border-purple-200 rounded-3xl p-6 shadow-md sticky top-24">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-bold text-purple-950">
                  Panel Review Dosen Pengampu
                </h3>
              </div>
              <p className="text-xs text-purple-800 mb-4 leading-relaxed">
                Berkas telah diverifikasi admin dan kini berada pada tahap evaluasi Dosen Pengampu ({submission.formData?.lecturerName || 'Dosen'}).
              </p>

              <form onSubmit={handleLecturerReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                    Rekomendasi Dosen Pengampu
                  </label>
                  <select
                    value={lecturerRec}
                    onChange={(e) => setLecturerRec(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-purple-200 bg-white text-xs font-medium text-[#172033] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="APPROVE">Setujui Rekomendasi Koreksi Nilai</option>
                    <option value="REJECT">Tolak Komplain (Nilai Sudah Sesuai)</option>
                    <option value="REQUEST_INFO">Minta Klarifikasi / Dokumen Tambahan</option>
                  </select>
                </div>

                {lecturerRec === 'APPROVE' && (
                  <div>
                    <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                      Rekomendasi Nilai Akhir yang Disetujui
                    </label>
                    <input
                      type="text"
                      value={recommendedGrade}
                      onChange={(e) => setRecommendedGrade(e.target.value.toUpperCase())}
                      placeholder={submission.formData?.expectedGrade || 'Contoh: A / B+ / 88.5'}
                      className="w-full px-3.5 py-2 rounded-xl border border-purple-200 bg-white text-xs font-mono font-bold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                    Catatan Evaluasi / Alasan Keputusan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={lecturerNotes}
                    onChange={(e) => setLecturerNotes(e.target.value)}
                    placeholder="Tuliskan catatan verifikasi lembar jawaban, rincian komponen nilai yang disesuaikan, atau alasan penolakan..."
                    className="w-full rounded-xl border border-purple-200 bg-white p-3 text-xs text-[#172033] focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="p-3 bg-white/70 rounded-xl border border-purple-100 text-[11px] text-purple-800 leading-relaxed">
                  ⚠️ <em>Catatan: Rekomendasi persetujuan dosen tidak secara otomatis mengubah basis data nilai resmi sebelum proses administrasi disahkan oleh Bagian Akademik.</em>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isProcessing}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-md"
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  <span>Kirim Hasil Telaah Dosen</span>
                </Button>
              </form>
            </div>
          ) : isGrade && submission.status === SUBMISSION_STATUS.APPROVED ? (
            /* AUTHORIZED ACADEMIC PROCESSING STAGE (Requirement 6) */
            <div className="bg-emerald-50/70 border-2 border-emerald-200 rounded-3xl p-6 shadow-md sticky top-24 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-emerald-950">
                  Pengesahan Akademik Resmi
                </h3>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Rekomendasi koreksi nilai dari Dosen Pengampu telah disetujui. Silakan selesaikan sinkronisasi nilai ke basis data pangkalan akademik (KHS).
              </p>

              <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nilai Awal:</span>
                  <span className="font-mono font-bold text-amber-700">{submission.formData?.currentGrade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nilai Rekomendasi:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {submission.lecturerReview?.recommendedGrade || submission.formData?.expectedGrade || 'A'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  Dosen: <strong>{submission.formData?.lecturerName}</strong>
                </div>
              </div>

              <Button
                variant="success"
                size="md"
                className="w-full font-semibold shadow-md"
                onClick={() => setIsFinalizeModalOpen(true)}
              >
                <CheckCheck className="w-4 h-4 mr-1.5" />
                <span>Finalisasi Perubahan Nilai (Completed)</span>
              </Button>
            </div>
          ) : (
            /* STANDARD / INITIAL ADMIN DECISION BOX */
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs sticky top-24">
              <h3 className="text-base font-bold text-[#172033] mb-1">Keputusan Administrasi</h3>
              <p className="text-xs text-slate-500 mb-5">
                Pilih tindakan untuk berkas #{submission.submissionNumber}
              </p>

              <form onSubmit={handleOpenConfirm} className="space-y-4">
                <div className="space-y-2.5">
                  {/* Standard Approve (or Dekanat approval) */}
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      decision === SUBMISSION_STATUS.APPROVED
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="decision"
                      value={SUBMISSION_STATUS.APPROVED}
                      checked={decision === SUBMISSION_STATUS.APPROVED}
                      onChange={(e) => {
                        setDecision(e.target.value);
                        setNoteError('');
                      }}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">
                        Setujui Pengajuan
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        {isGrade
                          ? 'Setujui hasil rekomendasi komplain nilai'
                          : 'Berkas lengkap & surat siap diterbitkan'}
                      </span>
                    </div>
                  </label>

                  {/* Request Revision */}
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      decision === SUBMISSION_STATUS.REVISION_REQUIRED
                        ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="decision"
                      value={SUBMISSION_STATUS.REVISION_REQUIRED}
                      checked={decision === SUBMISSION_STATUS.REVISION_REQUIRED}
                      onChange={(e) => {
                        setDecision(e.target.value);
                        setNoteError('');
                      }}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-orange-900 block">
                        Minta Revisi / Klarifikasi
                      </span>
                      <span className="text-[11px] text-orange-700">
                        Ada berkas/data yang perlu diperbaiki mahasiswa
                      </span>
                    </div>
                  </label>

                  {/* Reject */}
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      decision === SUBMISSION_STATUS.REJECTED
                        ? 'border-red-500 bg-red-50/50 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="decision"
                      value={SUBMISSION_STATUS.REJECTED}
                      checked={decision === SUBMISSION_STATUS.REJECTED}
                      onChange={(e) => {
                        setDecision(e.target.value);
                        setNoteError('');
                      }}
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-red-900 block">
                        Tolak Pengajuan
                      </span>
                      <span className="text-[11px] text-red-700">
                        Tidak memenuhi syarat / nilai sudah sesuai (Final)
                      </span>
                    </div>
                  </label>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1.5">
                    Catatan Admin{' '}
                    {decision === SUBMISSION_STATUS.REJECTED ||
                    decision === SUBMISSION_STATUS.REVISION_REQUIRED ? (
                      <span className="text-red-500">* (Wajib)</span>
                    ) : (
                      <span className="text-slate-400 font-normal">(Opsional)</span>
                    )}
                  </label>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => {
                      setNote(e.target.value);
                      if (e.target.value.trim()) setNoteError('');
                    }}
                    placeholder="Tuliskan catatan verifikasi atau alasan keputusan..."
                    className={`w-full rounded-xl border bg-white p-3 text-xs text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3478E5] focus:border-transparent ${
                      noteError ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {noteError && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">{noteError}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full font-semibold shadow-md"
                  disabled={!decision}
                >
                  <span>Proses Keputusan</span>
                  <Send className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Konfirmasi Keputusan Admin"
        maxWidth="max-w-md"
      >
        <div className="py-2 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Apakah Anda yakin ingin menetapkan status berkas{' '}
            <strong className="text-[#172033]">#{submission.submissionNumber}</strong> menjadi:
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Keputusan:</span>
              <StatusBadge status={decision} />
            </div>
            {note && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block mb-1">Catatan:</span>
                <p className="font-medium text-slate-800 italic">"{note}"</p>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400">
            * Aksi ini akan mencatat aktivitas pada timeline dan memperbarui status yang terlihat oleh mahasiswa pemohon.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsConfirmModalOpen(false)}
              disabled={isProcessing}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExecuteDecision}
              isLoading={isProcessing}
              className={
                decision === SUBMISSION_STATUS.APPROVED
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : decision === SUBMISSION_STATUS.REJECTED
                  ? 'bg-red-600 hover:bg-red-700'
                  : decision === SUBMISSION_STATUS.LECTURER_REVIEW
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              }
            >
              Konfirmasi & Simpan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Finalize Grade Correction Modal (Completed by Authorized Academic Officer) */}
      <Modal
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        title="Pengesahan Perubahan Nilai Resmi (BAA)"
        maxWidth="max-w-md"
      >
        <div className="py-2 space-y-4">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
            <p className="font-bold mb-1">Pemberitahuan Otoritas Akademik:</p>
            Tindakan ini akan mengesahkan perubahan nilai mata kuliah{' '}
            <strong>
              {submission.formData?.courseCode} - {submission.formData?.courseName}
            </strong>{' '}
            untuk mahasiswa <strong>{submission.studentName}</strong> dan menandai status pengajuan sebagai <strong>COMPLETED (Selesai)</strong>.
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1.5">
              Nomor Surat Keputusan (SK) Dekan / BAA (Opsional)
            </label>
            <input
              type="text"
              value={skNumber}
              onChange={(e) => setSkNumber(e.target.value)}
              placeholder="Contoh: 104/SK/BAA/KN/2026"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsFinalizeModalOpen(false)}
              disabled={isProcessing}
            >
              Batal
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={handleFinalizeGradeCorrection}
              isLoading={isProcessing}
            >
              Sahkan Perubahan Nilai
            </Button>
          </div>
        </div>
      </Modal>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        doc={previewDoc}
        submission={submission}
      />
    </div>
  );
}
