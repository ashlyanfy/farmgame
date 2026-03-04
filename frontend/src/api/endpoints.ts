import { apiClient } from './client';

// Wallet
export const walletApi = {
  get: () => apiClient.get<{ coins: number; water_g: number; oxygen_g: number; syrup_g: number; nutrients: number }>('/wallet'),
  care: (tab: 'farm' | 'fish' | 'bee') => apiClient.post<{ coins: number; water_g: number; oxygen_g: number; syrup_g: number; nutrients: number }>('/wallet/care', { tab }),
  nutrient: (tab: 'farm' | 'fish' | 'bee') => apiClient.post<{ coins: number; water_g: number; oxygen_g: number; syrup_g: number; nutrients: number }>('/wallet/nutrient', { tab }),
  dailyLogin: () => apiClient.post<{ message: string; goodness_awarded: number }>('/wallet/daily-login'),
};

// Goodness
export const goodnessApi = {
  get: () => apiClient.get<{ value: number; goal: number; level: number; today_count: number }>('/goodness'),
};

// Farm
export const farmApi = {
  getState: () => apiClient.get<{ active_culture: 'carrot' | 'apple'; carrot_start_ms: number; carrot_care_index: number; carrot_nutrients_used: number; carrot_progress: { percent: number; days_left: number }; apple_start_ms: number; apple_care_index: number; apple_nutrients_used: number; apple_progress: { percent: number; days_left: number } }>('/farm/state'),
  switchCulture: (culture: 'carrot' | 'apple') => apiClient.post('/farm/switch-culture', { culture }),
  harvest: () => apiClient.post<{ product: string; weight_g: number; quality: number; goodness_awarded: number }>('/farm/harvest'),
};

// Fish
export const fishApi = {
  getState: () => apiClient.get<{ cycle_start_ms: number; care_index: number; nutrients_used: number; progress: { percent: number; days_left: number } }>('/fish/state'),
  harvest: () => apiClient.post<{ product: string; weight_g: number; quality: number; goodness_awarded: number }>('/fish/harvest'),
};

// Bee
export const beeApi = {
  getState: () => apiClient.get<{ cycle_start_ms: number; care_index: number; nutrients_used: number; progress: { percent: number; days_left: number } }>('/bee/state'),
  harvest: () => apiClient.post<{ product: string; weight_g: number; quality: number; goodness_awarded: number }>('/bee/harvest'),
};

// Profile
export const profileApi = {
  get: () => apiClient.get<{ username: string; language: 'RU' | 'KZ'; referral_code: string }>('/profile'),
  update: (data: Partial<{ username: string; language: 'RU' | 'KZ' }>) => apiClient.put('/profile', data),
  getDelivery: () => apiClient.get<{ fio: string; phone: string; city: string; address: string; comment: string }>('/profile/delivery'),
  updateDelivery: (data: Partial<{ fio: string; phone: string; city: string; address: string; comment: string }>) => apiClient.put('/profile/delivery', data),
};

// Inventory
export const inventoryApi = {
  get: () => apiClient.get<Array<{ id: string; product: string; weight_g: number; quality: number; collected_at: string }>>('/inventory'),
};

// Orders
export const ordersApi = {
  get: () => apiClient.get<Array<{ id: string; items: Array<{ product: string; weight_g: number }>; status: string; created_at: string }>>('/orders'),
  create: (items: Array<{ product: string; weight_g: number }>) => apiClient.post('/orders', { items }),
};

// Market
export const marketApi = {
  getProducts: () => apiClient.get<Array<{ product: string; price_per_kg: number; available_g: number; description: string }>>('/market/products'),
};
