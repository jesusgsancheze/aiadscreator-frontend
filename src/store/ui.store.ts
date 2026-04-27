import { create } from 'zustand';

type Lang = 'en' | 'es' | 'fr';

interface UIState {
  sidebarOpen: boolean;
  language: Lang;
  pendingLanguageSync: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLanguage: (lang: Lang, opts?: { explicit?: boolean }) => void;
  clearPendingLanguageSync: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  language: (localStorage.getItem('i18nextLng') as Lang) || 'en',
  pendingLanguageSync: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  setLanguage: (lang, opts) =>
    set((state) => ({
      language: lang,
      pendingLanguageSync: opts?.explicit ? true : state.pendingLanguageSync,
    })),
  clearPendingLanguageSync: () => set({ pendingLanguageSync: false }),
}));
