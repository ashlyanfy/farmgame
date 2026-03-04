import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, apiClient } from '../api';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, language: 'RU' | 'KZ') => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(persist((set) => ({
  isAuthenticated: false,
  username: null,

  login: async (username, password) => {
    const res = await authApi.login({ username, password });
    apiClient.setToken(res.access_token);
    localStorage.setItem('refresh_token', res.refresh_token);
    set({ isAuthenticated: true, username });
  },

  register: async (username, password, language) => {
    const res = await authApi.register({ username, password, language });
    apiClient.setToken(res.access_token);
    localStorage.setItem('refresh_token', res.refresh_token);
    set({ isAuthenticated: true, username });
  },

  logout: () => {
    apiClient.clearToken();
    set({ isAuthenticated: false, username: null });
    window.location.reload();
  },
}), { name: 'mf_auth' }));
