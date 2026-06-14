import { apiClient } from './axios';
import type { UserRead, UserRegister, HaraAreaChangeRead } from '../types/api.types';

export interface UserCreateAdminPayload extends UserRegister {
  role: 'user' | 'expert' | 'admin';
}

export const adminService = {
  getUsers: async (): Promise<UserRead[]> => {
    const response = await apiClient.get<UserRead[]>('/api/v1/admin/users');
    return response.data;
  },

  createUser: async (data: UserCreateAdminPayload): Promise<UserRead> => {
    const response = await apiClient.post<UserRead>('/api/v1/admin/users', data);
    return response.data;
  },

  updateUserRole: async (userId: number, role: 'user' | 'expert' | 'admin'): Promise<UserRead> => {
    const response = await apiClient.patch<UserRead>(`/api/v1/admin/users/${userId}/role`, { role });
    return response.data;
  },

  toggleUserStatus: async (userId: number, isActive: boolean): Promise<UserRead> => {
    const response = await apiClient.patch<UserRead>(`/api/v1/admin/users/${userId}/status`, { is_active: isActive });
    return response.data;
  },

  getAuditLogs: async (): Promise<HaraAreaChangeRead[]> => {
    const response = await apiClient.get<HaraAreaChangeRead[]>('/api/v1/admin/audit-logs');
    return response.data;
  },
};

