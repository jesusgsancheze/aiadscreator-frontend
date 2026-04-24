import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { googleAdsApi } from '../api/googleAds.api';
import type { SelectCustomerPayload } from '../types/google-ads';

export function useGoogleAdsConnections() {
  return useQuery({
    queryKey: ['google-ads-connections'],
    queryFn: googleAdsApi.listConnections,
  });
}

export function useGoogleAdsConnection(clientId: string) {
  return useQuery({
    queryKey: ['google-ads-connections', 'by-client', clientId],
    queryFn: () => googleAdsApi.getConnectionByClient(clientId),
    enabled: !!clientId,
    retry: false,
  });
}

export function useGoogleAdsConnectionById(id: string) {
  return useQuery({
    queryKey: ['google-ads-connections', id],
    queryFn: () => googleAdsApi.getConnection(id),
    enabled: !!id,
    retry: false,
  });
}

export function useStartGoogleAdsOAuth() {
  return useMutation({
    mutationFn: (clientId: string) => googleAdsApi.startOAuth(clientId),
  });
}

export function useSelectGoogleAdsCustomer() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SelectCustomerPayload }) =>
      googleAdsApi.selectCustomer(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['google-ads-connections'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useVerifyGoogleAdsConnection() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: googleAdsApi.verifyConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['google-ads-connections'] });
      toast.success(t('googleAds.verifySuccess'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('googleAds.verifyFailed'));
    },
  });
}

export function usePublishToGoogleAds() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: googleAdsApi.publishCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success(t('googleAds.publishSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('googleAds.publishFailed'));
    },
  });
}

export function useDeleteGoogleAdsConnection() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: googleAdsApi.deleteConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['google-ads-connections'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}
