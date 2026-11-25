import { SERVICE_TYPES, SUBMISSION_STATUS } from '../utils/constants';

export const initialSubmissions = [
  {
    id: 'sub-001',
    submissionNumber: 'SSMS-2026-00123',
    studentId: 'usr-student-2',
    studentName: 'Budi Santoso',
    studentIdentifier: '12345679',
    studentEmail: 'budi@demo.test',
    studentProgram: 'Sistem Informasi (S1)',
    serviceType: SERVICE_TYPES.ACTIVE_STUDENT,
    formData: {
      semester: 'Genap 2025/2026',
      reason: 'Untuk keperluan administrasi pengajuan beasiswa Bank Indonesia tahun 2026.',
      contactNumber: '081234567890',
    },
    documents: [
      {
        id: 'doc-001',
        name: 'KRS_Semester_Genap_Budi.pdf',
        size: 524288, // 512 KB
        type: 'application/pdf',
        uploadDate: '2026-11-16T14:30:00Z',
      }
    ],
    status: SUBMISSION_STATUS.PENDING,
    adminNote: '',
    createdAt: '2026-11-16T14:30:00Z',
    updatedAt: '2026-11-16T14:30:00Z',
    timeline: [
      {
        id: 'tl-1',
        status: SUBMISSION_STATUS.PENDING,
        title: 'Pengajuan Dikirim',
        description: 'Mahasiswa berhasil mengajukan permohonan Surat Aktif Kuliah.',
        actorName: 'Budi Santoso',
        actorRole: 'STUDENT',
        createdAt: '2026-11-16T14:30:00Z',
      },
      {
        id: 'tl-2',
        status: SUBMISSION_STATUS.PENDING,
        title: 'Menunggu Pemeriksaan Admin',
        description: 'Pengajuan sedang berada dalam antrean peninjauan bagian tata usaha.',
        actorName: 'Sistem SSMS',
        actorRole: 'SYSTEM',
        createdAt: '2026-11-16T14:30:05Z',
      }
    ]
  },
  {
    id: 'sub-002',
    submissionNumber: 'SSMS-2026-00124',
    studentId: 'usr-student-3',
    studentName: 'Maria Wijaya',
    studentIdentifier: '12345680',
    studentEmail: 'maria@demo.test',
    studentProgram: 'Teknik Komputer (S1)',
    serviceType: SERVICE_TYPES.RESEARCH_LETTER,
    formData: {
      researchTitle: 'Implementasi Internet of Things pada Sistem Smart Campus',
      targetInstitution: 'PT Telekomunikasi Indonesia (Persero) Tbk',
      institutionAddress: 'Jl. Gegerkalong Hilir No.47, Bandung',
      researchPeriod: '01 Desember 2026 - 28 Februari 2027',
      supervisorName: 'Dr. Eng. Ir. Hendra Gunawan, M.T.',
    },
    documents: [
      {
        id: 'doc-002',
        name: 'Proposal_Penelitian_Maria_Wijaya.pdf',
        size: 1572864, // 1.5 MB
        type: 'application/pdf',
        uploadDate: '2026-11-15T09:15:00Z',
      }
    ],
    status: SUBMISSION_STATUS.UNDER_REVIEW,
    adminNote: 'Sedang diverifikasi dengan program studi terkait jadwal bimbingan.',
    createdAt: '2026-11-15T09:15:00Z',
    updatedAt: '2026-11-15T10:00:00Z',
    timeline: [
      {
        id: 'tl-3',
        status: SUBMISSION_STATUS.PENDING,
        title: 'Pengajuan Dikirim',
        description: 'Mahasiswa mengirimkan formulir permohonan Surat Pengantar Penelitian.',
        actorName: 'Maria Wijaya',
        actorRole: 'STUDENT',
        createdAt: '2026-11-15T09:15:00Z',
      },
      {
        id: 'tl-4',
        status: SUBMISSION_STATUS.UNDER_REVIEW,
        title: 'Sedang Ditinjau Admin',
        description: 'Admin Administrasi sedang memvalidasi data pengantar instansi tujuan.',
        actorName: 'Admin Administrasi',
        actorRole: 'ADMIN',
        createdAt: '2026-11-15T10:00:00Z',
      }
    ]
  },
  {
    id: 'sub-003',
    submissionNumber: 'SSMS-2026-00120',
    studentId: 'usr-student-1',
    studentName: 'Vegryo Mait',
    studentIdentifier: '12345678',
    studentEmail: 'student@demo.test',
    studentProgram: 'Teknik Informatika (S1)',
    serviceType: SERVICE_TYPES.ACADEMIC_LEAVE,
    formData: {
      leaveSemester: 'Ganjil 2026/2027',
      leaveDuration: '1 Semester',
      reason: 'Mengikuti program magang industri bersertifikat di luar kota selama 6 bulan penuh.',
      statementAgreed: true,
    },
    documents: [
      {
        id: 'doc-003',
        name: 'Surat_Penerimaan_Magang_Industri.pdf',
        size: 838860, // 820 KB
        type: 'application/pdf',
        uploadDate: '2026-11-05T16:20:00Z',
      }
    ],
    status: SUBMISSION_STATUS.APPROVED,
    adminNote: 'Pengajuan cuti akademik disetujui. Surat cuti resmi telah diterbitkan oleh BAA.',
    createdAt: '2026-11-05T16:20:00Z',
    updatedAt: '2026-11-08T11:00:00Z',
    timeline: [
      {
        id: 'tl-5',
        status: SUBMISSION_STATUS.PENDING,
        title: 'Pengajuan Dikirim',
        description: 'Mahasiswa mengirim permohonan Cuti Akademik.',
        actorName: 'Vegryo Mait',
        actorRole: 'STUDENT',
        createdAt: '2026-11-05T16:20:00Z',
      },
      {
        id: 'tl-6',
        status: SUBMISSION_STATUS.UNDER_REVIEW,
        title: 'Sedang Ditinjau Admin',
        description: 'Berkas permohonan dicek oleh Koordinator Akademik.',
        actorName: 'Admin Administrasi',
        actorRole: 'ADMIN',
        createdAt: '2026-11-06T09:00:00Z',
      },
      {
        id: 'tl-7',
        status: SUBMISSION_STATUS.APPROVED,
        title: 'Pengajuan Disetujui',
        description: 'Cuti akademik disetujui. Silakan unduh SK Cuti Akademik Anda.',
        actorName: 'Admin Administrasi',
        actorRole: 'ADMIN',
        createdAt: '2026-11-08T11:00:00Z',
      }
    ]
  },
  {
    id: 'sub-004',
    submissionNumber: 'SSMS-2026-00122',
    studentId: 'usr-student-1',
    studentName: 'Vegryo Mait',
    studentIdentifier: '12345678',
    studentEmail: 'student@demo.test',
    studentProgram: 'Teknik Informatika (S1)',
    serviceType: SERVICE_TYPES.ACTIVE_STUDENT,
    formData: {
      semester: 'Genap 2025/2026',
      reason: 'Pembuatan visa studi banding ke Nanyang Technological University Singapore.',
      contactNumber: '081987654321',
    },
    documents: [
      {
        id: 'doc-004',
        name: 'Bukti_KRS_Vegryo.pdf',
        size: 409600, // 400 KB
        type: 'application/pdf',
        uploadDate: '2026-11-14T08:00:00Z',
      }
    ],
    status: SUBMISSION_STATUS.REVISION_REQUIRED,
    adminNote: 'Mohon sertakan bukti pelunasan SPP tahap terakhir atau surat bebas tunggakan dari Bagian Keuangan.',
    createdAt: '2026-11-14T08:00:00Z',
    updatedAt: '2026-11-15T13:45:00Z',
    timeline: [
      {
        id: 'tl-8',
        status: SUBMISSION_STATUS.PENDING,
        title: 'Pengajuan Dikirim',
        description: 'Permohonan Surat Aktif Kuliah dikirim.',
        actorName: 'Vegryo Mait',
        actorRole: 'STUDENT',
        createdAt: '2026-11-14T08:00:00Z',
      },
      {
        id: 'tl-9',
        status: SUBMISSION_STATUS.REVISION_REQUIRED,
        title: 'Perlu Revisi Dokumen',
        description: 'Admin meminta penambahan bukti pelunasan SPP sebelum surat diterbitkan.',
        actorName: 'Admin Administrasi',
        actorRole: 'ADMIN',
        createdAt: '2026-11-15T13:45:00Z',
      }
    ]
  },
  {
    id: 'sub-005',
    submissionNumber: 'SSMS-2026-00118',
    studentId: 'usr-student-1',
    studentName: 'Vegryo Mait',
    studentIdentifier: '12345678',
    studentEmail: 'student@demo.test',
    studentProgram: 'Teknik Informatika (S1)',
    serviceType: SERVICE_TYPES.RESEARCH_LETTER,
    formData: {
      researchTitle: 'Analisis Keamanan Jaringan Kampus Menggunakan SIEM Open Source',
      targetInstitution: 'Pusat Data dan Informasi Kampus Utama',
      institutionAddress: 'Gedung Rektorat Lt. 3',
      researchPeriod: '10 Oktober 2026 - 10 November 2026',
      supervisorName: 'Prof. Ir. Bambang Riyanto, Ph.D.',
    },
    documents: [
      {
        id: 'doc-005',
        name: 'Proposal_Penelitian_Keamanan.pdf',
        size: 1200000,
        type: 'application/pdf',
        uploadDate: '2026-10-12T11:20:00Z',
      }
    ],
    status: SUBMISSION_STATUS.REJECTED,
    adminNote: 'Topik penelitian menyangkut infrastruktur internal kritis yang tidak dibuka untuk penelitian mandiri mahasiswa pada periode ini. Silakan konsultasikan topik alternatif dengan dosen pembimbing.',
    createdAt: '2026-10-12T11:20:00Z',
    updatedAt: '2026-10-14T15:10:00Z',
    timeline: [
      {
        id: 'tl-10',
        status: SUBMISSION_STATUS.PENDING,
        title: 'Pengajuan Dikirim',
        description: 'Permohonan surat pengantar penelitian dikirimkan.',
        actorName: 'Vegryo Mait',
        actorRole: 'STUDENT',
        createdAt: '2026-10-12T11:20:00Z',
      },
      {
        id: 'tl-11',
        status: SUBMISSION_STATUS.REJECTED,
        title: 'Pengajuan Ditolak',
        description: 'Permohonan ditolak oleh Biro Akademik karena keterbatasan izin riset infrastruktur kritis.',
        actorName: 'Admin Administrasi',
        actorRole: 'ADMIN',
        createdAt: '2026-10-14T15:10:00Z',
      }
    ]
  },
  {
    id: 'sub-006',
    submissionNumber: 'SSMS-2026-00125',
    studentId: 'usr-student-2',
    studentName: 'Budi Santoso',
    studentIdentifier: '12345679',
    studentEmail: 'budi@demo.test',
    studentProgram: 'Sistem Informasi (S1)',
    serviceType: SERVICE_TYPES.RESEARCH_LETTER,
    formData: {
      researchTitle: 'Evaluasi Sistem ERP pada PT Pos Indonesia Regional IV',
      targetInstitution: 'PT Pos Indonesia (Persero) Kantor Wilayah',
      institutionAddress: 'Jl. Asia Afrika No.49, Bandung',
      researchPeriod: '15 Januari 2027 - 15 Maret 2027',
      supervisorName: 'Dewi Sartika, S.T., M.Kom.',
    },
    documents: [
      {
        id: 'doc-006',
        name: 'Proposal_Budi_ERP.pdf',
        size: 980000,
        type: 'application/pdf',
        uploadDate: '2026-11-16T15:10:00Z',
      }
    ],
    status: SUBMISSION_STATUS.PENDING,
    adminNote: '',
    createdAt: '2026-11-16T15:10:00Z',
    updatedAt: '2026-11-16T15:10:00Z',
    timeline: [
      {
        id: 'tl-12',
        status: SUBMISSION_STATUS.PENDING,
        title: 'Pengajuan Dikirim',
        description: 'Mahasiswa mengirim permohonan surat pengantar riset.',
        actorName: 'Budi Santoso',
        actorRole: 'STUDENT',
        createdAt: '2026-11-16T15:10:00Z',
      }
    ]
  },
  {
    id: 'sub-007',
    submissionNumber: 'SSMS-2026-00115',
    studentId: 'usr-student-3',
    studentName: 'Maria Wijaya',
    studentIdentifier: '12345680',
    studentEmail: 'maria@demo.test',
    studentProgram: 'Teknik Komputer (S1)',
    serviceType: SERVICE_TYPES.ACTIVE_STUDENT,
    formData: {
      semester: 'Genap 2025/2026',
      reason: 'Kebutuhan kelengkapan berkas asuransi BPJS Kesehatan keluarga.',
      contactNumber: '085712345678',
    },
    documents: [
      {
        id: 'doc-007',
        name: 'KRS_Aktif_Maria.pdf',
        size: 350000,
        type: 'application/pdf',
        uploadDate: '2026-11-01T10:00:00Z',
      }
    ],
    status: SUBMISSION_STATUS.APPROVED,
    adminNote: 'Surat telah disahkan secara digital. Silakan unduh dokumen.',
    createdAt: '2026-11-01T10:00:00Z',
    updatedAt: '2026-11-02T14:20:00Z',
    timeline: [
      {
        id: 'tl-13',
        status: SUBMISSION_STATUS.PENDING,
        title: 'Pengajuan Dikirim',
        description: 'Permohonan diajukan.',
        actorName: 'Maria Wijaya',
        actorRole: 'STUDENT',
        createdAt: '2026-11-01T10:00:00Z',
      },
      {
        id: 'tl-14',
        status: SUBMISSION_STATUS.APPROVED,
        title: 'Pengajuan Disetujui',
        description: 'Surat keterangan aktif kuliah diterbitkan.',
        actorName: 'Admin Administrasi',
        actorRole: 'ADMIN',
        createdAt: '2026-11-02T14:20:00Z',
      }
    ]
  },
  {
    id: 'sub-008',
    submissionNumber: 'SSMS-2026-00121',
    studentId: 'usr-student-2',
    studentName: 'Budi Santoso',
    studentIdentifier: '12345679',
    studentEmail: 'budi@demo.test',
    studentProgram: 'Sistem Informasi (S1)',
    serviceType: SERVICE_TYPES.ACADEMIC_LEAVE,
    formData: {
      leaveSemester: 'Ganjil 2026/2027',
      leaveDuration: '2 Semester',
      reason: 'Kondisi kesehatan keluarga yang membutuhkan pendampingan rawat inap intensif di luar kota.',
      statementAgreed: true,
    },
    documents: [
      {
        id: 'doc-008',
        name: 'Surat_Keterangan_Dokter_RS.pdf',
        size: 1400000,
        type: 'application/pdf',
        uploadDate: '2026-11-10T11:00:00Z',
      }
    ],
    status: SUBMISSION_STATUS.UNDER_REVIEW,
    adminNote: 'Sedang menunggu telaah dari Dewan Pembimbing Akademik.',
    createdAt: '2026-11-10T11:00:00Z',
    updatedAt: '2026-11-11T09:30:00Z',
    timeline: [
      {
        id: 'tl-15',
        status: SUBMISSION_STATUS.PENDING,
        title: 'Pengajuan Dikirim',
        description: 'Permohonan Cuti Akademik diajukan.',
        actorName: 'Budi Santoso',
        actorRole: 'STUDENT',
        createdAt: '2026-11-10T11:00:00Z',
      },
      {
        id: 'tl-16',
        status: SUBMISSION_STATUS.UNDER_REVIEW,
        title: 'Sedang Ditinjau Admin',
        description: 'Verifikasi berkas medis oleh bagian kemahasiswaan.',
        actorName: 'Admin Administrasi',
        actorRole: 'ADMIN',
        createdAt: '2026-11-11T09:30:00Z',
      }
    ]
  },
  {
    id: 'sub-009',
    submissionNumber: 'SSMS-2026-00130',
    studentId: 'usr-student-1',
    studentName: 'Vegryo Mait',
    studentIdentifier: '12345678',
    studentEmail: 'student@demo.test',
    studentProgram: 'Teknik Informatika (S1)',
    serviceType: SERVICE_TYPES.GRADE_CORRECTION,
    formData: {
      complaintType: 'KOMPLAIN_NILAI',
      academicSemester: 'Ganjil 2025/2026',
      courseCode: 'IF3102',
      courseName: 'Rekayasa Perangkat Lunak',
      lecturerName: 'Dr. Ir. Bambang Hidayat, M.Sc.',
      courseClass: 'IF-44-01',
      currentGrade: 'C+',
      expectedGrade: 'A',
      assessmentComponents: ['TUGAS', 'UTS', 'UAS'],
      reason: 'Nilai tugas besar dan ujian akhir semester yang tercantum pada LMS kampus bernilai 88.5, namun pada KHS portal akademik tercatat C+. Mohon kesediaan Dosen Pengampu untuk meninjau kembali rekapitulasi nilai.',
      confirmed: true,
    },
    documents: [
      {
        id: 'doc-009a',
        name: 'Screenshot_LMS_Nilai_RPL_88.png',
        size: 720896,
        type: 'image/png',
        uploadDate: '2026-11-15T11:00:00Z',
      },
      {
        id: 'doc-009b',
        name: 'Bukti_Pengumpulan_Tugas_Besar.pdf',
        size: 1146880,
        type: 'application/pdf',
        uploadDate: '2026-11-15T11:05:00Z',
      }
    ],
    status: SUBMISSION_STATUS.LECTURER_REVIEW,
    adminNote: 'Dokumen pendukung valid dan sesuai data KRS mahasiswa. Berkas diteruskan ke Dosen Pengampu untuk peninjauan.',
    lecturerReview: {
      lecturerName: 'Dr. Ir. Bambang Hidayat, M.Sc.',
      recommendation: 'APPROVE',
      recommendedGrade: 'A',
      notes: 'Setelah diperiksa pada rekap nilai kelas IF-44-01, teridentifikasi kesalahan input baris nilai mahasiswa. Nilai sebenarnya adalah 88.5 (Grade A). Rekomendasi perubahan disetujui.',
      reviewedAt: '2026-11-16T14:00:00Z',
    },
    createdAt: '2026-11-15T11:00:00Z',
    updatedAt: '2026-11-16T14:00:00Z',
    timeline: [
      {
        id: 'tl-17',
        status: SUBMISSION_STATUS.PENDING,
        title: 'Pengajuan Komplain Nilai Dikirim',
        description: 'Mahasiswa mengajukan permohonan komplain nilai mata kuliah Rekayasa Perangkat Lunak.',
        actorName: 'Vegryo Mait',
        actorRole: 'STUDENT',
        createdAt: '2026-11-15T11:00:00Z',
      },
      {
        id: 'tl-18',
        status: SUBMISSION_STATUS.UNDER_REVIEW,
        title: 'Verifikasi Administrasi BAA',
        description: 'Admin memvalidasi kelengkapan berkas dan mencocokkan dengan data KHS semester berjalan.',
        actorName: 'Admin Administrasi',
        actorRole: 'ADMIN',
        createdAt: '2026-11-15T14:20:00Z',
      },
      {
        id: 'tl-19',
        status: SUBMISSION_STATUS.LECTURER_REVIEW,
        title: 'Diteruskan ke Dosen Pengampu',
        description: 'Berkas masuk ke tahap telaah Dosen Pengampu (Dr. Ir. Bambang Hidayat, M.Sc.). Dosen memberikan rekomendasi perubahan ke Grade A.',
        actorName: 'Dr. Ir. Bambang Hidayat, M.Sc.',
        actorRole: 'LECTURER',
        createdAt: '2026-11-16T14:00:00Z',
      }
    ]
  },
  {
    id: 'sub-010',
    submissionNumber: 'SSMS-2026-00131',
    studentId: 'usr-student-2',
    studentName: 'Budi Santoso',
    studentIdentifier: '12345679',
    studentEmail: 'budi@demo.test',
    studentProgram: 'Sistem Informasi (S1)',
    serviceType: SERVICE_TYPES.GRADE_CORRECTION,
    formData: {
      complaintType: 'KOREKSI_NILAI',
      academicSemester: 'Genap 2025/2026',
      courseCode: 'SI2104',
      courseName: 'Basis Data Lanjut',
      lecturerName: 'Nurul Fadilah, S.Kom., M.T.',
      courseClass: 'SI-45-03',
      currentGrade: 'BL (Belum Lengkap)',
      expectedGrade: 'B+',
      assessmentComponents: ['UAS', 'PRAKTIKUM'],
      reason: 'Status nilai tercatat BL (Belum Lengkap) karena nilai praktikum dianggap kosong, padahal sudah mengikuti responsi dan menyerahkan laporan akhir ke asisten lab.',
      confirmed: true,
    },
    documents: [
      {
        id: 'doc-010',
        name: 'Lembar_Pengesahan_Responsi_Lab.pdf',
        size: 512000,
        type: 'application/pdf',
        uploadDate: '2026-11-12T09:30:00Z',
      }
    ],
    status: SUBMISSION_STATUS.COMPLETED,
    adminNote: 'SK Perubahan Nilai resmi nomor 102/BAA/KN/2026 telah ditandatangani oleh Dekan dan nilai telah diperbarui menjadi B+ pada sistem akademik resmi.',
    lecturerReview: {
      lecturerName: 'Nurul Fadilah, S.Kom., M.T.',
      recommendation: 'APPROVE',
      recommendedGrade: 'B+',
      notes: 'Konfirmasi asisten lab menyatakan laporan respon praktikum telah lengkap dengan nilai 82. Rekomendasi diubah menjadi B+.',
      reviewedAt: '2026-11-13T10:00:00Z',
    },
    createdAt: '2026-11-12T09:30:00Z',
    updatedAt: '2026-11-14T16:00:00Z',
    timeline: [
      {
        id: 'tl-20',
        status: SUBMISSION_STATUS.PENDING,
        title: 'Pengajuan Koreksi Nilai Dikirim',
        description: 'Mahasiswa melaporkan kekeliruan status nilai BL pada mata kuliah Basis Data Lanjut.',
        actorName: 'Budi Santoso',
        actorRole: 'STUDENT',
        createdAt: '2026-11-12T09:30:00Z',
      },
      {
        id: 'tl-21',
        status: SUBMISSION_STATUS.LECTURER_REVIEW,
        title: 'Telaah Dosen & Asisten Lab',
        description: 'Dosen mengonfirmasi nilai praktikum dan merekomendasikan pembaruan nilai menjadi B+.',
        actorName: 'Nurul Fadilah, S.Kom., M.T.',
        actorRole: 'LECTURER',
        createdAt: '2026-11-13T10:00:00Z',
      },
      {
        id: 'tl-22',
        status: SUBMISSION_STATUS.APPROVED,
        title: 'Persetujuan Dekanat',
        description: 'SK perubahan nilai diterbitkan oleh Bagian Akademik.',
        actorName: 'Admin Administrasi',
        actorRole: 'ADMIN',
        createdAt: '2026-11-14T11:00:00Z',
      },
      {
        id: 'tl-23',
        status: SUBMISSION_STATUS.COMPLETED,
        title: 'Nilai Resmi Telah Diperbarui',
        description: 'Perubahan nilai resmi telah disahkan dan disinkronkan ke pangkalan data akademik perguruan tinggi.',
        actorName: 'Biro Administrasi Akademik',
        actorRole: 'ACADEMIC_OFFICER',
        createdAt: '2026-11-14T16:00:00Z',
      }
    ]
  },
  {
    id: 'sub-011',
    submissionNumber: 'SSMS-2026-00132',
    studentId: 'usr-student-1',
    studentName: 'Vegryo Mait',
    studentIdentifier: '12345678',
    studentEmail: 'student@demo.test',
    studentProgram: 'Teknik Informatika (S1)',
    serviceType: SERVICE_TYPES.GRADE_CORRECTION,
    formData: {
      complaintType: 'KOREKSI_NILAI',
      academicSemester: 'Ganjil 2025/2026',
      courseCode: 'IF2201',
      courseName: 'Struktur Data & Algoritma',
      lecturerName: 'Dr. Eng. Ir. Hendra Gunawan, M.T.',
      courseClass: 'IF-44-02',
      currentGrade: 'B',
      expectedGrade: 'A',
      assessmentComponents: ['TUGAS', 'UTS'],
      reason: 'Terdapat komponen nilai kuis 3 (bobot 10%) yang belum terinput ke dalam portal KHS.',
      confirmed: true,
    },
    documents: [
      {
        id: 'doc-011',
        name: 'Screenshot_Nilai_Kuis3_100.png',
        size: 450000,
        type: 'image/png',
        uploadDate: '2026-11-16T16:00:00Z',
      }
    ],
    status: SUBMISSION_STATUS.PENDING,
    adminNote: '',
    createdAt: '2026-11-16T16:00:00Z',
    updatedAt: '2026-11-16T16:00:00Z',
    timeline: [
      {
        id: 'tl-24',
        status: SUBMISSION_STATUS.PENDING,
        title: 'Pengajuan Koreksi Nilai Dikirim',
        description: 'Pengajuan baru masuk ke antrean verifikasi admin.',
        actorName: 'Vegryo Mait',
        actorRole: 'STUDENT',
        createdAt: '2026-11-16T16:00:00Z',
      }
    ]
  }
];
