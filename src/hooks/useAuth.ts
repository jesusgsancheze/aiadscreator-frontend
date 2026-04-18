import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      setAuth(res.user, res.accessToken);
      toast.success(t('common.success'));
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useRegister() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success(t('auth.verifyEmailSubtitle'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: authApi.verifyEmail,
  });
}

export function useResendVerification() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: () => {
      toast.success(t('common.success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.error'));
    },
  });
}

export function useProfile() {
  const { token, setAuth, logout } = useAuthStore();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await authApi.getProfile();
      if (token) {
        setAuth(res, token);
      }
      return res;
    },
    enabled: !!token,
    retry: false,
  });
}

export function useUpdateLanguage() {
  const { updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateLanguage,
    onSuccess: (res) => {
      updateUser({ language: res.language });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    navigate('/login');
  };
}
