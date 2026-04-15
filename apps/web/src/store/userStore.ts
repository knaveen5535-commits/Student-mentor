import { create } from 'zustand';
import { safeJsonParse } from '../lib/helpers';

export type UserProfile = {
  name?: string;
  email?: string;
  picture?: string;
  provider?: string;
};

type UserState = {
  hydrated: boolean;
  loggedIn: boolean;
  profile: UserProfile | null;
  theme: 'light' | 'dark';
  hydrate: () => void;
  login: (profile: UserProfile) => void;
  logout: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

const PROFILE_KEY = 'ai_workspace_user_profile';
const LOGGED_IN_KEY = 'ai_workspace_logged_in';
const THEME_KEY = 'theme';

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  const ls: any = (window as any).localStorage;
  if (!ls) return null;
  if (typeof ls.getItem !== 'function') return null;
  if (typeof ls.setItem !== 'function') return null;
  if (typeof ls.removeItem !== 'function') return null;
  return ls as Storage;
}

export const useUserStore = create<UserState>((set, get) => ({
  hydrated: false,
  loggedIn: false,
  profile: null,
  theme: 'light',

  hydrate: () => {
    const storage = getStorage();
    if (!storage) {
      set({ hydrated: true });
      return;
    }
    const loggedIn = storage.getItem(LOGGED_IN_KEY) === 'true';
    const profile = safeJsonParse<UserProfile | null>(storage.getItem(PROFILE_KEY), null);
    const theme = (storage.getItem(THEME_KEY) as 'light' | 'dark' | null) || 'light';

    set({ hydrated: true, loggedIn, profile, theme });
    document.documentElement.dataset.theme = theme;
  },

  login: (profile) => {
    const storage = getStorage();
    if (storage) {
      storage.setItem(PROFILE_KEY, JSON.stringify(profile));
      storage.setItem(LOGGED_IN_KEY, 'true');
    }
    set({ hydrated: true, loggedIn: true, profile });
  },

  logout: () => {
    const storage = getStorage();
    if (storage) {
      storage.removeItem(PROFILE_KEY);
      storage.setItem(LOGGED_IN_KEY, 'false');
    }
    set({ hydrated: true, loggedIn: false, profile: null });
  },

  setTheme: (theme) => {
    const storage = getStorage();
    if (storage) {
      storage.setItem(THEME_KEY, theme);
    }
    set({ theme });
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme;
    }
  }
}));
