import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { adminService } from '../../services/admin.service';
import UserTable from '../../components/admin/UserTable';
import {
  ShieldCheckIcon,
  UserPlusIcon,
  XMarkIcon,
  ChevronDownIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

import type { UserRead, HaraAreaChangeRead } from '../../types/api.types';


export default function AdminPanelPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Tabs state
  const [activeTab, setActiveTab] = useState<'users' | 'audit'>('users');

  // Users state
  const [users, setUsers] = useState<UserRead[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [updatingStatusUserId, setUpdatingStatusUserId] = useState<number | null>(null);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<HaraAreaChangeRead[]>([]);
  const [isAuditLogsLoading, setIsAuditLogsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // User Creation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user' as 'user' | 'expert' | 'admin',
  });

  const isAdmin = user?.role === 'admin';

  const fetchUsers = async () => {
    try {
      setIsUsersLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      showToast('Gagal memuat daftar pengguna.', 'error');
    } finally {
      setIsUsersLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setIsAuditLogsLoading(true);
      const data = await adminService.getAuditLogs();
      setAuditLogs(data);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
      showToast('Gagal memuat log audit perubahan lahan.', 'error');
    } finally {
      setIsAuditLogsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === 'users') {
      void fetchUsers();
    } else {
      void fetchAuditLogs();
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !isAdmin) {
      showToast('Akses ditolak. Halaman ini hanya untuk Administrator.', 'error');
      void navigate('/dashboard');
    } else if (isAdmin) {
      if (activeTab === 'users') {
        void fetchUsers();
      } else {
        void fetchAuditLogs();
      }
    }
  }, [isAdmin, isAuthLoading, navigate, showToast, activeTab]);


  const handleRoleChange = async (userId: number, newRole: 'user' | 'expert' | 'admin') => {
    setUpdatingUserId(userId);
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      showToast('Hak akses pengguna berhasil diubah.', 'success');
    } catch (err) {
      console.error('Failed to update user role:', err);
      showToast('Gagal mengubah hak akses pengguna.', 'error');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleStatusToggle = async (userId: number, currentStatus: boolean) => {
    setUpdatingStatusUserId(userId);
    const nextStatus = !currentStatus;
    try {
      await adminService.toggleUserStatus(userId, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: nextStatus } : u))
      );
      showToast(
        nextStatus ? 'Akun pengguna berhasil diaktifkan.' : 'Akun pengguna berhasil dinonaktifkan.',
        'success'
      );
    } catch (err) {
      console.error('Failed to toggle user status:', err);
      showToast('Gagal mengubah status aktivasi pengguna.', 'error');
    } finally {
      setUpdatingStatusUserId(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.email.trim() || !newUserData.password) {
      showToast('Email dan Password wajib diisi.', 'error');
      return;
    }
    if (newUserData.password.length < 8) {
      showToast('Password minimal harus terdiri dari 8 karakter.', 'error');
      return;
    }

    setIsSubmittingUser(true);
    try {
      await adminService.createUser({
        email: newUserData.email.trim(),
        password: newUserData.password,
        full_name: newUserData.full_name.trim(),
        role: newUserData.role,
      });
      showToast('Pengguna baru berhasil ditambahkan.', 'success');
      
      // Reset & Close Modal
      setIsModalOpen(false);
      setNewUserData({
        email: '',
        password: '',
        full_name: '',
        role: 'user',
      });
      
      // Refresh list
      void fetchUsers();
    } catch (err) {
      console.error('Failed to create user:', err);
      showToast('Gagal menambahkan pengguna baru. Pastikan email belum terdaftar.', 'error');
    } finally {
      setIsSubmittingUser(false);
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = log.user.full_name?.toLowerCase().includes(term);
    const emailMatch = log.user.email?.toLowerCase().includes(term);
    const actionMatch = log.action.toLowerCase().includes(term);
    const areaIdMatch = String(log.hara_area_id).includes(term);
    const areaNameMatch = log.area_name?.toLowerCase().includes(term);
    return nameMatch || emailMatch || actionMatch || areaIdMatch || areaNameMatch;
  });

  if (isAuthLoading || !isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="text-xl font-bold text-primary animate-pulse font-display">
          Memverifikasi Akses Administrator...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-surface-dim p-4 md:p-10 overflow-y-auto pb-24 pointer-events-auto relative z-20">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-on-surface font-display flex items-center gap-2.5">
            <ShieldCheckIcon className="w-8 h-8 text-primary" />
            Panel Administrasi SAFRONS
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm md:text-base font-sans">
            Mengelola akun pengguna, hak akses, dan memantau log audit perubahan data lahan oleh pakar.
          </p>
        </div>

        {/* Tab Controls & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/60 pb-1.5 gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-5 py-2.5 font-display font-bold text-sm md:text-base border-b-2 transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Manajemen Pengguna
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-5 py-2.5 font-display font-bold text-sm md:text-base border-b-2 transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Log Audit Perubahan Lahan
            </button>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            {activeTab === 'users' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full font-bold font-display hover:bg-primary/95 transition-all shadow-md active:scale-95 cursor-pointer text-sm"
              >
                <UserPlusIcon className="w-4 h-4" />
                Tambah Pengguna
              </button>
            )}
            <button
              onClick={handleRefresh}
              disabled={activeTab === 'users' ? isUsersLoading : isAuditLogsLoading}
              className="px-5 py-2.5 bg-surface hover:bg-surface-container border border-outline text-on-surface rounded-full font-bold font-display transition-all disabled:opacity-50 text-sm cursor-pointer"
            >
              Segarkan
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === 'users' ? (
          <div className="space-y-6">
            <UserTable
              users={users}
              isLoading={isUsersLoading}
              onRoleChange={handleRoleChange}
              onStatusToggle={handleStatusToggle}
              updatingUserId={updatingUserId}
              updatingStatusUserId={updatingStatusUserId}
              currentAdminId={user?.id}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search Filter for Audit Logs */}
            <div className="relative max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface border border-outline-variant px-4 py-2.5 pl-10 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                placeholder="Cari berdasarkan pakar, lahan, aksi..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant/70">
                <MagnifyingGlassIcon className="h-4 w-4" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Audit Logs Table */}
            {isAuditLogsLoading ? (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 text-center animate-pulse shadow-md">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-on-surface-variant text-sm font-medium">Memuat log audit...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-10 text-center text-on-surface-variant shadow-md">
                <ClockIcon className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-4" />
                <h4 className="font-bold font-display text-lg text-on-surface mb-1">
                  {searchTerm ? 'Pencarian Tidak Ditemukan' : 'Tidak Ada Log Audit'}
                </h4>
                <p className="text-sm max-w-sm mx-auto font-sans">
                  {searchTerm
                    ? `Tidak ada log audit yang cocok dengan kata kunci "${searchTerm}".`
                    : 'Belum ada log riwayat perubahan data lahan yang tercatat oleh pakar.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-outline-variant rounded-3xl bg-surface-container-lowest shadow-md">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className="bg-surface-dim border-b border-outline-variant/60 text-xs font-bold text-on-surface-variant font-display uppercase tracking-wider">
                      <th className="px-6 py-4">Waktu</th>
                      <th className="px-6 py-4">Pakar</th>
                      <th className="px-6 py-4">Aksi</th>
                      <th className="px-6 py-4">Lahan</th>
                      <th className="px-6 py-4">Detail Perubahan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30 text-sm text-on-surface">
                    {filteredLogs.map((log) => {
                      const logDate = new Date(log.created_at);
                      const formattedDate = new Intl.DateTimeFormat('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      }).format(logDate);

                      return (
                        <tr key={log.id} className="hover:bg-surface-bright/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-on-surface-variant font-medium text-xs">
                            {formattedDate}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold">{log.user.full_name || 'Tanpa Nama'}</div>
                            <div className="text-xs text-on-surface-variant font-mono">{log.user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-bold font-display uppercase tracking-wide border ${
                                log.action === 'create'
                                  ? 'bg-success/10 text-success border-success/20'
                                  : 'bg-primary-container text-primary border-primary/20'
                              }`}
                            >
                              {log.action === 'create' ? 'Buat' : 'Ubah'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold text-xs text-on-surface-variant">ID: {log.hara_area_id}</div>
                            <div className="font-medium text-sm text-on-surface">{log.area_name || 'Nama Lahan Tidak Tersedia'}</div>
                          </td>
                          <td className="px-6 py-4 max-w-md">
                            <div className="flex flex-wrap gap-1.5">
                              {Object.entries(log.changed_fields).map(([key, value]) => (
                                <span
                                  key={key}
                                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface border border-outline-variant/75 text-on-surface-variant"
                                >
                                  <span className="font-bold text-primary mr-1">{formatFieldLabel(key)}:</span>
                                  <span>{formatFieldValue(value)}</span>
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Creation Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-xl w-full max-w-md animate-fade-in-up border border-outline-variant relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-on-surface-variant hover:bg-surface-dim rounded-full transition-all"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-xl text-on-surface mb-6 flex items-center gap-2">
              <UserPlusIcon className="w-6 h-6 text-primary" />
              Tambah Pengguna Baru
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 font-display">
                  Nama Lengkap (Opsional)
                </label>
                <input
                  type="text"
                  value={newUserData.full_name}
                  onChange={(e) => setNewUserData((prev) => ({ ...prev, full_name: e.target.value }))}
                  className="w-full bg-surface border border-outline-variant/80 px-4 py-3 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                  placeholder="Masukkan nama lengkap..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 font-display">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={(e) => setNewUserData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-surface border border-outline-variant/80 px-4 py-3 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                  placeholder="contoh: budi@gmail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 font-display">
                  Password (Minimal 8 Karakter)
                </label>
                <input
                  type="password"
                  required
                  value={newUserData.password}
                  onChange={(e) => setNewUserData((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-surface border border-outline-variant/80 px-4 py-3 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                  placeholder="Masukkan password..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 font-display">
                  Role / Hak Akses
                </label>
                <div className="relative">
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData((prev) => ({ ...prev, role: e.target.value as any }))}
                    className="w-full bg-surface border border-outline-variant/80 hover:border-primary/50 rounded-xl pl-4 pr-10 py-3 text-sm text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer appearance-none"
                  >
                    <option value="user">Petani (User)</option>
                    <option value="expert">Pakar</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant/65">
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/55">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="font-sans px-5 py-2.5 rounded-full border border-outline text-on-surface-variant hover:bg-surface-dim transition-colors text-sm font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser}
                  className="font-sans bg-primary text-white rounded-full px-5 py-2.5 hover:bg-primary/95 transition-colors text-sm font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingUser ? 'Menyimpan...' : 'Tambah Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const formatFieldLabel = (key: string): string => {
  const labels: Record<string, string> = {
    name: 'Nama Lahan',
    ph_rata2: 'pH Rata-rata',
    n_rata2: 'Kadar N',
    p_rata2: 'Kadar P',
    k_rata2: 'Kadar K',
    slope__: 'Kemiringan Lereng (%)',
    texture_of: 'Tekstur Tanah',
    geometry_type: 'Tipe Geometri',
  };
  return labels[key] || key;
};

const formatFieldValue = (value: any): string => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  return String(value);
};

