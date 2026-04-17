import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  language: 'en' | 'es' | 'fr';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLanguage: (lang: 'en' | 'es' | 'fr') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  language: (localStorage.getItem('i18nextLng') as 'en' | 'es' | 'fr') || 'en',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  setLanguage: (lang: 'en' | 'es' | 'fr') => set({ language: lang }),
}));
