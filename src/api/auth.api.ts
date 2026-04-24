import api from './axios';
import type { User } from '../types/user';

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
  accessToken: string;
  user: User;
}

export const authApi = {
  register: async (payload: RegisterPayload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },

  verifyEmail: async (token: string) => {
    const { data } = await api.get(`/auth/verify-email?token=${token}`);
    return data;
  },

  resendVerification: async (email: string) => {
    const { data } = await api.post('/auth/resend-verification', { email });
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  updateLanguage: async (language: string) => {
    const { data } = await api.patch('/auth/me/language', { language });
    return data;
  },
};
