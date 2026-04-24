import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { tokensApi } from '../api/tokens.api';
import type { AdminTransactionFilters, IncomeReportFilters } from '../types/tokens';

export function useTokenBalance() {
  return useQuery({
    queryKey: ['token-balance'],
    queryFn: tokensApi.getBalance,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
}

export function useCampaignCost(imageCount: number) {
  return useQuery({
    queryKey: ['campaign-cost', imageCount],
    queryFn: () => tokensApi.getCampaignCost(imageCount),
    enabled: imageCount > 0,
  });
}

export function useCreatePurchase() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: tokensApi.createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['token-balance'] });
      queryClient.invalidateQueries({ queryKey: ['user-transactions'] });
      toast.success(t('tokens.paymentSubmitted'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useUploadPaymentProof() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      tokensApi.uploadPaymentProof(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-transactions'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useUserTransactions() {
  return useQuery({
    queryKey: ['user-transactions'],
    queryFn: tokensApi.getUserTransactions,
  });
}

export function useAdminTransactions(filters?: AdminTransactionFilters) {
  return useQuery({
    queryKey: ['admin-transactions', filters],
    queryFn: () => tokensApi.getAdminTransactions(filters),
  });
}

export function useAdminGrantTokens() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: tokensApi.grantTokens,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['token-balance'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useReviewTransaction() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, status, adminNote }: { id: string; status: 'approved' | 'rejected'; adminNote?: string }) =>
      tokensApi.reviewTransaction(id, { status, adminNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['token-balance'] });
      queryClient.invalidateQueries({ queryKey: ['user-transactions'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useIncomeReport(filters?: IncomeReportFilters) {
  return useQuery({
    queryKey: ['income-report', filters],
    queryFn: () => tokensApi.getIncomeReport(filters),
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: tokensApi.getPaymentMethods,
  });
}

export function useAdminPaymentMethods() {
  return useQuery({
    queryKey: ['admin-payment-methods'],
    queryFn: tokensApi.getAdminPaymentMethods,
  });
}

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ type, isActive, config }: { type: string; isActive: boolean; config: Record<string, string> }) =>
      tokensApi.updatePaymentMethod(type, { isActive, config }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      queryClient.invalidateQueries({ queryKey: ['admin-payment-methods'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useAdminSettings<T = unknown>(key: string) {
  return useQuery({
    queryKey: ['admin-settings', key],
    queryFn: () => tokensApi.getAdminSettings<T>(key),
    enabled: !!key,
  });
}

export function useUpdateAdminSettings<T = unknown>() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: T }) =>
      tokensApi.updateAdminSettings<T>(key, value),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings', vars.key] });
      queryClient.invalidateQueries({ queryKey: ['platform-availability'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}
