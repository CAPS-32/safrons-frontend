import api from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
}

export interface UserProfile {
  id: number;
  email: string;
  full_name: string | null;
  role: 'user' | 'expert' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/v1/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterPayload): Promise<UserProfile> => {
    const response = await api.post<UserProfile>('/api/v1/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/api/v1/auth/me');
    return response.data;
  },
};
