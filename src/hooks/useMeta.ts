import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { metaApi } from '../api/meta.api';
import type { UpdateMetaConnectionPayload } from '../types/meta';

export function useMetaConnections() {
  return useQuery({
    queryKey: ['meta-connections'],
    queryFn: metaApi.getConnections,
  });
}

export function useMetaConnection(clientId: string) {
  return useQuery({
    queryKey: ['meta-connections', clientId],
    queryFn: () => metaApi.getConnectionByClient(clientId),
    enabled: !!clientId,
    retry: false,
  });
}

export function useCreateMetaConnection() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: metaApi.createConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meta-connections'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useUpdateMetaConnection() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMetaConnectionPayload }) =>
      metaApi.updateConnection(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meta-connections'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useDeleteMetaConnection() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: metaApi.deleteConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meta-connections'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useVerifyMetaConnection() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: metaApi.verifyConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meta-connections'] });
      toast.success(t('meta.verifySuccess'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('meta.verifyFailed'));
    },
  });
}

export function usePublishToMeta() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: metaApi.publishCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success(t('meta.publishSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('meta.publishFailed'));
    },
  });
}

export function useMetaInsights(metaCampaignId: string) {
  return useQuery({
    queryKey: ['meta-insights', metaCampaignId],
    queryFn: () => metaApi.getInsights(metaCampaignId),
    enabled: !!metaCampaignId,
  });
}
