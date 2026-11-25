import { STORAGE_KEYS, SUBMISSION_STATUS } from '../utils/constants';
import { initialSubmissions } from '../data/mockSubmissions';

function loadStoredSubmissions() {
  const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(initialSubmissions));
    return initialSubmissions;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialSubmissions;
  }
}

function saveSubmissions(list) {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
}

function generateSubmissionNumber() {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SSMS-${year}-${randomSuffix}`;
}

export const submissionService = {
  getAll: () => {
    return loadStoredSubmissions();
  },

  getByStudentId: (studentId) => {
    const list = loadStoredSubmissions();
    return list.filter((s) => s.studentId === studentId);
  },

  getById: (id) => {
    const list = loadStoredSubmissions();
    return list.find((s) => s.id === id || s.submissionNumber === id) || null;
  },

  create: (user, serviceType, formData, documents = []) => {
    const list = loadStoredSubmissions();
    const now = new Date().toISOString();
    const newId = `sub-${Date.now()}`;
    const submissionNumber = generateSubmissionNumber();

    const newSubmission = {
      id: newId,
      submissionNumber,
      studentId: user.id,
      studentName: user.name,
      studentIdentifier: user.identifier,
      studentEmail: user.email,
      studentProgram: user.program || 'Mahasiswa Aktif',
      serviceType,
      formData,
      documents,
      status: SUBMISSION_STATUS.PENDING,
      adminNote: '',
      lecturerReview: null,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          status: SUBMISSION_STATUS.PENDING,
          title: 'Pengajuan Dikirim',
          description: 'Pengajuan berhasil dikirim oleh mahasiswa.',
          actorName: user.name,
          actorRole: 'STUDENT',
          createdAt: now,
        },
        {
          id: `tl-${Date.now()}-2`,
          status: SUBMISSION_STATUS.PENDING,
          title: 'Menunggu Pemeriksaan',
          description: 'Pengajuan masuk ke antrean verifikasi bagian tata usaha administrasi.',
          actorName: 'Sistem SSMS',
          actorRole: 'SYSTEM',
          createdAt: now,
        }
      ]
    };

    const updated = [newSubmission, ...list];
    saveSubmissions(updated);
    return newSubmission;
  },

  updateStatus: (submissionId, newStatus, adminNote = '', adminUser = null, extraData = {}) => {
    const list = loadStoredSubmissions();
    const now = new Date().toISOString();
    let updatedItem = null;

    const titles = {
      [SUBMISSION_STATUS.APPROVED]: 'Pengajuan Disetujui',
      [SUBMISSION_STATUS.REJECTED]: 'Pengajuan Ditolak',
      [SUBMISSION_STATUS.REVISION_REQUIRED]: 'Permintaan Perbaikan Berkas',
      [SUBMISSION_STATUS.UNDER_REVIEW]: 'Sedang Ditinjau Admin',
      [SUBMISSION_STATUS.LECTURER_REVIEW]: 'Diteruskan ke Review Dosen Pengampu',
      [SUBMISSION_STATUS.COMPLETED]: 'Penyesuaian Nilai Selesai Diproses',
      [SUBMISSION_STATUS.PENDING]: 'Status Menunggu',
    };

    const descriptions = {
      [SUBMISSION_STATUS.APPROVED]: adminNote || 'Seluruh persyaratan telah terpenuhi dan pengajuan resmi disahkan.',
      [SUBMISSION_STATUS.REJECTED]: adminNote ? `Alasan penolakan: ${adminNote}` : 'Pengajuan ditolak.',
      [SUBMISSION_STATUS.REVISION_REQUIRED]: adminNote ? `Catatan revisi: ${adminNote}` : 'Admin/Dosen meminta revisi atau klarifikasi tambahan pada data/dokumen pengajuan.',
      [SUBMISSION_STATUS.UNDER_REVIEW]: 'Admin sedang memverifikasi kelengkapan dokumen pendukung.',
      [SUBMISSION_STATUS.LECTURER_REVIEW]: adminNote || 'Berkas telah diverifikasi dan diteruskan ke Dosen Pengampu untuk peninjauan substansi nilai.',
      [SUBMISSION_STATUS.COMPLETED]: adminNote || 'Nilai resmi telah disesuaikan pada sistem akademik oleh Bagian Akademik yang berwenang.',
      [SUBMISSION_STATUS.PENDING]: 'Pengajuan kembali ke antrean pemeriksaan.',
    };

    const updatedList = list.map((item) => {
      if (item.id === submissionId) {
        const timelineItem = {
          id: `tl-${Date.now()}`,
          status: newStatus,
          title: extraData.customTitle || titles[newStatus] || 'Pembaruan Status',
          description: extraData.customDescription || descriptions[newStatus],
          actorName: extraData.actorName || (adminUser ? adminUser.name : 'Admin Administrasi'),
          actorRole: extraData.actorRole || 'ADMIN',
          createdAt: now,
        };

        updatedItem = {
          ...item,
          status: newStatus,
          adminNote: adminNote || item.adminNote,
          lecturerReview: extraData.lecturerReview !== undefined ? extraData.lecturerReview : item.lecturerReview,
          updatedAt: now,
          timeline: [...item.timeline, timelineItem],
        };
        return updatedItem;
      }
      return item;
    });

    saveSubmissions(updatedList);
    return updatedItem;
  },

  resubmit: (submissionId, formData, documents, user) => {
    const list = loadStoredSubmissions();
    const now = new Date().toISOString();
    let updatedItem = null;

    const updatedList = list.map((item) => {
      if (item.id === submissionId) {
        const timelineItem = {
          id: `tl-${Date.now()}`,
          status: SUBMISSION_STATUS.PENDING,
          title: 'Pengajuan Diperbaiki & Dikirim Ulang',
          description: 'Mahasiswa telah melengkapi/memperbaiki data atau dokumen sesuai catatan revisi.',
          actorName: user.name,
          actorRole: 'STUDENT',
          createdAt: now,
        };

        updatedItem = {
          ...item,
          formData: { ...item.formData, ...formData },
          documents: documents || item.documents,
          status: SUBMISSION_STATUS.PENDING,
          updatedAt: now,
          timeline: [...item.timeline, timelineItem],
        };
        return updatedItem;
      }
      return item;
    });

    saveSubmissions(updatedList);
    return updatedItem;
  },

  resetDemoData: () => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(initialSubmissions));
    return initialSubmissions;
  }
};
