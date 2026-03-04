import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { profileApi } from '../api';

interface ProfileState {
  name: string;
  language: 'RU' | 'KZ';
  referralCode: string;
  onboarded: boolean;
  delivery: { fio: string; phone: string; city: string; address: string; comment: string };

  fetch: () => Promise<void>;
  updateProfile: (data: Partial<{ name: string; language: 'RU' | 'KZ' }>) => Promise<void>;
  updateDelivery: (data: Partial<{ fio: string; phone: string; city: string; address: string; comment: string }>) => Promise<void>;
  setOnboarded: (v: boolean) => void;
}

export const useProfileStore = create<ProfileState>()(persist((set) => ({
  name: '',
  language: 'RU',
  referralCode: '',
  onboarded: false,
  delivery: { fio: '', phone: '', city: '', address: '', comment: '' },

  fetch: async () => {
    const [profile, delivery] = await Promise.all([profileApi.get(), profileApi.getDelivery()]);
    set({ name: profile.username, language: profile.language, referralCode: profile.referral_code, delivery });
  },

  updateProfile: async (data) => {
    // Сохраняем на бэкенд
    await profileApi.update({ username: data.name, language: data.language });
    // Обновляем локальное состояние
    set((s) => ({ ...s, ...data }));
  },

  updateDelivery: async (data) => {
    const updated = await profileApi.updateDelivery(data) as { fio: string; phone: string; city: string; address: string; comment: string };
    set({ delivery: updated });
  },

  setOnboarded: (v) => set({ onboarded: v }),
}), { name: 'mf_profile' }));
