import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { adminService } from '../../services/admin.service';
import UserTable from '../../components/admin/UserTable';
import { ShieldCheckIcon, UserPlusIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import type { UserRead } from '../../types/api.types';

export default function AdminPanelPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserRead[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [updatingStatusUserId, setUpdatingStatusUserId] = useState<number | null>(null);

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

  useEffect(() => {
    if (!isAuthLoading && !isAdmin) {
      showToast('Akses ditolak. Halaman ini hanya untuk Administrator.', 'error');
      void navigate('/dashboard');
    } else if (isAdmin) {
      void fetchUsers();
    }
  }, [isAdmin, isAuthLoading, navigate, showToast]);

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
        
        {/* User Management Actions & Table */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-on-surface font-display flex items-center gap-2.5">
                <ShieldCheckIcon className="w-8 h-8 text-primary" />
                Manajemen Pengguna & Hak Akses
              </h1>
              <p className="text-on-surface-variant mt-2 text-sm md:text-base">
                Daftar pengguna terdaftar di SAFRONS. Anda dapat mengubah peran atau mengaktifkan/menonaktifkan akun.
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-full font-bold font-display hover:bg-primary/95 transition-all shadow-md active:scale-95 cursor-pointer text-sm"
              >
                <UserPlusIcon className="w-4 h-4" />
                Tambah Pengguna
              </button>
              <button
                onClick={() => void fetchUsers()}
                disabled={isUsersLoading}
                className="px-5 py-3 bg-surface hover:bg-surface-container border border-outline text-on-surface rounded-full font-bold font-display transition-all disabled:opacity-50 text-sm cursor-pointer"
              >
                Segarkan
              </button>
            </div>
          </div>

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
