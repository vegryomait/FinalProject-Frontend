import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  AlertCircle,
  FileCheck,
  Send,
  ArrowRight,
  ShieldAlert,
  Award,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { submissionService } from '../../services/submissionService';
import {
  SERVICE_DETAILS,
  SERVICE_TYPES,
  SUBMISSION_STATUS,
  COMPLAINT_TYPES,
  ASSESSMENT_COMPONENTS,
} from '../../utils/constants';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import FileUploader from '../../components/ui/FileUploader';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

export default function SubmissionFormPage() {
  const { serviceType } = useParams();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();
  const toast = useToast();
  const user = authService.getCurrentUser();

  // Resolve service configuration by slug or id
  const serviceKey = Object.keys(SERVICE_DETAILS).find(
    (key) =>
      SERVICE_DETAILS[key].slug === serviceType ||
      SERVICE_DETAILS[key].id === serviceType
  );
  const currentService = serviceKey ? SERVICE_DETAILS[serviceKey] : null;

  // Step state: 1 = Form, 2 = Review, 3 = Completed
  const [step, setStep] = useState(1);

  // Form Fields State
  const [formData, setFormData] = useState({
    // Surat Aktif Kuliah
    semester: 'Genap 2025/2026',
    reason: '',
    contactNumber: '',

    // Surat Penelitian
    researchTitle: '',
    targetInstitution: '',
    institutionAddress: '',
    researchPeriod: '',
    supervisorName: '',

    // Cuti Akademik
    leaveSemester: 'Genap 2025/2026',
    leaveDuration: '1 Semester',
    statementAgreed: false,

    // Komplain & Koreksi Nilai
    complaintType: 'KOMPLAIN_NILAI',
    academicSemester: 'Genap 2025/2026',
    courseCode: '',
    courseName: '',
    lecturerName: '',
    courseClass: '',
    currentGrade: '',
    expectedGrade: '',
    assessmentComponents: [],
    gradeDiscrepancyReason: '',
    confirmed: false,
  });

  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSubmission, setSubmittedSubmission] = useState(null);
  const [existingSubmission, setExistingSubmission] = useState(null);

  // If editing an existing revision submission
  useEffect(() => {
    if (editId) {
      const existing = submissionService.getById(editId);
      if (existing) {
        if (existing.status !== SUBMISSION_STATUS.REVISION_REQUIRED) {
          toast.warning('Pengajuan ini tidak dalam status perlu revisi.');
        }
        setExistingSubmission(existing);
        setFormData((prev) => ({
          ...prev,
          ...existing.formData,
        }));
        setDocuments(existing.documents || []);
      }
    }
  }, [editId]);

  if (!currentService) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center max-w-lg mx-auto mt-12 border border-slate-200 shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#172033]">Layanan Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          Jenis layanan administrasi yang Anda tuju tidak valid atau telah dinonaktifkan.
        </p>
        <Button variant="primary" onClick={() => navigate('/student/services')}>
          Kembali ke Katalog
        </Button>
      </div>
    );
  }

  const handleComponentToggle = (compKey) => {
    const list = formData.assessmentComponents || [];
    if (list.includes(compKey)) {
      setFormData({
        ...formData,
        assessmentComponents: list.filter((c) => c !== compKey),
      });
    } else {
      setFormData({
        ...formData,
        assessmentComponents: [...list, compKey],
      });
    }
  };

  const validateForm = () => {
    const errs = {};

    if (currentService.id === SERVICE_TYPES.ACTIVE_STUDENT) {
      if (!formData.semester) errs.semester = 'Semester aktif wajib dipilih.';
      if (!formData.reason.trim()) errs.reason = 'Keperluan / alasan pengajuan wajib diisi.';
    }

    if (currentService.id === SERVICE_TYPES.RESEARCH_LETTER) {
      if (!formData.researchTitle.trim()) errs.researchTitle = 'Judul penelitian wajib diisi.';
      if (!formData.targetInstitution.trim()) errs.targetInstitution = 'Nama instansi tujuan wajib diisi.';
      if (!formData.researchPeriod.trim()) errs.researchPeriod = 'Periode waktu penelitian wajib diisi.';
    }

    if (currentService.id === SERVICE_TYPES.ACADEMIC_LEAVE) {
      if (!formData.leaveSemester) errs.leaveSemester = 'Semester cuti wajib dipilih.';
      if (!formData.reason.trim()) errs.reason = 'Alasan permohonan cuti wajib diisi.';
      if (!formData.statementAgreed) errs.statementAgreed = 'Anda harus menyetujui pernyataan kebenaran data.';
    }

    if (currentService.id === SERVICE_TYPES.GRADE_CORRECTION) {
      if (!formData.academicSemester) errs.academicSemester = 'Semester akademik wajib dipilih.';
      if (!formData.courseCode.trim()) errs.courseCode = 'Kode mata kuliah wajib diisi.';
      if (!formData.courseName.trim()) errs.courseName = 'Nama mata kuliah wajib diisi.';
      if (!formData.lecturerName.trim()) errs.lecturerName = 'Nama dosen pengampu wajib diisi.';
      if (!formData.currentGrade.trim()) errs.currentGrade = 'Nilai saat ini wajib diisi/dipilih.';
      if (!formData.assessmentComponents || formData.assessmentComponents.length === 0) {
        errs.assessmentComponents = 'Pilih minimal satu komponen penilaian yang dipertanyakan.';
      }
      if (!formData.reason.trim()) {
        errs.reason = 'Alasan dan penjelasan detail komplain/koreksi wajib diisi.';
      }
      if (!formData.confirmed) {
        errs.confirmed = 'Konfirmasi kebenaran data pengajuan wajib disetujui.';
      }
    }

    if (documents.length === 0) {
      errs.documents = 'Minimal satu dokumen pendukung harus diunggah.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextToReview = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Mohon lengkapi seluruh field yang wajib diisi.');
    }
  };

  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600)); // simulate brief network delay

      let result;
      if (existingSubmission) {
        result = submissionService.resubmit(
          existingSubmission.id,
          formData,
          documents,
          user
        );
        toast.success('Pengajuan berhasil diperbaiki dan dikirim ulang!');
      } else {
        result = submissionService.create(
          user,
          currentService.id,
          formData,
          documents
        );
        toast.success('Pengajuan berhasil dikirim!');
      }

      setSubmittedSubmission(result);
      setStep(3); // success modal
    } catch {
      toast.error('Gagal memproses pengajuan. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/services"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#3478E5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Layanan</span>
        </Link>

        {existingSubmission && (
          <span className="text-xs font-semibold bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
            Mode Perbaikan Pengajuan (#{existingSubmission.submissionNumber})
          </span>
        )}
      </div>

      {/* Stepper Progress */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 1
                  ? 'bg-[#3478E5] text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              1
            </div>
            <span
              className={`text-xs font-semibold ${
                step >= 1 ? 'text-[#172033]' : 'text-slate-400'
              }`}
            >
              Isi Formulir
            </span>
          </div>

          <div
            className={`flex-1 h-0.5 mx-4 ${
              step >= 2 ? 'bg-[#3478E5]' : 'bg-slate-200'
            }`}
          />

          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 2
                  ? 'bg-[#3478E5] text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              2
            </div>
            <span
              className={`text-xs font-semibold ${
                step >= 2 ? 'text-[#172033]' : 'text-slate-400'
              }`}
            >
              Review Data
            </span>
          </div>

          <div
            className={`flex-1 h-0.5 mx-4 ${
              step >= 3 ? 'bg-[#3478E5]' : 'bg-slate-200'
            }`}
          />

          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 3
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              3
            </div>
            <span
              className={`text-xs font-semibold ${
                step >= 3 ? 'text-[#172033]' : 'text-slate-400'
              }`}
            >
              Selesai
            </span>
          </div>
        </div>
      </div>

      {/* Revision Notice Banner if in Revision mode */}
      {existingSubmission && existingSubmission.adminNote && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-orange-900 mb-1">Catatan Revisi dari Admin / Dosen:</p>
            <p className="text-orange-800 leading-relaxed">{existingSubmission.adminNote}</p>
            <p className="text-orange-600 mt-2 italic">
              Silakan perbaiki data atau unggah dokumen pendukung baru di bawah ini.
            </p>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-xs">
        <div className="border-b border-slate-100 pb-5 mb-6">
          <h2 className="text-xl font-bold text-[#172033]">
            {existingSubmission ? 'Perbaiki Pengajuan: ' : 'Formulir Pengajuan: '}
            <span className="text-[#3478E5]">{currentService.title}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">{currentService.description}</p>
        </div>

        {/* STEP 1: FORM INPUT */}
        {step === 1 && (
          <form onSubmit={handleNextToReview} className="space-y-6">
            {/* Student Read-Only Info */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Nama Mahasiswa:</span>
                <p className="font-bold text-[#172033] mt-0.5">{user?.name}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">NIM / Identitas:</span>
                <p className="font-bold text-[#172033] mt-0.5">{user?.identifier}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Program Studi:</span>
                <p className="font-bold text-[#172033] mt-0.5">{user?.program || '-'}</p>
              </div>
            </div>

            {/* CONDITIONAL FIELDS BASED ON SERVICE TYPE */}

            {/* 1. SURAT AKTIF KULIAH */}
            {currentService.id === SERVICE_TYPES.ACTIVE_STUDENT && (
              <div className="space-y-4">
                <Select
                  label="Semester Berjalan"
                  required
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  options={[
                    { value: 'Ganjil 2025/2026', label: 'Semester Ganjil 2025/2026' },
                    { value: 'Genap 2025/2026', label: 'Semester Genap 2025/2026' },
                    { value: 'Ganjil 2026/2027', label: 'Semester Ganjil 2026/2027' },
                  ]}
                  error={errors.semester}
                />

                <div>
                  <label className="block text-sm font-medium text-[#172033] mb-1.5">
                    Alasan / Keperluan Pengajuan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Jelaskan untuk keperluan apa surat ini diajukan (misal: syarat beasiswa, tunjangan gaji orang tua, visa, dll)..."
                    className={`w-full rounded-xl border bg-white p-3 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3478E5] focus:border-transparent ${
                      errors.reason ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.reason && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.reason}</p>
                  )}
                </div>

                <Input
                  label="Nomor Telepon / WhatsApp (Opsional)"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  helperText="Untuk memudahkan konfirmasi admin jika terdapat data kurang jelas."
                />
              </div>
            )}

            {/* 2. SURAT PENELITIAN */}
            {currentService.id === SERVICE_TYPES.RESEARCH_LETTER && (
              <div className="space-y-4">
                <Input
                  label="Judul / Topik Penelitian"
                  required
                  value={formData.researchTitle}
                  onChange={(e) => setFormData({ ...formData, researchTitle: e.target.value })}
                  placeholder="Masukkan judul riset atau topik tugas akhir..."
                  error={errors.researchTitle}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nama Instansi / Perusahaan Tujuan"
                    required
                    value={formData.targetInstitution}
                    onChange={(e) => setFormData({ ...formData, targetInstitution: e.target.value })}
                    placeholder="Contoh: PT Telekomunikasi Indonesia"
                    error={errors.targetInstitution}
                  />

                  <Input
                    label="Periode / Durasi Penelitian"
                    required
                    value={formData.researchPeriod}
                    onChange={(e) => setFormData({ ...formData, researchPeriod: e.target.value })}
                    placeholder="Contoh: 01 Des 2026 - 28 Feb 2027"
                    error={errors.researchPeriod}
                  />
                </div>

                <Input
                  label="Alamat Instansi / Lokasi Penelitian (Opsional)"
                  value={formData.institutionAddress}
                  onChange={(e) => setFormData({ ...formData, institutionAddress: e.target.value })}
                  placeholder="Contoh: Jl. Gegerkalong Hilir No. 47, Bandung"
                />

                <Input
                  label="Nama Dosen Pembimbing (Opsional)"
                  value={formData.supervisorName}
                  onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                  placeholder="Contoh: Dr. Eng. Ir. Hendra Gunawan, M.T."
                />
              </div>
            )}

            {/* 3. CUTI AKADEMIK */}
            {currentService.id === SERVICE_TYPES.ACADEMIC_LEAVE && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Semester Mulai Cuti"
                    required
                    value={formData.leaveSemester}
                    onChange={(e) => setFormData({ ...formData, leaveSemester: e.target.value })}
                    options={[
                      { value: 'Genap 2025/2026', label: 'Genap 2025/2026' },
                      { value: 'Ganjil 2026/2027', label: 'Ganjil 2026/2027' },
                    ]}
                    error={errors.leaveSemester}
                  />

                  <Select
                    label="Durasi Cuti Akademik"
                    required
                    value={formData.leaveDuration}
                    onChange={(e) => setFormData({ ...formData, leaveDuration: e.target.value })}
                    options={[
                      { value: '1 Semester', label: '1 Semester' },
                      { value: '2 Semester', label: '2 Semester (Maksimal)' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#172033] mb-1.5">
                    Alasan Lengkap Pengajuan Cuti <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Jelaskan alasan pengajuan cuti akademik secara rinci..."
                    className={`w-full rounded-xl border bg-white p-3 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3478E5] focus:border-transparent ${
                      errors.reason ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.reason && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.reason}</p>
                  )}
                </div>

                {/* Agreement Checkbox */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.statementAgreed}
                      onChange={(e) =>
                        setFormData({ ...formData, statementAgreed: e.target.checked })
                      }
                      className="mt-1 w-4 h-4 rounded text-[#3478E5] focus:ring-[#3478E5] border-slate-300"
                    />
                    <span className="text-xs text-slate-700 leading-relaxed select-none">
                      Saya menyatakan dengan sesungguhnya bahwa alasan cuti akademik yang saya
                      berikan adalah benar dan bersedia mematuhi segala ketentuan akademik yang
                      berlaku di kampus.
                    </span>
                  </label>
                  {errors.statementAgreed && (
                    <p className="mt-2 text-xs text-red-600 font-medium">
                      {errors.statementAgreed}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 4. KOMPLAIN NILAI / PERUBAHAN NILAI (NEW SERVICE) */}
            {currentService.id === SERVICE_TYPES.GRADE_CORRECTION && (
              <div className="space-y-6">
                {/* B. Jenis Pengajuan */}
                <div>
                  <label className="block text-sm font-semibold text-[#172033] mb-2">
                    B. Jenis Pengajuan <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.values(COMPLAINT_TYPES).map((type) => {
                      const isSelected = formData.complaintType === type.id;
                      return (
                        <div
                          key={type.id}
                          onClick={() => setFormData({ ...formData, complaintType: type.id })}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#3478E5] bg-blue-50/50 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <input
                              type="radio"
                              name="complaintType"
                              value={type.id}
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 text-[#3478E5] focus:ring-[#3478E5]"
                            />
                            <span className="font-bold text-sm text-[#172033]">{type.label}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed pl-6">
                            {type.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* A. Informasi Mata Kuliah */}
                <div className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    A. Informasi Mata Kuliah
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Semester Akademik"
                      required
                      value={formData.academicSemester}
                      onChange={(e) => setFormData({ ...formData, academicSemester: e.target.value })}
                      options={[
                        { value: 'Ganjil 2025/2026', label: 'Semester Ganjil 2025/2026' },
                        { value: 'Genap 2025/2026', label: 'Semester Genap 2025/2026' },
                        { value: 'Ganjil 2026/2027', label: 'Semester Ganjil 2026/2027' },
                      ]}
                      error={errors.academicSemester}
                    />

                    <Input
                      label="Kode Mata Kuliah"
                      required
                      value={formData.courseCode}
                      onChange={(e) => setFormData({ ...formData, courseCode: e.target.value.toUpperCase() })}
                      placeholder="Contoh: IF3102 / SI2104"
                      error={errors.courseCode}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <Input
                        label="Nama Mata Kuliah"
                        required
                        value={formData.courseName}
                        onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                        placeholder="Contoh: Rekayasa Perangkat Lunak"
                        error={errors.courseName}
                      />
                    </div>
                    <div>
                      <Input
                        label="Kelas (Opsional)"
                        value={formData.courseClass}
                        onChange={(e) => setFormData({ ...formData, courseClass: e.target.value.toUpperCase() })}
                        placeholder="Contoh: IF-44-01"
                      />
                    </div>
                  </div>

                  <Input
                    label="Nama Dosen Pengampu"
                    required
                    value={formData.lecturerName}
                    onChange={(e) => setFormData({ ...formData, lecturerName: e.target.value })}
                    placeholder="Contoh: Dr. Ir. Bambang Hidayat, M.Sc."
                    error={errors.lecturerName}
                    helperText="Dosen pengampu utama yang mengampu mata kuliah ini untuk diteruskan verifikasi."
                  />
                </div>

                {/* C. Informasi Nilai */}
                <div className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    C. Informasi Nilai
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Nilai Saat Ini (Tercantum)"
                      required
                      value={formData.currentGrade}
                      onChange={(e) => setFormData({ ...formData, currentGrade: e.target.value })}
                      placeholder="Pilih nilai saat ini..."
                      options={[
                        { value: 'A', label: 'A (Sangat Baik / 4.0)' },
                        { value: 'A-', label: 'A- (3.7)' },
                        { value: 'B+', label: 'B+ (3.3)' },
                        { value: 'B', label: 'B (Baik / 3.0)' },
                        { value: 'B-', label: 'B- (2.7)' },
                        { value: 'C+', label: 'C+ (2.3)' },
                        { value: 'C', label: 'C (Cukup / 2.0)' },
                        { value: 'D', label: 'D (Kurang / 1.0)' },
                        { value: 'E', label: 'E (Gagal / 0.0)' },
                        { value: 'BL', label: 'BL (Belum Lengkap / Tunda)' },
                        { value: 'KOSONG', label: 'Nilai Belum Keluar / Kosong' },
                      ]}
                      error={errors.currentGrade}
                    />

                    <Input
                      label="Nilai yang Diharapkan (Opsional)"
                      value={formData.expectedGrade}
                      onChange={(e) => setFormData({ ...formData, expectedGrade: e.target.value.toUpperCase() })}
                      placeholder="Contoh: A / B+ / Nilai Angka 85"
                      helperText="Estimasi nilai berdasarkan kalkulasi akumulasi asesmen Anda."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#172033] mb-2">
                      Komponen Penilaian yang Dipermasalahkan <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ASSESSMENT_COMPONENTS.map((comp) => {
                        const isChecked = (formData.assessmentComponents || []).includes(comp.id);
                        return (
                          <label
                            key={comp.id}
                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-blue-50 border-[#3478E5] text-[#17365D] font-semibold'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleComponentToggle(comp.id)}
                              className="w-4 h-4 rounded text-[#3478E5] focus:ring-[#3478E5] border-slate-300"
                            />
                            <span>{comp.label}</span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.assessmentComponents && (
                      <p className="mt-1.5 text-xs text-red-600 font-medium">
                        {errors.assessmentComponents}
                      </p>
                    )}
                  </div>
                </div>

                {/* D. Alasan Pengajuan */}
                <div>
                  <label className="block text-sm font-semibold text-[#172033] mb-1.5">
                    D. Alasan dan Penjelasan Pengajuan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Jelaskan secara rinci alasan komplain atau rincian kesalahan perhitungan nilai (misal: nilai tugas 1 belum masuk, nilai ujian di LMS 85 tapi tercatat C+, dll)..."
                    className={`w-full rounded-xl border bg-white p-3.5 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3478E5] focus:border-transparent ${
                      errors.reason ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    💡 Harap sertakan informasi yang jelas, objektif, dan faktual agar mempermudah verifikasi admin dan dosen pengampu.
                  </p>
                  {errors.reason && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.reason}</p>
                  )}
                </div>

                {/* F. Confirmation Checkbox */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.confirmed}
                      onChange={(e) => setFormData({ ...formData, confirmed: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded text-[#3478E5] focus:ring-[#3478E5] border-slate-300"
                    />
                    <span className="text-xs text-slate-700 leading-relaxed select-none">
                      Saya menyatakan dengan sesungguhnya bahwa bukti dan rincian komplain/koreksi nilai yang saya ajukan adalah benar dan dapat dipertanggungjawabkan sesuai etika akademik yang berlaku.
                    </span>
                  </label>
                  {errors.confirmed && (
                    <p className="mt-2 text-xs text-red-600 font-medium">{errors.confirmed}</p>
                  )}
                </div>
              </div>
            )}

            {/* Document Uploader */}
            <div className="pt-4 border-t border-slate-100">
              <FileUploader
                label="Unggah Berkas Pendukung"
                required
                files={documents}
                onChange={setDocuments}
                helperText={
                  currentService.id === SERVICE_TYPES.GRADE_CORRECTION
                    ? 'Unggah tangkapan layar nilai portal/LMS, bukti tugas, lembar jawaban ujian, presensi (PDF, JPG, PNG maks 5MB)'
                    : 'Unggah KRS, proposal, surat rekomendasi, atau surat izin resmi (PDF, JPG, PNG maks 5MB)'
                }
              />
              {errors.documents && (
                <p className="mt-2 text-xs text-red-600 font-medium">{errors.documents}</p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/student/services')}
              >
                Batal
              </Button>

              <Button type="submit" variant="primary" size="md">
                <span>Lanjutkan ke Review</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: REVIEW SUMMARY */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-800 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span>
                Periksa kembali data Anda sebelum mengirimkan pengajuan. Anda masih dapat kembali ke formulir jika ada yang perlu diperbaiki.
              </span>
            </div>

            {/* Summary Data Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-slate-400">Jenis Layanan:</span>
                  <p className="text-sm font-bold text-[#172033] mt-0.5">
                    {currentService.title}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Nama Pemohon:</span>
                  <p className="text-sm font-bold text-[#172033] mt-0.5">
                    {user?.name} ({user?.identifier})
                  </p>
                </div>
              </div>

              {/* Service specific reviews */}
              {currentService.id === SERVICE_TYPES.ACTIVE_STUDENT && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400">Semester:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{formData.semester}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">No. Kontak:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {formData.contactNumber || '-'}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400">Keperluan / Alasan:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{formData.reason}</p>
                  </div>
                </div>
              )}

              {currentService.id === SERVICE_TYPES.RESEARCH_LETTER && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <span className="text-slate-400">Judul Penelitian:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {formData.researchTitle}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Instansi Tujuan:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {formData.targetInstitution}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Periode Penelitian:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {formData.researchPeriod}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Alamat Instansi:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {formData.institutionAddress || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Dosen Pembimbing:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {formData.supervisorName || '-'}
                    </p>
                  </div>
                </div>
              )}

              {currentService.id === SERVICE_TYPES.ACADEMIC_LEAVE && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400">Semester Cuti:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {formData.leaveSemester}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Durasi:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {formData.leaveDuration}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400">Alasan Cuti:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{formData.reason}</p>
                  </div>
                </div>
              )}

              {currentService.id === SERVICE_TYPES.GRADE_CORRECTION && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400">Jenis Permohonan:</span>
                    <p className="font-bold text-[#172033] mt-0.5">
                      {COMPLAINT_TYPES[formData.complaintType]?.label || formData.complaintType}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Semester Akademik:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {formData.academicSemester}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Mata Kuliah:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {formData.courseCode} - {formData.courseName}
                      {formData.courseClass ? ` (Kelas ${formData.courseClass})` : ''}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Dosen Pengampu:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {formData.lecturerName}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Nilai Saat Ini:</span>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-800">
                      {formData.currentGrade}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Nilai yang Diharapkan:</span>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded font-mono font-bold bg-blue-100 text-blue-800">
                      {formData.expectedGrade || '-'}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block mb-1">Komponen yang Dipermasalahkan:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(formData.assessmentComponents || []).map((c) => {
                        const label = ASSESSMENT_COMPONENTS.find((item) => item.id === c)?.label || c;
                        return (
                          <span key={c} className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[11px] font-medium">
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400">Alasan Lengkap Pengajuan:</span>
                    <p className="font-semibold text-slate-800 mt-0.5 whitespace-pre-wrap">
                      {formData.reason}
                    </p>
                  </div>
                </div>
              )}

              {/* Uploaded Documents List */}
              <div className="pt-3 border-t border-slate-200">
                <span className="text-slate-400 block mb-2">Dokumen Pendukung Terlampir:</span>
                <div className="space-y-1.5">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200"
                    >
                      <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="font-medium text-slate-800 truncate">{doc.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span>Kembali Edit</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleSubmitFinal}
                isLoading={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="w-4 h-4 mr-1" />
                <span>Kirim Pengajuan</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* STEP 3: SUCCESS MODAL */}
      <Modal
        isOpen={step === 3}
        onClose={() => navigate('/student/submissions')}
        showClose={false}
        maxWidth="max-w-md"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-bold text-[#172033] mb-1">Pengajuan Berhasil!</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6 leading-relaxed">
            Pengajuan Anda telah berhasil dikirim ke bagian tata usaha administrasi untuk diverifikasi.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6">
            <span className="text-[11px] text-slate-400 block">Nomor Pengajuan:</span>
            <span className="text-base font-mono font-bold text-[#3478E5]">
              {submittedSubmission?.submissionNumber || 'SSMS-2026-XXXX'}
            </span>
          </div>

          <div className="space-y-2">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() =>
                navigate(
                  submittedSubmission
                    ? `/student/submissions/${submittedSubmission.id}`
                    : '/student/submissions'
                )
              }
            >
              Lihat Detail & Status Tracking
            </Button>

            <Button
              variant="ghost"
              size="md"
              className="w-full text-slate-600"
              onClick={() => navigate('/student/dashboard')}
            >
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
