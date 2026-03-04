import { create } from 'zustand';
import { ordersApi } from '../api';

export interface Order {
  id: string;
  items: Array<{ product: string; weight_g: number }>;
  status: string;
  createdAtMs: number;
}

interface OrdersState {
  orders: Order[];
  fetch: () => Promise<void>;
  create: (items: Array<{ product: string; weight_g: number }>) => Promise<void>;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],

  fetch: async () => {
    const orders = await ordersApi.get();
    set({ orders: orders.map(o => ({ ...o, createdAtMs: new Date(o.created_at).getTime() })) });
  },

  create: async (items) => {
    await ordersApi.create(items);
    await get().fetch();
  },
}));
