import api from './axios';
import type {
  MetaConnection,
  CreateMetaConnectionPayload,
  UpdateMetaConnectionPayload,
  PublishCampaignPayload,
  PublishCampaignResponse,
  MetaInsights,
} from '../types/meta';

export const metaApi = {
  createConnection: async (payload: CreateMetaConnectionPayload): Promise<MetaConnection> => {
    const { data } = await api.post('/meta/connections', payload);
    return data;
  },

  getConnections: async (): Promise<MetaConnection[]> => {
    const { data } = await api.get('/meta/connections');
    return data;
  },

  getConnectionByClient: async (clientId: string): Promise<MetaConnection> => {
    const { data } = await api.get(`/meta/connections/${clientId}`);
    return data;
  },

  updateConnection: async (id: string, payload: UpdateMetaConnectionPayload): Promise<MetaConnection> => {
    const { data } = await api.patch(`/meta/connections/${id}`, payload);
    return data;
  },

  deleteConnection: async (id: string): Promise<void> => {
    const { data } = await api.delete(`/meta/connections/${id}`);
    return data;
  },

  verifyConnection: async (id: string): Promise<MetaConnection> => {
    const { data } = await api.post(`/meta/connections/${id}/verify`);
    return data;
  },

  publishCampaign: async (payload: PublishCampaignPayload): Promise<PublishCampaignResponse> => {
    const { data } = await api.post('/meta/publish', payload);
    return data;
  },

  getInsights: async (metaCampaignId: string): Promise<MetaInsights> => {
    const { data } = await api.get(`/meta/insights/${metaCampaignId}`);
    return data;
  },
};
