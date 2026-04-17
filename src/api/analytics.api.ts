import api from './axios';
import type { ApiResponse } from '../types/api';

interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  avgPerformance: number;
  totalClients: number;
}

interface TimelinePoint {
  date: string;
  performance: number;
  campaigns: number;
}

interface Insights {
  topPerformingCampaign: string | null;
  bestSocialMedia: string | null;
  avgEngagement: number;
  recommendations: string[];
}

export const analyticsApi = {
  getInsights: async (): Promise<ApiResponse<Insights>> => {
    const { data } = await api.get('/analytics/insights');
    return data;
  },

  getDashboard: async (): Promise<ApiResponse<DashboardStats>> => {
    const { data } = await api.get('/analytics/dashboard');
    return data;
  },

  getTimeline: async (): Promise<ApiResponse<TimelinePoint[]>> => {
    const { data } = await api.get('/analytics/timeline');
    return data;
  },
};
