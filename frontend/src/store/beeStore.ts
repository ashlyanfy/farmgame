import { create } from 'zustand';
import { beeApi } from '../api';
import { CYCLE_DAYS } from '../utils/constants';

interface BeeState {
  cycleStartMs: number;
  careIndex: number;
  nutrientsUsed: number;
  cycleDurationDays: number;
  progress: { percent: number; days_left: number };
  
  fetch: () => Promise<void>;
  harvest: () => Promise<{ product: string; weight_g: number; quality: number }>;
}

export const useBeeStore = create<BeeState>((set, get) => ({
  cycleStartMs: 0,
  careIndex: 0,
  nutrientsUsed: 0,
  cycleDurationDays: CYCLE_DAYS.bee,
  progress: { percent: 0, days_left: 0 },

  fetch: async () => {
    const data = await beeApi.getState();
    set({ cycleStartMs: data.cycle_start_ms, careIndex: data.care_index, nutrientsUsed: data.nutrients_used, progress: data.progress });
  },

  harvest: async () => {
    const result = await beeApi.harvest();
    await get().fetch();
    return result;
  },
}));
