import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileEdit,
  ExternalLink,
  Info,
  Clock,
  UserCheck,
  CheckCheck,
  Award,
} from 'lucide-react';
import { submissionService } from '../../services/submissionService';
import {
  SERVICE_DETAILS,
  SERVICE_TYPES,
  SUBMISSION_STATUS,
  COMPLAINT_TYPES,
  ASSESSMENT_COMPONENTS,
} from '../../utils/constants';
import { formatDateTime, formatDate, formatFileSize } from '../../utils/formatters';
import StatusBadge from '../../components/ui/StatusBadge';
import Timeline from '../../components/ui/Timeline';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import DocumentViewerModal from '../../components/ui/DocumentViewerModal';
import { useToast } from '../../components/ui/Toast';

export default function SubmissionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const submission = submissionService.getById(id);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  if (!submission) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-auto mt-12 border border-slate-100 shadow-sm">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#172033]">Pengajuan Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Nomor berkas pengajuan yang Anda tuju tidak tersedia dalam riwayat sistem.
        </p>
        <Button variant="primary" size="md" onClick={() => navigate('/student/submissions')}>
          Kembali ke Riwayat
        </Button>
      </div>
    );
  }

  const srv = SERVICE_DETAILS[submission.serviceType] || {
    title: 'Layanan Kampus',
    slug: 'layanan',
    description: '',
  };

  const isGradeService = submission.serviceType === SERVICE_TYPES.GRADE_CORRECTION;

  const handleDownloadDemoDoc = () => {
    toast.success(
      `Mengunduh dokumen resmi ${isGradeService ? 'SK_Perubahan_Nilai' : 'Surat_Resmi'}_${submission.submissionNumber}.pdf (Demo Mode)...`
    );
    setDownloadModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/submissions"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#3478E5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat Pengajuan</span>
        </Link>

        <span className="text-xs text-slate-400">
          Terakhir diperbarui: {formatDateTime(submission.updatedAt)}
        </span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            isGradeService ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
          }`}>
            {isGradeService ? <Award className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-[#172033]">
                {srv.title}
              </h1>
              <StatusBadge status={submission.status} size="lg" />
            </div>
            <p className="font-mono text-sm text-[#3478E5] font-semibold">
              #{submission.submissionNumber}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Diajukan pada {formatDateTime(submission.createdAt)}
            </p>
          </div>
        </div>

        {/* Action button conditional on status */}
        <div className="flex flex-wrap items-center gap-3">
          {submission.status === SUBMISSION_STATUS.REVISION_REQUIRED && (
            <Button
              variant="primary"
              size="md"
              icon={FileEdit}
              onClick={() =>
                navigate(
                  `/student/services/${srv.slug}/new?edit=${submission.id}`
                )
              }
              className="bg-orange-600 hover:bg-orange-700 shadow-sm"
            >
              Perbaiki & Kirim Ulang
            </Button>
          )}

          {(submission.status === SUBMISSION_STATUS.APPROVED ||
            submission.status === SUBMISSION_STATUS.COMPLETED) && (
            <Button
              variant="primary"
              size="md"
              icon={Download}
              onClick={() => setDownloadModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 shadow-sm"
            >
              {isGradeService ? 'Unduh SK Perubahan Nilai' : 'Unduh Surat Resmi'}
            </Button>
          )}
        </div>
      </div>

      {/* Status Callout Banners */}

      {/* 1. Lecturer Review Banner */}
      {submission.status === SUBMISSION_STATUS.LECTURER_REVIEW && (
        <div className="bg-purple-50 border border-purple-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <UserCheck className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-purple-950">
                Tahap Peninjauan Dosen Pengampu (Lecturer Review)
              </h3>
              <p className="text-xs text-purple-800 mt-1 leading-relaxed">
                Pengajuan komplain/koreksi nilai Anda telah lolos verifikasi administrasi dan sedang ditelaah langsung oleh Dosen Pengampu mata kuliah:{' '}
                <strong>{submission.formData?.lecturerName || 'Dosen Pengampu'}</strong>.
              </p>
              <p className="text-[11px] text-purple-600 mt-2 font-medium">
                💡 Dosen akan memeriksa kembali arsip jawaban tugas/ujian Anda dan memberikan rekomendasi resmi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Completed Banner */}
      {submission.status === SUBMISSION_STATUS.COMPLETED && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Perubahan Nilai Resmi Telah Selesai Diproses (Completed)
              </h3>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                Proses koreksi nilai telah diverifikasi oleh Dosen Pengampu, disetujui pimpinan dekanat, dan disinkronkan ke dalam basis data akademik resmi kampus oleh Biro Administrasi Akademik (BAA).
              </p>
              {submission.adminNote && (
                <p className="text-xs text-emerald-900 mt-2 bg-emerald-100/60 p-2.5 rounded-xl">
                  <strong>Catatan Akademik:</strong> {submission.adminNote}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="success"
            size="sm"
            icon={Download}
            onClick={() => setDownloadModalOpen(true)}
            className="whitespace-nowrap flex-shrink-0"
          >
            Unduh Bukti SK
          </Button>
        </div>
      )}

      {/* 3. Revision Required Banner */}
      {submission.status === SUBMISSION_STATUS.REVISION_REQUIRED && (
        <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-orange-950">
                Pemberitahuan Revisi / Permintaan Klarifikasi Berkas
              </h3>
              <p className="text-xs text-orange-800 mt-1 leading-relaxed">
                {submission.adminNote || 'Admin atau Dosen memerlukan dokumen atau klarifikasi tambahan untuk memproses permohonan Anda.'}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              navigate(`/student/services/${srv.slug}/new?edit=${submission.id}`)
            }
            className="bg-orange-600 hover:bg-orange-700 whitespace-nowrap flex-shrink-0"
          >
            Lakukan Revisi Sekarang
          </Button>
        </div>
      )}

      {/* 4. Rejected Banner */}
      {submission.status === SUBMISSION_STATUS.REJECTED && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex items-start gap-3">
          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-red-950">
              Pengajuan Tidak Disetujui
            </h3>
            <p className="text-xs text-red-800 mt-1 leading-relaxed">
              {submission.adminNote || 'Mohon maaf, permohonan ini tidak dapat disetujui setelah dilakukan peninjauan berkas dan konfirmasi dosen.'}
            </p>
            <p className="text-[11px] text-red-600 mt-2 font-medium">
              * Status penolakan bersifat final untuk nomor pengajuan ini. Silakan berkonsultasi langsung dengan dosen pengampu jika diperlukan penjelasan lebih lanjut.
            </p>
          </div>
        </div>
      )}

      {/* 5. Approved Banner */}
      {submission.status === SUBMISSION_STATUS.APPROVED && !isGradeService && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Pengajuan Telah Resmi Disahkan
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                {submission.adminNote || 'Dokumen surat telah diverifikasi dan siap diunduh atau dicetak secara digital.'}
              </p>
            </div>
          </div>
          <Button
            variant="success"
            size="sm"
            icon={Download}
            onClick={() => setDownloadModalOpen(true)}
            className="whitespace-nowrap flex-shrink-0"
          >
            Unduh Berkas
          </Button>
        </div>
      )}

      {/* Grid: Details & Vertical Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Details, Lecturer Review Card & Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submission Data Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs">
            <h3 className="text-base font-bold text-[#172033] mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Rincian Informasi Pengajuan</span>
              {isGradeService && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {COMPLAINT_TYPES[submission.formData?.complaintType]?.label || 'Komplain Nilai'}
                </span>
              )}
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-50">
                <div>
                  <span className="text-slate-400 block mb-0.5">Nama Pemohon:</span>
                  <p className="font-bold text-[#172033]">{submission.studentName}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">NIM:</span>
                  <p className="font-bold text-[#172033]">{submission.studentIdentifier}</p>
                </div>
              </div>

              {/* Specific display for Grade Correction vs others */}
              {isGradeService ? (
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
                      <span className="text-slate-400 block mb-0.5">Nilai Tercantum Saat Ini:</span>
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
                    <span className="text-slate-400 block mb-1">Komponen Penilaian yang Dipermasalahkan:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(submission.formData?.assessmentComponents || []).map((c) => {
                        const label = ASSESSMENT_COMPONENTS.find((item) => item.id === c)?.label || c;
                        return (
                          <span key={c} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200">
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
                /* Non-grade regular fields */
                Object.entries(submission.formData || {}).map(([key, val]) => {
                  if (typeof val === 'boolean') {
                    return (
                      <div key={key} className="pb-3 border-b border-slate-50">
                        <span className="text-slate-400 block mb-0.5">Persetujuan:</span>
                        <p className="font-semibold text-slate-800">
                          {val ? 'Menyetujui syarat dan ketentuan' : 'Tidak disetujui'}
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
                    researchPeriod: 'Periode Penelitian',
                    supervisorName: 'Dosen Pembimbing',
                    leaveSemester: 'Semester Mulai Cuti',
                    leaveDuration: 'Durasi Cuti Akademik',
                  };

                  return (
                    <div key={key} className="pb-3 border-b border-slate-50">
                      <span className="text-slate-400 block mb-0.5">
                        {labels[key] || key}:
                      </span>
                      <p className="font-semibold text-slate-800 text-xs sm:text-sm">
                        {val || '-'}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Lecturer Review Result Card (If reviewed by lecturer) */}
          {submission.lecturerReview && (
            <div className="bg-purple-50/60 rounded-3xl border border-purple-200 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-200">
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

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-purple-600 block mb-0.5">Dosen Penilai:</span>
                    <p className="font-bold text-purple-950 text-sm">
                      {submission.lecturerReview.lecturerName}
                    </p>
                  </div>
                  <div>
                    <span className="text-purple-600 block mb-0.5">Rekomendasi Dosen:</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                      submission.lecturerReview.recommendation === 'APPROVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : submission.lecturerReview.recommendation === 'REJECT'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {submission.lecturerReview.recommendation === 'APPROVE'
                        ? `Disetujui (Rekomendasi Nilai: ${submission.lecturerReview.recommendedGrade || 'Grade Baru'})`
                        : submission.lecturerReview.recommendation === 'REJECT'
                        ? 'Permohonan Ditolak'
                        : 'Memerlukan Klarifikasi Tambahan'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-purple-600 block mb-1 font-semibold">
                    Catatan Evaluasi Substansi:
                  </span>
                  <div className="p-3 bg-white/80 rounded-xl border border-purple-100 text-purple-900 leading-relaxed font-medium">
                    "{submission.lecturerReview.notes}"
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Uploaded Documents Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs">
            <h3 className="text-base font-bold text-[#172033] mb-4 pb-3 border-b border-slate-100">
              Dokumen Terlampir ({submission.documents?.length || 0})
            </h3>

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

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-xs transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Tidak ada berkas yang diunggah.</p>
            )}
          </div>
        </div>

        {/* Right Column: Status Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs">
            <h3 className="text-base font-bold text-[#172033] mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Timeline Pelacakan Berkas</span>
            </h3>

            <Timeline activities={submission.timeline} />
          </div>

          {/* Quick Help Card */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-3xl border border-slate-200 p-5 text-xs text-slate-600">
            <h4 className="font-bold text-[#172033] mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Ketentuan Layanan</span>
            </h4>
            <p className="leading-relaxed">
              {isGradeService
                ? 'Perubahan nilai resmi hanya sah setelah SK diterbitkan oleh Biro Administrasi Akademik (BAA). Rekomendasi dosen pengampu menjadi dasar penetapan keputusan akademik.'
                : 'Jika proses verifikasi memakan waktu lebih dari 3 hari kerja, silakan hubungi Biro Administrasi Akademik melalui WhatsApp Center: 0812-3456-7890.'}
            </p>
          </div>
        </div>
      </div>

      {/* Download Surat Modal */}
      <Modal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        title={isGradeService ? 'Unduh SK Perubahan Nilai Resmi' : 'Unduh Dokumen Surat Resmi'}
        maxWidth="max-w-md"
      >
        <div className="text-center py-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-[#172033] mb-1">
            {srv.title}
          </h4>
          <p className="text-xs text-slate-500 mb-6">
            Dokumen sah bernomor registrasi <strong>{submission.submissionNumber}</strong> siap diunduh dalam format PDF resmi dengan tanda tangan elektronik kampus.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs text-slate-600 space-y-1 mb-6">
            <div className="flex justify-between">
              <span className="text-slate-400">Penerbit:</span>
              <span className="font-semibold text-slate-700">Biro Akademik (BAA)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Format:</span>
              <span className="font-semibold text-slate-700">PDF (Digital Signed)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ukuran:</span>
              <span className="font-semibold text-slate-700">210 KB</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              className="w-1/2"
              onClick={() => setDownloadModalOpen(false)}
            >
              Tutup
            </Button>
            <Button
              variant="success"
              size="md"
              className="w-1/2"
              icon={Download}
              onClick={handleDownloadDemoDoc}
            >
              Unduh PDF
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
