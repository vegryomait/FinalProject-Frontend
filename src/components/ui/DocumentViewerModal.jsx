import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Building,
  GraduationCap,
  Calendar,
  User,
  Barcode,
} from 'lucide-react';
import { formatFileSize, formatDate } from '../../utils/formatters';
import Button from './Button';
import { useToast } from './Toast';

export default function DocumentViewerModal({
  isOpen,
  onClose,
  doc,
  submission = null,
}) {
  const toast = useToast();
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || !doc) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.7));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleDownload = () => {
    if (doc.fileUrl) {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.name;
      link.click();
    } else {
      toast.success(`Mengunduh salinan berkas "${doc.name}"...`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Determine document category for realistic mock rendering
  const docNameLower = (doc.name || '').toLowerCase();
  const isImage =
    doc.type?.startsWith('image/') ||
    docNameLower.endsWith('.png') ||
    docNameLower.endsWith('.jpg') ||
    docNameLower.endsWith('.jpeg');
  const isKRS = docNameLower.includes('krs');
  const isLMS = docNameLower.includes('lms') || docNameLower.includes('screenshot') || docNameLower.includes('kuis') || docNameLower.includes('nilai');
  const isProposal = docNameLower.includes('proposal');
  const isDoctor = docNameLower.includes('dokter') || docNameLower.includes('rs') || docNameLower.includes('sakit');
  const isInternship = docNameLower.includes('magang') || docNameLower.includes('penerimaan');
  const isLab = docNameLower.includes('lab') || docNameLower.includes('responsi');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4 text-center">
        <div
          className="relative transform overflow-hidden rounded-3xl bg-slate-900 text-left shadow-2xl transition-all w-full max-w-5xl border border-slate-700 flex flex-col h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-3 text-white flex-shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate max-w-sm sm:max-w-md">
                  {doc.name}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {formatFileSize(doc.size)} • {doc.type || 'Dokumen Resmi'} • Diunggah {formatDate(doc.uploadDate)}
                </p>
              </div>
            </div>

            {/* Viewer Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden sm:flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Perkecil (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs px-2 font-mono text-slate-300 select-none">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Perbesar (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors ml-1"
                  title="Putar 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="text-[10px] px-1.5 py-1 text-slate-400 hover:text-white"
                  title="Reset Tampilan"
                >
                  Reset
                </button>
              </div>

              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={handleDownload}
                className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 text-xs hidden sm:inline-flex"
              >
                Unduh
              </Button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Content Viewport */}
          <div className="flex-1 overflow-auto bg-slate-950/80 p-4 sm:p-8 flex items-center justify-center">
            {/* 1. ACTUAL USER-UPLOADED FILE (Data URL / Blob URL) */}
            {doc.fileUrl ? (
              <div
                className="transition-all duration-200 flex items-center justify-center"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                {isImage ? (
                  <img
                    src={doc.fileUrl}
                    alt={doc.name}
                    className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-slate-800 bg-white"
                  />
                ) : (
                  <div className="w-[800px] h-[75vh] bg-white rounded-xl shadow-2xl overflow-hidden">
                    <iframe
                      src={doc.fileUrl}
                      title={doc.name}
                      className="w-full h-full border-none"
                    />
                  </div>
                )}
              </div>
            ) : (
              /* 2. AUTHENTIC DIGITAL ACADEMIC DOCUMENT SIMULATION FOR SEED FILES */
              <div
                className="transition-all duration-200 w-full max-w-3xl"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'top center',
                }}
              >
                {/* 2A. SCREENSHOT NILAI LMS / PORTAL (LMS Gradebook Screenshot) */}
                {isLMS ? (
                  <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden text-left font-sans text-xs">
                    {/* Simulated Browser Bar */}
                    <div className="bg-slate-800 px-4 py-2.5 border-b border-slate-700 flex items-center gap-2 text-slate-400 text-xs">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      <div className="bg-slate-900 rounded-md px-3 py-1 text-slate-300 font-mono text-[11px] flex-1 max-w-md truncate">
                        https://lms.univ-terpadu.ac.id/courses/{submission?.formData?.courseCode || 'IF3102'}/grades/student
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                        ● Live Screenshot Capture
                      </span>
                    </div>

                    {/* LMS Interface */}
                    <div className="p-6 bg-white text-slate-800 space-y-5">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                        <div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-6 h-6 text-[#3478E5]" />
                            <h2 className="text-base font-bold text-[#172033]">
                              Learning Management System (LMS)
                            </h2>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Rekapitulasi Nilai Asesmen Perkuliahan Mahasiswa
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-slate-700">
                            {submission?.studentName || 'Vegryo Mait'}
                          </span>
                          <p className="text-[11px] text-slate-500">
                            NIM: {submission?.studentIdentifier || '12345678'}
                          </p>
                        </div>
                      </div>

                      {/* Course Info Banner */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                            Mata Kuliah
                          </span>
                          <h4 className="text-sm font-bold text-[#172033]">
                            {submission?.formData?.courseCode || 'IF3102'} - {submission?.formData?.courseName || 'Rekayasa Perangkat Lunak'}
                          </h4>
                          <p className="text-xs text-slate-600">
                            Dosen: {submission?.formData?.lecturerName || 'Dr. Ir. Bambang Hidayat, M.Sc.'} • Semester: {submission?.formData?.academicSemester || 'Ganjil 2025/2026'}
                          </p>
                        </div>
                        <div className="text-left sm:text-right bg-white p-2.5 rounded-lg border border-blue-100 shadow-xs">
                          <span className="text-[10px] text-slate-500 block">Total Akumulasi LMS:</span>
                          <span className="text-lg font-mono font-extrabold text-emerald-600">
                            88.50 (Grade A)
                          </span>
                        </div>
                      </div>

                      {/* Grade Breakdown Table */}
                      <div>
                        <h5 className="font-bold text-xs text-slate-700 mb-2">Rincian Komponen Penilaian Dosen:</h5>
                        <table className="w-full border border-slate-200 rounded-lg overflow-hidden text-left">
                          <thead className="bg-slate-100 text-slate-600 font-semibold text-[11px]">
                            <tr>
                              <th className="p-2.5 border-b">Komponen</th>
                              <th className="p-2.5 border-b text-center">Bobot</th>
                              <th className="p-2.5 border-b text-center">Nilai Maksimal</th>
                              <th className="p-2.5 border-b text-center">Nilai Mahasiswa</th>
                              <th className="p-2.5 border-b">Catatan Asesmen</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            <tr>
                              <td className="p-2.5 font-medium">Tugas Besar / Proyek Kelompok</td>
                              <td className="p-2.5 text-center font-mono">30%</td>
                              <td className="p-2.5 text-center font-mono">100</td>
                              <td className="p-2.5 text-center font-mono font-bold text-emerald-600">90.0</td>
                              <td className="p-2.5 text-[11px] text-slate-500">Arsitektur & dokumentasi API lengkap</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-medium">Ujian Tengah Semester (UTS)</td>
                              <td className="p-2.5 text-center font-mono">25%</td>
                              <td className="p-2.5 text-center font-mono">100</td>
                              <td className="p-2.5 text-center font-mono font-bold text-emerald-600">86.0</td>
                              <td className="p-2.5 text-[11px] text-slate-500">Lembar jawaban terperiksa</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-medium">Ujian Akhir Semester (UAS)</td>
                              <td className="p-2.5 text-center font-mono">30%</td>
                              <td className="p-2.5 text-center font-mono">100</td>
                              <td className="p-2.5 text-center font-mono font-bold text-emerald-600">89.0</td>
                              <td className="p-2.5 text-[11px] text-slate-500">Desain software patterns sangat baik</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-medium">Kuis & Kehadiran Praktikum</td>
                              <td className="p-2.5 text-center font-mono">15%</td>
                              <td className="p-2.5 text-center font-mono">100</td>
                              <td className="p-2.5 text-center font-mono font-bold text-emerald-600">88.0</td>
                              <td className="p-2.5 text-[11px] text-slate-500">14/14 pertemuan hadir penuh</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Discrepancy Highlight */}
                      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Bukti Ketidaksesuaian yang Dilaporkan:</strong>
                          <p className="mt-0.5 text-slate-700 leading-relaxed">
                            Nilai akhir di LMS tercatat <strong>88.50 (A)</strong>, namun pada Kartu Hasil Studi (KHS) resmi portal tercatat <strong>{submission?.formData?.currentGrade || 'C+'}</strong> karena kekeliruan transposisi baris spreadsheet dosen.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : isKRS ? (
                  /* 2B. KARTU RENCANA STUDI (KRS) RESMI */
                  <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl border border-slate-300 text-left text-slate-800 font-serif leading-relaxed">
                    {/* Kop Surat Universitas */}
                    <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                      <p className="text-[11px] font-sans uppercase tracking-widest text-slate-500 font-bold">
                        Kementerian Pendidikan Tinggi, Sains, dan Teknologi
                      </p>
                      <h2 className="text-lg sm:text-xl font-bold font-sans tracking-wide text-[#172033]">
                        UNIVERSITAS TERPADU INDONESIA
                      </h2>
                      <p className="text-xs text-slate-600 font-sans">
                        Biro Administrasi Akademik & Layanan Kemahasiswaan (BAA)
                      </p>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                        Jl. Tridharma Kampus Terpadu No. 1 • Telp (022) 7564108 • www.univ-terpadu.ac.id
                      </p>
                    </div>

                    <div className="text-center mb-6">
                      <h3 className="text-base font-bold underline font-sans text-slate-900 tracking-wider">
                        KARTU RENCANA STUDI (KRS)
                      </h3>
                      <p className="text-xs font-sans text-slate-500 mt-0.5">
                        Tahun Akademik {submission?.formData?.semester || 'Genap 2025/2026'}
                      </p>
                    </div>

                    {/* Student Info Table */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-sans mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-500">Nama Mahasiswa:</span>
                        <p className="font-bold text-slate-900">{submission?.studentName || 'Budi Santoso'}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Nomor Induk Mahasiswa (NIM):</span>
                        <p className="font-mono font-bold text-[#3478E5]">
                          {submission?.studentIdentifier || '12345679'}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Program Studi / Jenjang:</span>
                        <p className="font-medium text-slate-800">
                          {submission?.studentProgram || 'Sistem Informasi (S1)'}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Status Registrasi:</span>
                        <span className="inline-block px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                          AKTIF KULIAH (TERVERIFIKASI)
                        </span>
                      </div>
                    </div>

                    {/* List of Courses */}
                    <table className="w-full border border-slate-300 text-xs font-sans mb-6">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                        <tr>
                          <th className="p-2 text-center w-8">No</th>
                          <th className="p-2 text-left">Kode MK</th>
                          <th className="p-2 text-left">Nama Mata Kuliah</th>
                          <th className="p-2 text-center">SKS</th>
                          <th className="p-2 text-center">Kelas</th>
                          <th className="p-2 text-left">Dosen Pengampu</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-700">
                        <tr>
                          <td className="p-2 text-center font-mono">1</td>
                          <td className="p-2 font-mono font-semibold">SI2104</td>
                          <td className="p-2 font-medium">Basis Data Lanjut</td>
                          <td className="p-2 text-center font-mono">3</td>
                          <td className="p-2 text-center font-mono">SI-45-03</td>
                          <td className="p-2">Nurul Fadilah, S.Kom., M.T.</td>
                        </tr>
                        <tr>
                          <td className="p-2 text-center font-mono">2</td>
                          <td className="p-2 font-mono font-semibold">SI2105</td>
                          <td className="p-2 font-medium">Analisis & Desain Sistem Informasi</td>
                          <td className="p-2 text-center font-mono">4</td>
                          <td className="p-2 text-center font-mono">SI-45-03</td>
                          <td className="p-2">Dr. Ir. Hendra Gunawan</td>
                        </tr>
                        <tr>
                          <td className="p-2 text-center font-mono">3</td>
                          <td className="p-2 font-mono font-semibold">IF3102</td>
                          <td className="p-2 font-medium">Rekayasa Perangkat Lunak</td>
                          <td className="p-2 text-center font-mono">3</td>
                          <td className="p-2 text-center font-mono">IF-44-01</td>
                          <td className="p-2">Dr. Ir. Bambang Hidayat, M.Sc.</td>
                        </tr>
                        <tr>
                          <td className="p-2 text-center font-mono">4</td>
                          <td className="p-2 font-mono font-semibold">KU2001</td>
                          <td className="p-2 font-medium">Etika Profesi & Tata Kelola IT</td>
                          <td className="p-2 text-center font-mono">2</td>
                          <td className="p-2 text-center font-mono">KU-01</td>
                          <td className="p-2">Dewi Sartika, M.Kom.</td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-slate-50 font-bold border-t border-slate-300">
                        <tr>
                          <td colSpan="3" className="p-2 text-right">Total SKS Semester Ini:</td>
                          <td className="p-2 text-center font-mono text-[#3478E5]">21 SKS</td>
                          <td colSpan="2"></td>
                        </tr>
                      </tfoot>
                    </table>

                    {/* Official Signatures & Barcode */}
                    <div className="pt-6 flex items-end justify-between font-sans text-xs">
                      <div className="text-center">
                        <p className="text-slate-500 mb-10">Mengetahui,<br />Dosen Pembimbing Akademik</p>
                        <p className="font-bold underline text-slate-900">Dr. Ir. Bambang Hidayat, M.Sc.</p>
                        <p className="text-[10px] text-slate-500">NIP. 19780512 200312 1 002</p>
                      </div>

                      <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <Barcode className="w-32 h-10 mx-auto text-slate-700" />
                        <span className="text-[10px] font-mono text-slate-400 block mt-1">
                          AUTH-DIGITAL-KRS-{submission?.studentIdentifier || '2026'}
                        </span>
                      </div>

                      <div className="text-center">
                        <p className="text-slate-500 mb-10">Bandung, 10 Februari 2026<br />Mahasiswa Pemohon</p>
                        <p className="font-bold underline text-slate-900">{submission?.studentName || 'Budi Santoso'}</p>
                        <p className="text-[10px] text-slate-500">NIM. {submission?.studentIdentifier || '12345679'}</p>
                      </div>
                    </div>
                  </div>
                ) : isProposal ? (
                  /* 2C. PROPOSAL PENELITIAN / TUGAS AKHIR */
                  <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl border border-slate-300 text-left text-slate-800 font-serif leading-relaxed">
                    <div className="text-center border-b border-slate-200 pb-6 mb-6 font-sans">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Proposal Tugas Akhir / Penelitian Akademik
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold text-[#172033] mt-2 max-w-xl mx-auto">
                        "{submission?.formData?.researchTitle || 'Implementasi Internet of Things pada Sistem Smart Campus'}"
                      </h2>
                      <p className="text-xs text-slate-500 mt-2">
                        Instansi Mitra: <strong>{submission?.formData?.targetInstitution || 'PT Telekomunikasi Indonesia Tbk'}</strong>
                      </p>
                    </div>

                    <div className="font-sans text-xs space-y-4 mb-6">
                      <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                          <span className="text-slate-400">Nama Peneliti:</span>
                          <p className="font-bold text-slate-800">{submission?.studentName || 'Maria Wijaya'}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">NIM:</span>
                          <p className="font-mono font-bold text-[#3478E5]">{submission?.studentIdentifier || '12345680'}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Periode Pelaksanaan:</span>
                          <p className="font-medium text-slate-800">{submission?.formData?.researchPeriod || '01 Des 2026 - 28 Feb 2027'}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Dosen Pembimbing:</span>
                          <p className="font-medium text-slate-800">{submission?.formData?.supervisorName || 'Dr. Eng. Ir. Hendra Gunawan'}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Abstrak & Latar Belakang:</h4>
                        <p className="text-slate-600 leading-relaxed text-justify">
                          Penelitian ini bertujuan untuk mengintegrasikan arsitektur sensor pintar LoRaWAN dengan platform data analitik internal institusi guna efisiensi konsumsi energi dan pemantauan utilisasi ruang kelas secara real-time. Seluruh data hasil observasi akan diolah untuk memenuhi persyaratan penyusunan skripsi akademik pada program sarjana.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Rencana Keluaran (Deliverables):</h4>
                        <ul className="list-disc pl-5 text-slate-600 space-y-1">
                          <li>Laporan teknis komprehensif hasil uji penetrasi dan throughput jaringan.</li>
                          <li>Surat keterangan penyelesaian riset resmi dari pejabat berwenang instansi tujuan.</li>
                          <li>Artikel ilmiah untuk publikasi jurnal nasional terakreditasi SINTA.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between font-sans text-xs text-slate-500">
                      <span>Status Dokumen: Telah disetujui Dosen Pembimbing</span>
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                        ✓ LAMPIRAN VALID
                      </span>
                    </div>
                  </div>
                ) : (
                  /* 2D. SURAT RESMI KETERANGAN LAINNYA (Dokter, Magang, dsb) */
                  <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl border border-slate-300 text-left text-slate-800 font-serif leading-relaxed">
                    <div className="text-center border-b-2 border-slate-800 pb-4 mb-6 font-sans">
                      <h2 className="text-base font-bold uppercase tracking-wide text-slate-900">
                        {isDoctor
                          ? 'RUMAH SAKIT UMUM PUSAT DR. HASAN SADIKIN'
                          : isInternship
                          ? 'PT INDUSTRI TEKNOLOGI INFORMATIKA INDONESIA'
                          : 'BIRO ADMINISTRASI AKADEMIK UNIVERSITAS'}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {isDoctor
                          ? 'Instalasi Rawat Inap & Pelayanan Medis Khusus • SIP Dokter No. 445/789/SIP/2024'
                          : isInternship
                          ? 'Human Capital & Academic Partnership Division • Jakarta Selatan'
                          : 'Pusat Layanan Dokumen Kemahasiswaan Terpadu'}
                      </p>
                    </div>

                    <div className="text-center my-4 font-sans">
                      <h3 className="text-sm font-bold underline text-slate-900 tracking-wider uppercase">
                        {isDoctor
                          ? 'SURAT KETERANGAN DOKTER / RAWAT MEDIS'
                          : isInternship
                          ? 'SURAT PENERIMAAN MAGANG INDUSTRI (OFFERING LETTER)'
                          : 'SURAT KETERANGAN RESMI PENDUKUNG'}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Nomor: {doc.name.replace(/\.[^/.]+$/, '').toUpperCase()}/2026
                      </p>
                    </div>

                    <div className="font-sans text-xs space-y-4 my-6 leading-relaxed">
                      <p>Yang bertanda tangan di bawah ini menerangkan bahwa:</p>
                      <div className="pl-4 space-y-1.5 font-medium text-slate-700">
                        <p>Nama Mahasiswa : <strong>{submission?.studentName || 'Budi Santoso'}</strong></p>
                        <p>NIM / ID : <strong>{submission?.studentIdentifier || '12345679'}</strong></p>
                        <p>Program Studi : <strong>{submission?.studentProgram || 'Teknik Informatika (S1)'}</strong></p>
                      </div>

                      <p className="text-slate-600 text-justify">
                        {isDoctor
                          ? 'Berdasarkan hasil pemeriksaan klinis intensif, mahasiswa/keluarga yang bersangkutan memerlukan pendampingan perawatan medis intensif dan disarankan beristirahat dari aktivitas perkuliahan penuh selama semester berjalan.'
                          : isInternship
                          ? 'Dinyatakan diterima secara resmi untuk mengikuti program Magang Industri Bersertifikat (Kampus Merdeka) posisi Software Engineering selama 6 (enam) bulan penuh.'
                          : 'Dokumen ini dilampirkan sebagai bukti keabsahan dan kelengkapan permohonan layanan administrasi akademik mahasiswa.'}
                      </p>
                    </div>

                    <div className="pt-8 flex justify-end font-sans text-xs">
                      <div className="text-center">
                        <p className="text-slate-500 mb-12">Bandung, 12 November 2026<br />Pejabat Berwenang / Dokter,</p>
                        <p className="font-bold underline text-slate-900">Dr. dr. H. Irawan Setiadi, Sp.PD</p>
                        <p className="text-[10px] text-slate-500">SIP: 445/789/SIP/2024</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Bar Footer */}
          <div className="border-t border-slate-800 bg-slate-900 px-5 py-3 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verifikasi Keabsahan: Dokumen Terhubung dengan Berkas #{submission?.submissionNumber || 'SSMS'}</span>
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={Printer}
                onClick={handlePrint}
                className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 text-xs hidden sm:inline-flex"
              >
                Cetak
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                Tutup Tampilan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
