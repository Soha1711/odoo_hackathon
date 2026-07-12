import apiClient from './client';
import { API_ENDPOINTS } from '../constants/api';
import { Department } from '../types/department';

export const settingsApi = {
  getConfig: async (): Promise<{ data: any }> => {
    const res = await apiClient.get<{ data: any }>(API_ENDPOINTS.SETTINGS.CONFIG);
    return res.data;
  },

  updateConfig: async (data: {
    enableAutoEmission?: boolean;
    requireEvidenceCsr?: boolean;
    autoAwardBadges?: boolean;
    pushAlertCompliance?: boolean;
    environmentalWeight?: number;
    socialWeight?: number;
    governanceWeight?: number;
  }): Promise<{ data: any }> => {
    const res = await apiClient.patch<{ data: any }>(API_ENDPOINTS.SETTINGS.CONFIG, data);
    return res.data;
  },

  getDepartments: async (): Promise<{ data: Department[] }> => {
    const res = await apiClient.get<{ data: Department[] }>(API_ENDPOINTS.SETTINGS.DEPARTMENTS);
    return res.data;
  },

  createDepartment: async (data: { name: string; code: string; head?: string; employeeCount?: number }): Promise<{ data: Department }> => {
    const res = await apiClient.post<{ data: Department }>(API_ENDPOINTS.SETTINGS.DEPARTMENTS, data);
    return res.data;
  },

  updateDepartment: async (id: string, data: { name?: string; code?: string; head?: string; employeeCount?: number }): Promise<{ data: Department }> => {
    const res = await apiClient.patch<{ data: Department }>(`${API_ENDPOINTS.SETTINGS.DEPARTMENTS}/${id}`, data);
    return res.data;
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.SETTINGS.DEPARTMENTS}/${id}`);
  },

  getCategories: async (): Promise<{ data: any[] }> => {
    const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.SETTINGS.CATEGORIES);
    return res.data;
  },
};
