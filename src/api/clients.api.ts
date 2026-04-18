import api from './axios';
import type { Client } from '../types/client';

export const clientsApi = {
  getClients: async (): Promise<Client[]> => {
    const { data } = await api.get('/clients');
    return data;
  },

  getClient: async (id: string): Promise<Client> => {
    const { data } = await api.get(`/clients/${id}`);
    return data;
  },

  createClient: async (formData: FormData): Promise<Client> => {
    const { data } = await api.post('/clients', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  updateClient: async (id: string, formData: FormData): Promise<Client> => {
    const { data } = await api.patch(`/clients/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteClient: async (id: string): Promise<void> => {
    const { data } = await api.delete(`/clients/${id}`);
    return data;
  },
};
