import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '../auth.store';

const fakeUser = {
  id: 'user-1',
  email: 'user@example.com',
  firstName: 'Ada',
  lastName: 'Lovelace',
  role: 'user',
  language: 'en',
  tokenBalance: 100,
} as any;

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset isAuthenticated explicitly — it's only computed from a getter on
    // initial state, so once setAuth/logout writes it directly, it sticks.
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('setAuth', () => {
    it('writes user + token to localStorage and updates the store', () => {
      useAuthStore.getState().setAuth(fakeUser, 'jwt-token');

      const state = useAuthStore.getState();
      expect(state.user).toEqual(fakeUser);
      expect(state.token).toBe('jwt-token');
      expect(state.isAuthenticated).toBe(true);
      expect(localStorage.getItem('auth-token')).toBe('jwt-token');
      expect(JSON.parse(localStorage.getItem('auth-user') || 'null')).toEqual(
        fakeUser,
      );
    });
  });

  describe('logout', () => {
    it('clears the store and localStorage', () => {
      useAuthStore.getState().setAuth(fakeUser, 'jwt-token');
      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(localStorage.getItem('auth-token')).toBeNull();
      expect(localStorage.getItem('auth-user')).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('merges partial fields into the existing user and persists', () => {
      useAuthStore.getState().setAuth(fakeUser, 'jwt-token');
      useAuthStore.getState().updateUser({ language: 'fr', tokenBalance: 250 });

      const state = useAuthStore.getState();
      expect(state.user).toMatchObject({
        ...fakeUser,
        language: 'fr',
        tokenBalance: 250,
      });

      const stored = JSON.parse(localStorage.getItem('auth-user') || '{}');
      expect(stored.language).toBe('fr');
      expect(stored.tokenBalance).toBe(250);
    });

    it('is a no-op when no user is currently set', () => {
      useAuthStore.getState().updateUser({ language: 'fr' } as any);
      expect(useAuthStore.getState().user).toBeNull();
      expect(localStorage.getItem('auth-user')).toBeNull();
    });
  });

  describe('isAuthenticated getter', () => {
    it('reflects token presence', () => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      useAuthStore.getState().setAuth(fakeUser, 'jwt-token');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });
});
