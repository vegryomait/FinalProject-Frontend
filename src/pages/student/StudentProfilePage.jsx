import React from 'react';
import { User, Mail, GraduationCap, Building2, Calendar, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { authService } from '../../services/authService';
import { submissionService } from '../../services/submissionService';

export default function StudentProfilePage() {
  const user = authService.getCurrentUser();
  const submissions = submissionService.getByStudentId(user?.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <PageHeader
        title="Profil Mahasiswa"
        subtitle="Informasi data induk akademik dan status kemahasiswaan Anda."
        breadcrumbs={[
          { label: 'Dashboard', href: '/student/dashboard' },
          { label: 'Profil' },
        ]}
      />

      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-100">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
            alt={user?.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-50 shadow-md"
          />
          <div className="text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-xl font-bold text-[#172033]">{user?.name}</h2>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Mahasiswa Aktif
              </span>
            </div>
            <p className="font-mono text-sm text-[#3478E5] font-semibold">
              NIM: {user?.identifier}
            </p>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Program Studi:</span>
              <p className="text-sm font-bold text-[#172033] mt-0.5">
                {user?.program || 'Teknik Informatika (S1)'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Fakultas:</span>
              <p className="text-sm font-bold text-[#172033] mt-0.5">
                {user?.faculty || 'Fakultas Ilmu Komputer'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Semester Berjalan:</span>
              <p className="text-sm font-bold text-[#172033] mt-0.5">
                {user?.semester || 'Semester 6'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Total Berkas Diajukan:</span>
              <p className="text-sm font-bold text-[#172033] mt-0.5">
                {submissions.length} Pengajuan Surat
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
