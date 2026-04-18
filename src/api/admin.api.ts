import api from './axios';
import type { User } from '../types/user';
import type { Client } from '../types/client';
import type { Campaign } from '../types/campaign';

interface AdminDashboard {
  totalUsers: number;
  totalClients: number;
  totalCampaigns: number;
  avgPerformance: number;
  recentUsers: User[];
  campaignsByStatus: Record<string, number>;
}

export const adminApi = {
  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get('/admin/users');
    return data;
  },

  getUser: async (id: string): Promise<User> => {
    const { data } = await api.get(`/admin/users/${id}`);
    return data;
  },

  getClients: async (): Promise<Client[]> => {
    const { data } = await api.get('/admin/clients');
    return data;
  },

  getCampaigns: async (): Promise<Campaign[]> => {
    const { data } = await api.get('/admin/campaigns');
    return data;
  },

  getDashboard: async (): Promise<AdminDashboard> => {
    const { data } = await api.get('/admin/dashboard');
    return data;
  },
};
