import api from './axios';
import type { User } from '../types/user';
import type { ApiResponse } from '../types/api';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  language?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  login: async (payload: LoginPayload): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },

  verifyEmail: async (token: string): Promise<ApiResponse<{ message: string }>> => {
    const { data } = await api.get(`/auth/verify-email?token=${token}`);
    return data;
  },

  resendVerification: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    const { data } = await api.post('/auth/resend-verification', { email });
    return data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const { data } = await api.get('/auth/profile');
    return data;
  },

  updateLanguage: async (language: string): Promise<ApiResponse<User>> => {
    const { data } = await api.patch('/auth/language', { language });
    return data;
  },
};
