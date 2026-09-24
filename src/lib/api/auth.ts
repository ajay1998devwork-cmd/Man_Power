import { apiClient } from '../api-client';
import { SuperAdminUser } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<SuperAdminUser>('/auth/login', { email, password }),

  logout: () =>
    apiClient.post('/auth/logout'),

  getMe: () =>
    apiClient.get<SuperAdminUser>('/auth/me'),
};
