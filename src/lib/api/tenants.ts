import { apiClient } from '../api-client';
import {
  Tenant,
  TenantDetails,
  CreateTenantDto,
  CreateTenantResponse,
  PaginatedResponse,
  DashboardStats,
} from '../types';

export const tenantsApi = {
  create: (data: CreateTenantDto) =>
    apiClient.post<CreateTenantResponse>('/tenants', data),

  getAll: (page: number = 1, limit: number = 20, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    return apiClient.get<PaginatedResponse<Tenant>>(`/tenants?${params}`);
  },

  getById: (id: string) =>
    apiClient.get<TenantDetails>(`/tenants/${id}`),

  updateStatus: (id: string, status: string) =>
    apiClient.patch<Tenant>(`/tenants/${id}/status`, { status }),

  uploadDocument: (id: string, file: File, documentType: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    return apiClient.uploadFile(`/tenants/${id}/documents`, formData);
  },

  getDashboardStats: () =>
    apiClient.get<DashboardStats>('/tenants/dashboard-stats'),
};
