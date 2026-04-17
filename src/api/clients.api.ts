import api from './axios';
import type { Client } from '../types/client';
import type { ApiResponse } from '../types/api';

export const clientsApi = {
  getClients: async (): Promise<ApiResponse<Client[]>> => {
    const { data } = await api.get('/clients');
    return data;
  },

  getClient: async (id: string): Promise<ApiResponse<Client>> => {
    const { data } = await api.get(`/clients/${id}`);
    return data;
  },

  createClient: async (formData: FormData): Promise<ApiResponse<Client>> => {
    const { data } = await api.post('/clients', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  updateClient: async (id: string, formData: FormData): Promise<ApiResponse<Client>> => {
    const { data } = await api.put(`/clients/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteClient: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/clients/${id}`);
    return data;
  },
};
