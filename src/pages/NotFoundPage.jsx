import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/ui/Button';
import { authService } from '../services/authService';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleGoHome = () => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-xl max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <h1 className="text-4xl font-extrabold text-[#172033] mb-2 font-mono">404</h1>
        <h2 className="text-lg font-bold text-[#172033] mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Tautan yang Anda tuju mungkin salah ketik, sudah dihapus, atau memerlukan izin akses khusus.
        </p>

        <div className="space-y-2">
          <Button
            variant="primary"
            size="md"
            icon={Home}
            className="w-full"
            onClick={handleGoHome}
          >
            Kembali ke Dashboard
          </Button>

          <Button
            variant="ghost"
            size="md"
            icon={ArrowLeft}
            className="w-full text-slate-500"
            onClick={() => navigate(-1)}
          >
            Halaman Sebelumnya
          </Button>
        </div>
      </div>
    </div>
  );
}
