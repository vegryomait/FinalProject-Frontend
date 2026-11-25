export const APP_NAME = "Student Service Management System";
export const APP_SHORT_NAME = "SSMS";

export const USER_ROLES = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
};

export const SUBMISSION_STATUS = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  LECTURER_REVIEW: 'LECTURER_REVIEW',
  REVISION_REQUIRED: 'REVISION_REQUIRED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
};

export const STATUS_CONFIG = {
  [SUBMISSION_STATUS.PENDING]: {
    label: 'Menunggu',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500',
    color: '#D97706',
    bgColor: '#FEF3C7',
    icon: 'Clock',
  },
  [SUBMISSION_STATUS.UNDER_REVIEW]: {
    label: 'Sedang Ditinjau',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    dotClass: 'bg-blue-600',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    icon: 'Search',
  },
  [SUBMISSION_STATUS.LECTURER_REVIEW]: {
    label: 'Review Dosen',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    dotClass: 'bg-purple-600',
    color: '#9333EA',
    bgColor: '#F3E8FF',
    icon: 'UserCheck',
  },
  [SUBMISSION_STATUS.REVISION_REQUIRED]: {
    label: 'Perlu Revisi',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
    dotClass: 'bg-orange-600',
    color: '#EA580C',
    bgColor: '#FFEDD5',
    icon: 'AlertCircle',
  },
  [SUBMISSION_STATUS.APPROVED]: {
    label: 'Disetujui',
    badgeClass: 'bg-green-100 text-green-800 border-green-200',
    dotClass: 'bg-green-600',
    color: '#16A34A',
    bgColor: '#DCFCE7',
    icon: 'CheckCircle2',
  },
  [SUBMISSION_STATUS.REJECTED]: {
    label: 'Ditolak',
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
    dotClass: 'bg-red-600',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    icon: 'XCircle',
  },
  [SUBMISSION_STATUS.COMPLETED]: {
    label: 'Selesai',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-600',
    color: '#059669',
    bgColor: '#D1FAE5',
    icon: 'CheckCheck',
  },
};

export const SERVICE_TYPES = {
  ACTIVE_STUDENT: 'ACTIVE_STUDENT',
  RESEARCH_LETTER: 'RESEARCH_LETTER',
  ACADEMIC_LEAVE: 'ACADEMIC_LEAVE',
  GRADE_CORRECTION: 'GRADE_CORRECTION',
};

export const SERVICE_DETAILS = {
  [SERVICE_TYPES.ACTIVE_STUDENT]: {
    id: SERVICE_TYPES.ACTIVE_STUDENT,
    title: 'Surat Aktif Kuliah',
    slug: 'surat-aktif-kuliah',
    description: 'Surat keterangan resmi yang menyatakan bahwa Anda terdaftar aktif sebagai mahasiswa pada semester berjalan.',
    shortDesc: 'Untuk keperluan beasiswa, asuransi, tunjangan orang tua, dll.',
    icon: 'FileText',
    processingTime: '1-2 Hari Kerja',
  },
  [SERVICE_TYPES.RESEARCH_LETTER]: {
    id: SERVICE_TYPES.RESEARCH_LETTER,
    title: 'Surat Penelitian',
    slug: 'surat-penelitian',
    description: 'Surat izin pengantar penelitian tugas akhir / skripsi atau riset akademik ke instansi / perusahaan terkait.',
    shortDesc: 'Untuk izin riset, skripsi, dan observasi instansi luar.',
    icon: 'FlaskConical',
    processingTime: '2-3 Hari Kerja',
  },
  [SERVICE_TYPES.ACADEMIC_LEAVE]: {
    id: SERVICE_TYPES.ACADEMIC_LEAVE,
    title: 'Cuti Akademik',
    slug: 'cuti-akademik',
    description: 'Pengajuan permohonan berhenti sementara dari kegiatan akademik karena alasan kesehatan, pekerjaan, atau keperluan pribadi.',
    shortDesc: 'Permohonan penghentian studi sementara untuk 1-2 semester.',
    icon: 'CalendarDays',
    processingTime: '3-5 Hari Kerja',
  },
  [SERVICE_TYPES.GRADE_CORRECTION]: {
    id: SERVICE_TYPES.GRADE_CORRECTION,
    title: 'Komplain Nilai / Perubahan Nilai',
    slug: 'komplain-nilai',
    description: 'Layanan pengajuan peninjauan kembali penilaian mata kuliah atau pelaporan koreksi kesalahan input / perhitungan nilai akademik.',
    shortDesc: 'Pengajuan peninjauan nilai atau koreksi kesalahan input nilai.',
    icon: 'Award',
    processingTime: '3-7 Hari Kerja',
  },
};

export const COMPLAINT_TYPES = {
  KOMPLAIN_NILAI: {
    id: 'KOMPLAIN_NILAI',
    label: 'Komplain Nilai',
    description: 'Permohonan peninjauan kembali atas nilai yang dinilai kurang sesuai atau tidak konsisten dengan hasil asesmen tugas/ujian.',
  },
  KOREKSI_NILAI: {
    id: 'KOREKSI_NILAI',
    label: 'Koreksi Nilai',
    description: 'Pelaporan indikasi kesalahan teknis input nilai, kesalahan perhitungan rekapitulasi, atau ketidaksesuaian data rekam akademik.',
  },
};

export const ASSESSMENT_COMPONENTS = [
  { id: 'TUGAS', label: 'Tugas / Kuis' },
  { id: 'UTS', label: 'Ujian Tengah Semester (UTS)' },
  { id: 'UAS', label: 'Ujian Akhir Semester (UAS)' },
  { id: 'KEHADIRAN', label: 'Presensi / Kehadiran' },
  { id: 'PRAKTIKUM', label: 'Praktikum / Proyek' },
  { id: 'LAINNYA', label: 'Komponen Lainnya' },
];

export const STORAGE_KEYS = {
  AUTH_SESSION: 'ssms_auth_session',
  SUBMISSIONS: 'ssms_submissions_data',
  USERS: 'ssms_users_data',
};
