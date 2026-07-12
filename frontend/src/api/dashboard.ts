import apiClient from './client';
import { API_ENDPOINTS } from '../constants/api';
import { DashboardSummary } from '../types/dashboard';

export const dashboardApi = {
  getSummary: async (departmentId?: string): Promise<{ data: DashboardSummary }> => {
    const params = departmentId ? { departmentId } : {};
    const res = await apiClient.get<{ data: DashboardSummary }>(API_ENDPOINTS.DASHBOARD.SUMMARY, { params });
    return res.data;
  },
};
