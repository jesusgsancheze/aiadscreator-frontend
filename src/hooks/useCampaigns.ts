import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { campaignsApi } from '../api/campaigns.api';

interface CampaignFilters {
  page?: number;
  limit?: number;
  status?: string;
  socialMedia?: string;
  clientId?: string;
  search?: string;
}

export function useCampaigns(filters?: CampaignFilters) {
  return useQuery({
    queryKey: ['campaigns', filters],
    queryFn: () => campaignsApi.getCampaigns(filters),
  });
}

export function usePlatformAvailability() {
  return useQuery({
    queryKey: ['platform-availability'],
    queryFn: () => campaignsApi.getPlatformAvailability(),
    staleTime: 60_000,
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ['campaigns', id],
    queryFn: () => campaignsApi.getCampaign(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const campaign = query.state.data;
      if (campaign?.status === 'generating') return 3000;
      return false;
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: campaignsApi.createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      campaignsApi.updateCampaign(id, payload),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: campaignsApi.deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useGenerateContent() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: campaignsApi.generateContent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useSelectImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, imageIndex }: { id: string; imageIndex: number }) =>
      campaignsApi.selectImage(id, imageIndex),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
    },
  });
}

export function useUpdatePerformance() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      campaignsApi.updatePerformance(id, payload),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useRefineCopy() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, instructions, textAgent }: { id: string; instructions: string; textAgent?: string }) =>
      campaignsApi.refineCopy(id, instructions, textAgent),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      queryClient.invalidateQueries({ queryKey: ['token-balance'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useRefineCaption() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, instructions, textAgent }: { id: string; instructions: string; textAgent?: string }) =>
      campaignsApi.refineCaption(id, instructions, textAgent),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      queryClient.invalidateQueries({ queryKey: ['token-balance'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useGenerateMoreImages() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, count, instructions, imageAgent }: { id: string; count: number; instructions?: string; imageAgent?: string }) =>
      campaignsApi.generateMoreImages(id, count, instructions, imageAgent),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      queryClient.invalidateQueries({ queryKey: ['token-balance'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useDeleteCampaignImage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, imageIndex }: { id: string; imageIndex: number }) =>
      campaignsApi.deleteImage(id, imageIndex),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useUploadCampaignImage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      campaignsApi.uploadImage(id, file),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useSelectVerticalImage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, imageIndex }: { id: string; imageIndex: number }) =>
      campaignsApi.selectVerticalImage(id, imageIndex),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useGenerateMoreVerticalImages() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      id,
      count,
      instructions,
      imageAgent,
    }: {
      id: string;
      count: number;
      instructions?: string;
      imageAgent?: string;
    }) =>
      campaignsApi.generateMoreVerticalImages(id, count, instructions, imageAgent),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      queryClient.invalidateQueries({ queryKey: ['token-balance'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useDeleteVerticalImage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, imageIndex }: { id: string; imageIndex: number }) =>
      campaignsApi.deleteVerticalImage(id, imageIndex),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useUploadVerticalImage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      campaignsApi.uploadVerticalImage(id, file),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useSelectVideo() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, videoIndex }: { id: string; videoIndex: number }) =>
      campaignsApi.selectVideo(id, videoIndex),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, videoIndex }: { id: string; videoIndex: number }) =>
      campaignsApi.deleteVideo(id, videoIndex),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useUploadVideo() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      campaignsApi.uploadVideo(id, file),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useSelectLandscapeImage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, imageIndex }: { id: string; imageIndex: number }) =>
      campaignsApi.selectLandscapeImage(id, imageIndex),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useGenerateMoreLandscapeImages() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      id,
      count,
      instructions,
      imageAgent,
    }: {
      id: string;
      count: number;
      instructions?: string;
      imageAgent?: string;
    }) =>
      campaignsApi.generateMoreLandscapeImages(id, count, instructions, imageAgent),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      queryClient.invalidateQueries({ queryKey: ['token-balance'] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useDeleteLandscapeImage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, imageIndex }: { id: string; imageIndex: number }) =>
      campaignsApi.deleteLandscapeImage(id, imageIndex),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useUploadLandscapeImage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      campaignsApi.uploadLandscapeImage(id, file),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', vars.id] });
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}
