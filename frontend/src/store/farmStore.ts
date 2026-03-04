import { create } from 'zustand';
import { farmApi } from '../api';
import { CYCLE_DAYS } from '../utils/constants';

interface CultureData {
  cycleStartMs: number;
  careIndex: number;
  nutrientsUsed: number;
  cycleDurationDays: number;
  progress: { percent: number; days_left: number };
}

interface FarmState {
  activeCulture: 'carrot' | 'apple';
  cultures: { carrot: CultureData; apple: CultureData };
  
  fetch: () => Promise<void>;
  switchCulture: () => Promise<void>;
  harvest: () => Promise<{ product: string; weight_g: number; quality: number }>;
}

export const useFarmStore = create<FarmState>((set, get) => ({
  activeCulture: 'carrot',
  cultures: {
    carrot: { cycleStartMs: Date.now(), careIndex: 2, nutrientsUsed: 0, cycleDurationDays: CYCLE_DAYS.carrot, progress: { percent: 45, days_left: 3 } },
    apple: { cycleStartMs: Date.now(), careIndex: 1, nutrientsUsed: 0, cycleDurationDays: CYCLE_DAYS.apple, progress: { percent: 20, days_left: 8 } },
  },

  fetch: async () => {
    const data = await farmApi.getState();
    set({
      activeCulture: data.active_culture,
      cultures: {
        carrot: { cycleStartMs: data.carrot_start_ms, careIndex: data.carrot_care_index, nutrientsUsed: data.carrot_nutrients_used, cycleDurationDays: CYCLE_DAYS.carrot, progress: data.carrot_progress },
        apple: { cycleStartMs: data.apple_start_ms, careIndex: data.apple_care_index, nutrientsUsed: data.apple_nutrients_used, cycleDurationDays: CYCLE_DAYS.apple, progress: data.apple_progress },
      },
    });
  },

  switchCulture: async () => {
    const current = get().activeCulture;
    const newCulture = current === 'carrot' ? 'apple' : 'carrot';
    set({ activeCulture: newCulture });
    try {
      await farmApi.switchCulture(newCulture);
      await get().fetch();
    } catch {
      set({ activeCulture: current });
    }
  },

  harvest: async () => {
    const result = await farmApi.harvest();
    await get().fetch();
    return result;
  },
}));

