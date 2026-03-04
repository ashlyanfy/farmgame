import { create } from 'zustand';
import { inventoryApi } from '../api';

export interface InventoryItem {
  id: string;
  product: string;
  weight_g: number;
  quality: number;
  collectedAtMs: number;
}

interface InventoryState {
  items: InventoryItem[];
  fetch: () => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],

  fetch: async () => {
    const items = await inventoryApi.get();
    set({ items: items.map(i => ({ ...i, collectedAtMs: new Date(i.collected_at).getTime() })) });
  },
}));
