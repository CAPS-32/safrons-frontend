import { apiClient } from './axios';
import type { Token, UserRead, UserLogin, UserRegister } from '../types/api.types';

export const authService = {
  login: async (data: UserLogin): Promise<Token> => {
    const response = await apiClient.post<Token>('/api/v1/auth/login', data);
    return response.data;
  },

  register: async (data: UserRegister): Promise<UserRead> => {
    const response = await apiClient.post<UserRead>('/api/v1/auth/register', data);
    return response.data;
  },

  getMe: async (): Promise<UserRead> => {
    const response = await apiClient.get<UserRead>('/api/v1/auth/me');
    return response.data;
  },
};
