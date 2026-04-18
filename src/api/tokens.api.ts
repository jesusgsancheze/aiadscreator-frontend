import api from './axios';
import type {
  TokenTransaction,
  CampaignCost,
  PaymentMethodConfig,
  IncomeReport,
  AdminTransactionFilters,
  IncomeReportFilters,
} from '../types/tokens';

export const tokensApi = {
  // User endpoints
  getBalance: async (): Promise<{ balance: number }> => {
    const { data } = await api.get('/tokens/balance');
    return data;
  },

  getCampaignCost: async (imageCount: number): Promise<CampaignCost> => {
    const { data } = await api.get(`/tokens/campaign-cost?imageCount=${imageCount}`);
    return data;
  },

  createPurchase: async (payload: {
    packageId?: string;
    tokens: number;
    amountUsd: number;
    paymentMethod: string;
    paymentReference: string;
  }): Promise<TokenTransaction> => {
    const { data } = await api.post('/tokens/purchase', payload);
    return data;
  },

  uploadPaymentProof: async (id: string, file: File): Promise<TokenTransaction> => {
    const formData = new FormData();
    formData.append('paymentProof', file);
    const { data } = await api.post(`/tokens/purchase/${id}/proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  getUserTransactions: async (): Promise<TokenTransaction[]> => {
    const { data } = await api.get('/tokens/transactions');
    return data;
  },

  // Admin endpoints
  getAdminTransactions: async (filters?: AdminTransactionFilters): Promise<{ data: TokenTransaction[]; total: number }> => {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.userId) params.set('userId', filters.userId);
    if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.set('dateTo', filters.dateTo);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.limit) params.set('limit', String(filters.limit));
    const { data } = await api.get(`/tokens/admin/transactions?${params.toString()}`);
    return data;
  },

  grantTokens: async (payload: {
    userId: string;
    tokens: number;
    note?: string;
  }): Promise<TokenTransaction> => {
    const { data } = await api.post('/tokens/admin/grant', payload);
    return data;
  },

  reviewTransaction: async (
    id: string,
    payload: { status: 'approved' | 'rejected'; adminNote?: string },
  ): Promise<TokenTransaction> => {
    const { data } = await api.patch(`/tokens/admin/transactions/${id}/review`, payload);
    return data;
  },

  getIncomeReport: async (filters?: IncomeReportFilters): Promise<IncomeReport> => {
    const params = new URLSearchParams();
    if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.set('dateTo', filters.dateTo);
    if (filters?.userId) params.set('userId', filters.userId);
    const { data } = await api.get(`/tokens/admin/income-report?${params.toString()}`);
    return data;
  },

  getPaymentMethods: async (): Promise<PaymentMethodConfig[]> => {
    const { data } = await api.get('/tokens/admin/payment-methods');
    return data;
  },

  updatePaymentMethod: async (
    type: string,
    payload: { isActive: boolean; config: Record<string, string> },
  ): Promise<PaymentMethodConfig> => {
    const { data } = await api.patch(`/tokens/admin/payment-methods/${type}`, payload);
    return data;
  },

  getAdminSettings: async (key: string): Promise<{ key: string; value: string[] }> => {
    const { data } = await api.get(`/tokens/admin/settings/${key}`);
    return data;
  },

  updateAdminSettings: async (key: string, value: string[]): Promise<{ key: string; value: string[] }> => {
    const { data } = await api.patch(`/tokens/admin/settings/${key}`, { value });
    return data;
  },
};
