import apiClient from './client';
import { API_ENDPOINTS } from '../constants/api';
import { ReportData, ReportFilter } from '../types/report';

export const reportsApi = {
  compileReport: async (filters: ReportFilter): Promise<{ data: ReportData }> => {
    const res = await apiClient.get<{ data: ReportData }>(API_ENDPOINTS.REPORTS.COMPILE, { params: filters });
    return res.data;
  },
};
