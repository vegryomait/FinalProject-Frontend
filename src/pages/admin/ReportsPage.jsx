import React from 'react';
import { FileBarChart, Download, Printer, CheckCircle2, Clock } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { submissionService } from '../../services/submissionService';

export default function ReportsPage() {
  const toast = useToast();
  const submissions = submissionService.getAll();

  const handleExportCSV = () => {
    toast.success('Mengekspor rekapitulasi data pengajuan ke CSV (Simulasi)...');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Laporan Layanan Administrasi"
        subtitle="Rekapitulasi data layanan akademik dan performa penyelesaian permohonan surat mahasiswa."
        breadcrumbs={[
          { label: 'Dashboard Admin', href: '/admin/dashboard' },
          { label: 'Laporan' },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" icon={Printer} onClick={handlePrint}>
              Cetak Laporan
            </Button>
            <Button variant="primary" size="md" icon={Download} onClick={handleExportCSV}>
              Ekspor Data (CSV)
            </Button>
          </div>
        }
      />

      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xs text-center max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <FileBarChart className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-[#172033] mb-2">
          Pusat Laporan & Rekapitulasi Berkas (MVP Prototype)
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto mb-6">
          Modul ini menyajikan ringkasan kinerja pemrosesan berkas. Pada versi lengkap, data ini akan terintegrasi langsung dengan sistem penjaminan mutu akademik.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">Rata-rata Penyelesaian:</span>
            <p className="text-lg font-bold text-[#172033]">1.8 Hari Kerja</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">Tingkat Approval:</span>
            <p className="text-lg font-bold text-emerald-600">92.4% Disetujui</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">Total Pengajuan:</span>
            <p className="text-lg font-bold text-[#3478E5]">{submissions.length} Dokumen</p>
          </div>
        </div>
      </div>
    </div>
  );
}
