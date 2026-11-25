import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileCheck2,
  Clock,
  User,
  LogOut,
  Users,
  FileBarChart,
  GraduationCap,
  X,
  RotateCcw
} from 'lucide-react';
import { authService } from '../../services/authService';
import { submissionService } from '../../services/submissionService';
import { userService } from '../../services/userService';
import { useToast } from '../ui/Toast';

export default function AppSidebar({ role, isOpen, onClose }) {
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    toast.info('Anda telah keluar dari sistem.');
  };

  const handleResetData = () => {
    if (window.confirm('Reset semua data ke kondisi awal demo?')) {
      submissionService.resetDemoData();
      userService.resetUsers();
      toast.success('Data demo berhasil direset.');
      window.location.reload();
    }
  };

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/services', label: 'Katalog Layanan', icon: FileSpreadsheet },
    { to: '/student/submissions', label: 'Pengajuan Saya', icon: FileCheck2 },
    { to: '/student/submissions?tab=pending', label: 'Tracking', icon: Clock },
    { to: '/student/profile', label: 'Profil Saya', icon: User },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/submissions', label: 'Kelola Pengajuan', icon: FileCheck2 },
    { to: '/admin/users', label: 'Data Pengguna', icon: Users },
    { to: '/admin/reports', label: 'Laporan', icon: FileBarChart, badge: 'Demo' },
  ];

  const links = role === 'ADMIN' ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#17365D] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#234C7E]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3478E5] to-blue-400 flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-tight">SSMS</h1>
              <p className="text-[11px] text-blue-200/80 uppercase tracking-wider font-medium">
                Student Service
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-[#234C7E] lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Badge Indicator */}
        <div className="px-6 pt-4 pb-2">
          <span className="inline-block text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded bg-[#234C7E] text-blue-200">
            {role === 'ADMIN' ? 'Portal Administrator' : 'Portal Mahasiswa'}
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose && onClose()}
                end={item.to === '/student/dashboard' || item.to === '/admin/dashboard'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#3478E5] text-white shadow-sm font-semibold'
                      : 'text-slate-200 hover:bg-[#234C7E]/70 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 opacity-80" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Reset Demo Data & Logout */}
        <div className="p-4 border-t border-[#234C7E]/60 space-y-2">
          <button
            type="button"
            onClick={handleResetData}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-blue-200/80 hover:bg-[#234C7E]/50 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Data Demo</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-200 hover:bg-rose-500/20 hover:text-rose-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
}
