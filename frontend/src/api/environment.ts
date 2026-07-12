import apiClient from './client';
import { API_ENDPOINTS } from '../constants/api';
import { EnvironmentalGoal } from '../types/goal';

export interface CarbonTransactionInput {
  sourceType: 'SCOPE_1_STATIONARY' | 'SCOPE_1_MOBILE' | 'SCOPE_2_ELECTRICITY' | 'SCOPE_3_TRAVEL' | 'SCOPE_3_WASTE';
  sourceId: string;
  quantity: number;
  unit: string;
  departmentId: string;
  transactionDate: string;
}

export const environmentApi = {
  getFactors: async (): Promise<{ data: any[] }> => {
    const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.ENVIRONMENTAL.FACTORS);
    return res.data;
  },

  getProfiles: async (): Promise<{ data: any[] }> => {
    const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.ENVIRONMENTAL.PROFILES);
    return res.data;
  },

  getTransactions: async (params?: { departmentId?: string; sourceType?: string }): Promise<{ data: any[] }> => {
    const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.ENVIRONMENTAL.TRANSACTIONS, { params });
    return res.data;
  },

  logTransaction: async (data: CarbonTransactionInput): Promise<{ data: any }> => {
    const res = await apiClient.post<{ data: any }>(API_ENDPOINTS.ENVIRONMENTAL.TRANSACTIONS, data);
    return res.data;
  },

  getGoals: async (departmentId?: string): Promise<{ data: EnvironmentalGoal[] }> => {
    const params = departmentId ? { departmentId } : {};
    const res = await apiClient.get<{ data: EnvironmentalGoal[] }>(API_ENDPOINTS.ENVIRONMENTAL.GOALS, { params });
    return res.data;
  },

  createGoal: async (data: {
    title: string;
    description?: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    deadline: string;
    departmentId: string;
  }): Promise<{ data: EnvironmentalGoal }> => {
    const res = await apiClient.post<{ data: EnvironmentalGoal }>(API_ENDPOINTS.ENVIRONMENTAL.GOALS, data);
    return res.data;
  },

  updateGoal: async (id: string, currentValue: number): Promise<{ data: EnvironmentalGoal }> => {
    const res = await apiClient.patch<{ data: EnvironmentalGoal }>(`${API_ENDPOINTS.ENVIRONMENTAL.GOALS}/${id}`, { currentValue });
    return res.data;
  },
};
