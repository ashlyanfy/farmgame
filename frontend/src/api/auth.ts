import { apiClient } from './client';

export const authApi = {
  register: (data: { username: string; password: string; language: 'RU' | 'KZ' }) =>
    apiClient.post<{ access_token: string; refresh_token: string }>('/auth/register', data),
  login: (data: { username: string; password: string }) =>
    apiClient.post<{ access_token: string; refresh_token: string }>('/auth/login', data),
};
