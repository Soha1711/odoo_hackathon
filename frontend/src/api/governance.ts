import apiClient from './client';
import { API_ENDPOINTS } from '../constants/api';
import { EsgPolicy } from '../types/policy';

export const governanceApi = {
  getPolicies: async (): Promise<{ data: EsgPolicy[] }> => {
    const res = await apiClient.get<{ data: EsgPolicy[] }>(API_ENDPOINTS.GOVERNANCE.POLICIES);
    return res.data;
  },

  createPolicy: async (data: {
    title: string;
    description: string;
    url?: string;
    departmentId?: string;
    categoryId?: string;
  }): Promise<{ data: EsgPolicy }> => {
    const res = await apiClient.post<{ data: EsgPolicy }>(API_ENDPOINTS.GOVERNANCE.POLICIES, data);
    return res.data;
  },

  acknowledgePolicy: async (policyId: string): Promise<{ data: any }> => {
    const res = await apiClient.post<{ data: any }>(API_ENDPOINTS.GOVERNANCE.ACKNOWLEDGE(policyId));
    return res.data;
  },

  getAcks: async (): Promise<{ data: any[] }> => {
    const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.GOVERNANCE.ACKS);
    return res.data;
  },

  getAudits: async (departmentId?: string): Promise<{ data: any[] }> => {
    const params = departmentId ? { departmentId } : {};
    const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.GOVERNANCE.AUDITS, { params });
    return res.data;
  },

  createAudit: async (data: {
    departmentId: string;
    auditorName: string;
    score: number;
    outcome: string;
    findings?: string;
    auditDate: string;
  }): Promise<{ data: any }> => {
    const res = await apiClient.post<{ data: any }>(API_ENDPOINTS.GOVERNANCE.AUDITS, data);
    return res.data;
  },

  getIssues: async (params?: { departmentId?: string; status?: string }): Promise<{ data: any[] }> => {
    const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.GOVERNANCE.ISSUES, { params });
    return res.data;
  },

  createIssue: async (data: {
    title: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    departmentId: string;
    ownerId: string;
    dueDate: string;
  }): Promise<{ data: any }> => {
    const res = await apiClient.post<{ data: any }>(API_ENDPOINTS.GOVERNANCE.ISSUES, data);
    return res.data;
  },

  updateIssue: async (id: string, data: { status: 'OPEN' | 'RESOLVED' | 'UNDER_REVIEW'; resolutionNotes?: string }): Promise<{ data: any }> => {
    const res = await apiClient.patch<{ data: any }>(API_ENDPOINTS.GOVERNANCE.ISSUE_DETAIL(id), data);
    return res.data;
  },
};
