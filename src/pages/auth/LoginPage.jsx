import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { authService } from '../../services/authService';
import { useToast } from '../../components/ui/Toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('STUDENT'); // 'STUDENT' | 'ADMIN'
  const [identifier, setIdentifier] = useState('student@demo.test');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
    if (tab === 'STUDENT') {
      setIdentifier('student@demo.test');
      setPassword('student123');
    } else {
      setIdentifier('admin@demo.test');
      setPassword('admin123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('NIM atau Email wajib diisi.');
      return;
    }
    if (!password) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }

    try {
      setIsLoading(true);
      const user = await authService.login(identifier, password);
      toast.success(`Selamat datang kembali, ${user.name}!`);

      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login gagal. Periksa kembali kredensial Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F4F7FC]">
      {/* Left Branding Panel */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#17365D] via-[#1E4577] to-[#3478E5] text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-blue-400/10 pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight">SSMS</span>
            <p className="text-xs text-blue-200">Universitas Terpadu</p>
          </div>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 my-12 lg:my-0 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-medium mb-6 backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Portal Pelayanan Digital Mahasiswa
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-4">
            Student Service <br />
            <span className="text-blue-300">Management System</span>
          </h1>

          <p className="text-blue-100 text-sm lg:text-base leading-relaxed mb-8">
            Platform satu pintu pengajuan surat aktif kuliah, izin penelitian, dan cuti akademik.
            Cepat, transparan, dan dapat dipantau langsung kapan saja.
          </p>

          <div className="space-y-3">
            {[
              'Pengajuan daring tanpa antre ke loket',
              'Pelacakan status berkas secara real-time',
              'Pemberitahuan catatan revisi langsung dari admin',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-blue-200">
          <span>Easy. Fast. Reliable.</span>
          <span>Versi Prototype MVP 1.0</span>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#172033] tracking-tight">Welcome Back!</h2>
            <p className="text-sm text-slate-500 mt-1">
              Silakan masuk ke akun Anda untuk mengakses layanan
            </p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleSelectTab('STUDENT')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'STUDENT'
                  ? 'bg-white text-[#17365D] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Mahasiswa
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('ADMIN')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'ADMIN'
                  ? 'bg-white text-[#17365D] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Admin Administrasi
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {activeTab === 'STUDENT' ? 'NIM / Email Mahasiswa' : 'ID Admin / Email'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={activeTab === 'STUDENT' ? 'Contoh: 12345678 atau email' : 'Contoh: admin@demo.test'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3478E5] focus:border-transparent transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Kata Sandi (Password)
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs text-[#3478E5] hover:underline font-medium"
                >
                  Lupa Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3478E5] focus:border-transparent transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2 font-semibold shadow-md"
            >
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Helper Section */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Akun Demo Cepat (Klik untuk Mengisi):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleSelectTab('STUDENT')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  activeTab === 'STUDENT'
                    ? 'border-[#3478E5] bg-blue-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="font-semibold text-[#172033]">Mahasiswa Demo</p>
                <p className="text-[11px] text-slate-500">student@demo.test</p>
                <span className="text-[10px] text-blue-600 font-medium">PW: student123</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('ADMIN')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  activeTab === 'ADMIN'
                    ? 'border-[#3478E5] bg-blue-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="font-semibold text-[#172033]">Admin Demo</p>
                <p className="text-[11px] text-slate-500">admin@demo.test</p>
                <span className="text-[10px] text-blue-600 font-medium">PW: admin123</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172033] mb-1">Bantuan Akun Demo</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Karena ini adalah aplikasi prototipe frontend, silakan gunakan kredensial demo default:
              <br />
              <strong className="text-slate-700">student@demo.test (student123)</strong> atau{' '}
              <strong className="text-slate-700">admin@demo.test (admin123)</strong>.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => setForgotModalOpen(false)}
            >
              Mengerti
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
