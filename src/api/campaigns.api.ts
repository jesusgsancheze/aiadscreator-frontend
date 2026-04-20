import api from './axios';
import type { Campaign } from '../types/campaign';

interface CampaignFilters {
  page?: number;
  limit?: number;
  status?: string;
  socialMedia?: string;
  clientId?: string;
  search?: string;
}

interface PaginatedCampaigns {
  data: Campaign[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const campaignsApi = {
  getCampaigns: async (filters?: CampaignFilters): Promise<PaginatedCampaigns> => {
    const params = new URLSearchParams();
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.limit) params.set('limit', String(filters.limit));
    if (filters?.status) params.set('status', filters.status);
    if (filters?.socialMedia) params.set('socialMedia', filters.socialMedia);
    if (filters?.clientId) params.set('clientId', filters.clientId);
    if (filters?.search) params.set('search', filters.search);
    const { data } = await api.get(`/campaigns?${params.toString()}`);
    // Backend returns { campaigns, total } — normalize to { data, total, page, limit, totalPages }
    const campaigns = data.campaigns ?? data.data ?? [];
    const total = data.total ?? 0;
    const page = data.page ?? (filters?.page || 1);
    const limit = data.limit ?? (filters?.limit || 20);
    const totalPages = Math.ceil(total / limit) || 1;
    return { data: campaigns, total, page, limit, totalPages };
  },

  getCampaign: async (id: string): Promise<Campaign> => {
    const { data } = await api.get(`/campaigns/${id}`);
    return data;
  },

  createCampaign: async (formData: FormData): Promise<Campaign> => {
    const { data } = await api.post('/campaigns', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  updateCampaign: async (id: string, payload: Partial<Campaign>): Promise<Campaign> => {
    const { data } = await api.patch(`/campaigns/${id}`, payload);
    return data;
  },

  deleteCampaign: async (id: string): Promise<void> => {
    const { data } = await api.delete(`/campaigns/${id}`);
    return data;
  },

  generateContent: async (id: string): Promise<Campaign> => {
    const { data } = await api.post(`/campaigns/${id}/generate`);
    return data;
  },

  selectImage: async (id: string, imageIndex: number): Promise<Campaign> => {
    const { data } = await api.patch(`/campaigns/${id}/select-image`, { selectedImage: imageIndex });
    return data;
  },

  updatePerformance: async (
    id: string,
    payload: { socialMediaLink?: string; analytics?: Record<string, number> },
  ): Promise<Campaign> => {
    const { data } = await api.patch(`/campaigns/${id}/performance`, payload);
    return data;
  },

  refineCopy: async (id: string, instructions: string): Promise<Campaign> => {
    const { data } = await api.post(`/campaigns/${id}/refine-copy`, { instructions });
    return data;
  },

  refineCaption: async (id: string, instructions: string): Promise<Campaign> => {
    const { data } = await api.post(`/campaigns/${id}/refine-caption`, { instructions });
    return data;
  },

  generateMoreImages: async (id: string, count: number, instructions?: string): Promise<Campaign> => {
    const { data } = await api.post(`/campaigns/${id}/generate-images`, { count, instructions });
    return data;
  },

  deleteImage: async (id: string, imageIndex: number): Promise<Campaign> => {
    const { data } = await api.delete(`/campaigns/${id}/images/${imageIndex}`);
    return data;
  },

  uploadImage: async (id: string, file: File): Promise<Campaign> => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post(`/campaigns/${id}/images/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
