import { beforeEach, describe, expect, it } from 'vitest';
import { useUIStore } from '../ui.store';

const resetStore = () =>
  useUIStore.setState({
    sidebarOpen: true,
    language: 'en',
    pendingLanguageSync: false,
  });

describe('useUIStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('toggles the sidebar', () => {
    expect(useUIStore.getState().sidebarOpen).toBe(true);
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(false);
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(true);
  });

  describe('setLanguage', () => {
    it('updates the language without flagging a pending sync by default', () => {
      useUIStore.getState().setLanguage('es');

      const state = useUIStore.getState();
      expect(state.language).toBe('es');
      expect(state.pendingLanguageSync).toBe(false);
    });

    it('flags a pending sync when called explicitly (pre-login picks)', () => {
      useUIStore.getState().setLanguage('fr', { explicit: true });

      const state = useUIStore.getState();
      expect(state.language).toBe('fr');
      expect(state.pendingLanguageSync).toBe(true);
    });

    it('keeps the pending-sync flag set when subsequent non-explicit calls happen', () => {
      useUIStore.getState().setLanguage('fr', { explicit: true });
      useUIStore.getState().setLanguage('es');

      // Non-explicit calls must not clear an already-pending sync — that's the
      // whole point of the flag (the user picked a language pre-login and we
      // need to remember to push it).
      expect(useUIStore.getState().pendingLanguageSync).toBe(true);
      expect(useUIStore.getState().language).toBe('es');
    });

    it('clearPendingLanguageSync resets the flag', () => {
      useUIStore.getState().setLanguage('fr', { explicit: true });
      useUIStore.getState().clearPendingLanguageSync();

      expect(useUIStore.getState().pendingLanguageSync).toBe(false);
    });
  });
});
