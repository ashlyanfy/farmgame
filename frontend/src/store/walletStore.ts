import { create } from 'zustand';
import { walletApi, goodnessApi } from '../api';

interface WalletState {
  coins: number;
  resources: { water_g: number; oxygen_g: number; syrup_g: number };
  nutrients: number;
  goodness: { value: number; goal: number; level: number; todayCount: number };

  fetch: () => Promise<void>;
  careAction: (tab: 'farm' | 'fish' | 'bee') => Promise<void>;
  useNutrient: (tab: 'farm' | 'fish' | 'bee') => Promise<void>;
  claimDailyLogin: () => Promise<void>;
}

const mapGoodness = (raw: { value: number; goal: number; level: number; today_count: number }) => ({
  value: raw.value,
  goal: raw.goal,
  level: raw.level,
  todayCount: raw.today_count,
});

export const useWalletStore = create<WalletState>((set) => ({
  coins: 1000,
  resources: { water_g: 5000, oxygen_g: 5000, syrup_g: 5000 },
  nutrients: 10,
  goodness: { value: 50, goal: 100, level: 1, todayCount: 5 },

  fetch: async () => {
    const [wallet, raw] = await Promise.all([walletApi.get(), goodnessApi.get()]);
    set({
      coins: wallet.coins,
      resources: { water_g: wallet.water_g, oxygen_g: wallet.oxygen_g, syrup_g: wallet.syrup_g },
      nutrients: wallet.nutrients,
      goodness: mapGoodness(raw),
    });
  },

  careAction: async (tab) => {
    const wallet = await walletApi.care(tab);
    const raw = await goodnessApi.get();
    set({
      coins: wallet.coins,
      resources: { water_g: wallet.water_g, oxygen_g: wallet.oxygen_g, syrup_g: wallet.syrup_g },
      nutrients: wallet.nutrients,
      goodness: mapGoodness(raw),
    });
  },

  useNutrient: async (tab) => {
    const wallet = await walletApi.nutrient(tab);
    const raw = await goodnessApi.get();
    set({
      coins: wallet.coins,
      resources: { water_g: wallet.water_g, oxygen_g: wallet.oxygen_g, syrup_g: wallet.syrup_g },
      nutrients: wallet.nutrients,
      goodness: mapGoodness(raw),
    });
  },

  claimDailyLogin: async () => {
    await walletApi.dailyLogin();
    const [wallet, raw] = await Promise.all([walletApi.get(), goodnessApi.get()]);
    set({
      coins: wallet.coins,
      resources: { water_g: wallet.water_g, oxygen_g: wallet.oxygen_g, syrup_g: wallet.syrup_g },
      nutrients: wallet.nutrients,
      goodness: mapGoodness(raw),
    });
  },
}));

