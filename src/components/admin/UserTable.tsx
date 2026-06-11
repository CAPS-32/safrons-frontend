import type { UserRead } from '../../types/api.types';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface UserTableProps {
  users: UserRead[];
  isLoading: boolean;
  onRoleChange: (userId: number, newRole: 'user' | 'expert' | 'admin') => void;
  onStatusToggle: (userId: number, currentStatus: boolean) => void;
  updatingUserId: number | null;
  updatingStatusUserId: number | null;
  currentAdminId?: number;
}

export default function UserTable({
  users,
  isLoading,
  onRoleChange,
  onStatusToggle,
  updatingUserId,
  updatingStatusUserId,
  currentAdminId,
}: UserTableProps) {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-md overflow-hidden animate-pulse">
        <div className="min-w-full divide-y divide-outline-variant/40">
          <div className="bg-surface-dim px-6 py-4 grid grid-cols-7 gap-4">
            <div className="h-4 bg-outline-variant/60 rounded w-1/2"></div>
            <div className="h-4 bg-outline-variant/60 rounded w-2/3"></div>
            <div className="h-4 bg-outline-variant/60 rounded w-1/3"></div>
            <div className="h-4 bg-outline-variant/60 rounded w-1/3"></div>
            <div className="h-4 bg-outline-variant/60 rounded w-1/2"></div>
            <div className="h-4 bg-outline-variant/60 rounded w-1/3"></div>
            <div className="h-4 bg-outline-variant/60 rounded w-1/3"></div>
          </div>
          <div className="divide-y divide-outline-variant/30">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="px-6 py-5 grid grid-cols-7 gap-4">
                <div className="h-4 bg-outline-variant/40 rounded w-3/4"></div>
                <div className="h-4 bg-outline-variant/40 rounded w-5/6"></div>
                <div className="h-4 bg-outline-variant/40 rounded w-2/3"></div>
                <div className="h-4 bg-outline-variant/40 rounded w-1/2"></div>
                <div className="h-4 bg-outline-variant/40 rounded w-1/2"></div>
                <div className="h-6 bg-outline-variant/40 rounded-full w-18"></div>
                <div className="h-6 bg-outline-variant/40 rounded-full w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-16 bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm">
        <p className="text-on-surface-variant font-medium text-lg">Tidak ada data pengguna ditemukan.</p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getRoleBadgeClass = (role: 'user' | 'expert' | 'admin') => {
    switch (role) {
      case 'admin':
        return 'bg-error-container text-error border border-error/20';
      case 'expert':
        return 'bg-primary-container text-primary border border-primary/20';
      default:
        return 'bg-secondary-container text-secondary border border-secondary/20';
    }
  };

  const translateRole = (role: 'user' | 'expert' | 'admin') => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'expert':
        return 'Pakar';
      default:
        return 'Petani (User)';
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-md overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="min-w-[768px] md:min-w-full divide-y divide-outline-variant/40">
          <thead className="bg-surface-dim text-left">
            <tr>
              <th className="px-4 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama</th>
              <th className="px-4 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</th>
              <th className="px-4 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tanggal Daftar</th>
              <th className="px-4 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Role Saat Ini</th>
              <th className="px-4 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ubah Akses</th>
              <th className="px-4 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-4 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30 text-sm">
            {users.map((u) => {
              const isSelf = u.id === currentAdminId;
              return (
                <tr key={u.id} className="hover:bg-surface-bright/50 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-on-surface whitespace-nowrap">
                    {u.full_name || 'Tidak ada nama'}
                    {isSelf && <span className="ml-2 text-[10px] bg-outline-variant text-on-surface-variant font-bold px-1.5 py-0.5 rounded-md">Anda</span>}
                  </td>
                  <td className="px-4 py-3.5 text-on-surface-variant whitespace-nowrap font-mono text-xs">
                    {u.email}
                  </td>
                  <td className="px-4 py-3.5 text-on-surface-variant whitespace-nowrap">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-display inline-block ${getRoleBadgeClass(u.role)}`}>
                      {translateRole(u.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="relative inline-block w-40">
                      <select
                        value={u.role}
                        disabled={updatingUserId === u.id || isSelf}
                        onChange={(e) => onRoleChange(u.id, e.target.value as 'user' | 'expert' | 'admin')}
                        className="w-full bg-surface border border-outline-variant/80 hover:border-primary/50 rounded-xl pl-4 pr-10 py-2.5 text-xs text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="user">Petani (User)</option>
                        <option value="expert">Pakar</option>
                        <option value="admin">Admin</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant/65">
                        <ChevronDownIcon className="h-4 w-4" />
                      </div>
                      {updatingUserId === u.id && (
                        <span className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold w-24 justify-center ${
                      u.is_active ? 'bg-success/10 text-success' : 'bg-outline-variant text-on-surface-variant/70'
                    }`}>
                      {u.is_active ? 'Aktif' : 'Non-aktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <label className={`relative inline-flex items-center ${isSelf ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                        <input
                          type="checkbox"
                          checked={u.is_active}
                          disabled={updatingStatusUserId === u.id || isSelf}
                          onChange={() => onStatusToggle(u.id, u.is_active)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-outline-variant/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary animate-all duration-200"></div>
                      </label>

                      {updatingStatusUserId === u.id && (
                        <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
