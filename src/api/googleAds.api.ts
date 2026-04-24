import api from './axios';
import type {
  GoogleAdsConnection,
  OAuthStartResponse,
  SelectCustomerPayload,
  VerifyConnectionResponse,
  PublishPmaxPayload,
  PublishPmaxResponse,
} from '../types/google-ads';

export const googleAdsApi = {
  startOAuth: async (clientId: string): Promise<OAuthStartResponse> => {
    const { data } = await api.get('/google-ads/oauth/start', {
      params: { clientId },
    });
    return data;
  },

  getConnection: async (id: string): Promise<GoogleAdsConnection> => {
    const { data } = await api.get(`/google-ads/connections/${id}`);
    return data;
  },

  getConnectionByClient: async (
    clientId: string,
  ): Promise<GoogleAdsConnection | null> => {
    const { data } = await api.get(
      `/google-ads/connections/by-client/${clientId}`,
    );
    return data;
  },

  listConnections: async (): Promise<GoogleAdsConnection[]> => {
    const { data } = await api.get('/google-ads/connections');
    return data;
  },

  selectCustomer: async (
    id: string,
    payload: SelectCustomerPayload,
  ): Promise<GoogleAdsConnection> => {
    const { data } = await api.post(
      `/google-ads/connections/${id}/select-customer`,
      payload,
    );
    return data;
  },

  verifyConnection: async (id: string): Promise<VerifyConnectionResponse> => {
    const { data } = await api.post(`/google-ads/connections/${id}/verify`);
    return data;
  },

  deleteConnection: async (
    id: string,
  ): Promise<{ _id: string; isActive: boolean }> => {
    const { data } = await api.delete(`/google-ads/connections/${id}`);
    return data;
  },

  publishCampaign: async (
    payload: PublishPmaxPayload,
  ): Promise<PublishPmaxResponse> => {
    const { data } = await api.post('/google-ads/publish', payload);
    return data;
  },
};
