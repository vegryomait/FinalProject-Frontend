import React, { useState } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Plus,
  RotateCcw,
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { userService } from '../../services/userService';
import { useToast } from '../../components/ui/Toast';

export default function UserManagementPage() {
  const toast = useToast();
  const [users, setUsers] = useState(() => userService.getUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const handleToggleStatus = (userId, userName, currentStatus) => {
    const updated = userService.toggleUserStatus(userId);
    setUsers(updated);
    toast.info(
      `Status akun "${userName}" diubah menjadi ${!currentStatus ? 'Aktif' : 'Nonaktif'}.`
    );
  };

  const handleResetUsers = () => {
    if (window.confirm('Reset daftar pengguna demo ke data awal?')) {
      const reset = userService.resetUsers();
      setUsers(reset);
      toast.success('Pengguna demo direset.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.identifier.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Manajemen Pengguna Demo"
        subtitle="Daftar akun mahasiswa dan staf administrasi yang terdaftar pada sistem SSMS."
        breadcrumbs={[
          { label: 'Dashboard Admin', href: '/admin/dashboard' },
          { label: 'Data Pengguna' },
        ]}
        action={
          <Button
            variant="secondary"
            size="md"
            icon={RotateCcw}
            onClick={handleResetUsers}
          >
            Reset Akun Demo
          </Button>
        }
      />

      {/* Filter and Search */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, atau NIM/ID pengguna..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3478E5] focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#3478E5] focus:bg-white"
          >
            <option value="ALL">Semua Peran (Role)</option>
            <option value="STUDENT">Mahasiswa (STUDENT)</option>
            <option value="ADMIN">Administrator (ADMIN)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          title="Pengguna Tidak Ditemukan"
          description="Tidak ada data akun yang sesuai dengan pencarian Anda."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nama Pengguna</th>
                  <th className="px-6 py-4">NIM / ID Pegawai</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status Akun</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.avatarUrl ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'
                          }
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-50"
                        />
                        <div>
                          <p className="font-bold text-[#172033] text-sm">{user.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {user.program || user.faculty || 'Universitas'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-[#3478E5]">
                      {user.identifier}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          user.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        {user.isActive ? 'Aktif' : 'Dinonaktifkan'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant={user.isActive ? 'danger' : 'success'}
                        size="sm"
                        onClick={() =>
                          handleToggleStatus(user.id, user.name, user.isActive)
                        }
                        className="text-xs"
                      >
                        {user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
