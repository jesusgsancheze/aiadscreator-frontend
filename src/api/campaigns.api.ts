import api from './axios';
import type { Campaign } from '../types/campaign';
import type { ApiResponse, PaginatedResponse } from '../types/api';

interface CampaignFilters {
  page?: number;
  limit?: number;
  status?: string;
  socialMedia?: string;
  clientId?: string;
  search?: string;
}

export const campaignsApi = {
  getCampaigns: async (filters?: CampaignFilters): Promise<PaginatedResponse<Campaign>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.limit) params.set('limit', String(filters.limit));
    if (filters?.status) params.set('status', filters.status);
    if (filters?.socialMedia) params.set('socialMedia', filters.socialMedia);
    if (filters?.clientId) params.set('clientId', filters.clientId);
    if (filters?.search) params.set('search', filters.search);
    const { data } = await api.get(`/campaigns?${params.toString()}`);
    return data;
  },

  getCampaign: async (id: string): Promise<ApiResponse<Campaign>> => {
    const { data } = await api.get(`/campaigns/${id}`);
    return data;
  },

  createCampaign: async (formData: FormData): Promise<ApiResponse<Campaign>> => {
    const { data } = await api.post('/campaigns', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  updateCampaign: async (id: string, payload: Partial<Campaign>): Promise<ApiResponse<Campaign>> => {
    const { data } = await api.put(`/campaigns/${id}`, payload);
    return data;
  },

  deleteCampaign: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/campaigns/${id}`);
    return data;
  },

  generateContent: async (id: string): Promise<ApiResponse<Campaign>> => {
    const { data } = await api.post(`/campaigns/${id}/generate`);
    return data;
  },

  selectImage: async (id: string, imageIndex: number): Promise<ApiResponse<Campaign>> => {
    const { data } = await api.patch(`/campaigns/${id}/select-image`, { selectedImage: imageIndex });
    return data;
  },

  updatePerformance: async (
    id: string,
    payload: { socialMediaLink?: string; analytics?: Record<string, number> },
  ): Promise<ApiResponse<Campaign>> => {
    const { data } = await api.patch(`/campaigns/${id}/performance`, payload);
    return data;
  },
};
