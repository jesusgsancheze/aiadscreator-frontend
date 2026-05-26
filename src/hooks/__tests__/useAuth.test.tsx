import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// vi.mock factories are hoisted to the top of the file before any local
// variables — share spies via vi.hoisted so the factories can reach them.
const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  changeLanguage: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  loginApi: vi.fn(),
  updateLanguageApi: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'en', changeLanguage: mocks.changeLanguage },
  }),
}));

vi.mock('react-hot-toast', () => ({
  default: { success: mocks.toastSuccess, error: mocks.toastError },
}));

vi.mock('../../api/auth.api', () => ({
  authApi: {
    login: (...args: unknown[]) => mocks.loginApi(...args),
    updateLanguage: (...args: unknown[]) => mocks.updateLanguageApi(...args),
  },
}));

const { navigate, changeLanguage, toastSuccess, toastError, loginApi, updateLanguageApi } =
  mocks;

import { useLogin } from '../useAuth';
import { useAuthStore } from '../../store/auth.store';
import { useUIStore } from '../../store/ui.store';

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const buildLoginResponse = (overrides: Record<string, unknown> = {}) => ({
  accessToken: 'jwt-token',
  user: {
    id: 'u1',
    email: 'user@example.com',
    firstName: 'Ada',
    lastName: 'Lovelace',
    role: 'user',
    language: 'en',
    tokenBalance: 0,
    ...overrides,
  },
});

describe('useLogin (language sync flow)', () => {
  beforeEach(() => {
    navigate.mockReset();
    changeLanguage.mockReset();
    toastSuccess.mockReset();
    toastError.mockReset();
    loginApi.mockReset();
    updateLanguageApi.mockReset();

    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    useUIStore.setState({
      language: 'en',
      pendingLanguageSync: false,
      sidebarOpen: true,
    });
  });

  it('pushes a pre-login language pick to the backend when it differs', async () => {
    // User picked French on the auth page before logging in.
    useUIStore.setState({ language: 'fr', pendingLanguageSync: true });

    loginApi.mockResolvedValue(buildLoginResponse({ language: 'en' }));
    updateLanguageApi.mockResolvedValue({ language: 'fr' });

    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      result.current.mutate({ email: 'a@b.com', password: 'secret123' });
    });

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/dashboard'));

    expect(updateLanguageApi).toHaveBeenCalledWith('fr');
    // The pending flag is cleared after we sync.
    expect(useUIStore.getState().pendingLanguageSync).toBe(false);
    // The auth store gets the user with the synced language.
    expect(useAuthStore.getState().user?.language).toBe('fr');
    // We don't switch i18n in this branch — the picked language is already
    // active in the UI.
    expect(changeLanguage).not.toHaveBeenCalled();
  });

  it('skips the API call when the picked language already matches the backend', async () => {
    useUIStore.setState({ language: 'fr', pendingLanguageSync: true });
    loginApi.mockResolvedValue(buildLoginResponse({ language: 'fr' }));

    const { result } = renderHook(() => useLogin(), { wrapper });
    await act(async () => {
      result.current.mutate({ email: 'a@b.com', password: 's' });
    });
    await waitFor(() => expect(navigate).toHaveBeenCalled());

    expect(updateLanguageApi).not.toHaveBeenCalled();
    expect(useUIStore.getState().pendingLanguageSync).toBe(false);
  });

  it('adopts the backend language locally when the user did NOT pick one pre-login', async () => {
    // No pending sync — user just logged in. Backend says they prefer Spanish.
    loginApi.mockResolvedValue(buildLoginResponse({ language: 'es' }));

    const { result } = renderHook(() => useLogin(), { wrapper });
    await act(async () => {
      result.current.mutate({ email: 'a@b.com', password: 's' });
    });
    await waitFor(() => expect(navigate).toHaveBeenCalled());

    expect(updateLanguageApi).not.toHaveBeenCalled();
    expect(useUIStore.getState().language).toBe('es');
    expect(changeLanguage).toHaveBeenCalledWith('es');
  });

  it('still completes login even if the language sync API throws', async () => {
    useUIStore.setState({ language: 'fr', pendingLanguageSync: true });
    loginApi.mockResolvedValue(buildLoginResponse({ language: 'en' }));
    updateLanguageApi.mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useLogin(), { wrapper });
    await act(async () => {
      result.current.mutate({ email: 'a@b.com', password: 's' });
    });
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/dashboard'));

    // User is still authenticated; the failure was swallowed silently.
    expect(useAuthStore.getState().token).toBe('jwt-token');
    expect(useUIStore.getState().pendingLanguageSync).toBe(false);
  });

  it('shows an error toast when login itself fails', async () => {
    loginApi.mockRejectedValue({
      response: { data: { message: 'Invalid email or password.' } },
    });

    const { result } = renderHook(() => useLogin(), { wrapper });
    await act(async () => {
      result.current.mutate({ email: 'a@b.com', password: 'bad' });
    });

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith('Invalid email or password.'),
    );
    expect(navigate).not.toHaveBeenCalled();
  });
});
