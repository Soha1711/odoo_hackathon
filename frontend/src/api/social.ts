import apiClient from './client';
import { API_ENDPOINTS } from '../constants/api';

export const socialApi = {
  getActivities: async (): Promise<{ data: any[] }> => {
    const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.SOCIAL.ACTIVITIES);
    return res.data;
  },

  createActivity: async (data: {
    title: string;
    description?: string;
    pointsAward: number;
    xpAward: number;
    status: 'ACTIVE' | 'COMPLETED';
  }): Promise<{ data: any }> => {
    const res = await apiClient.post<{ data: any }>(API_ENDPOINTS.SOCIAL.ACTIVITIES, data);
    return res.data;
  },

  getParticipations: async (params?: { userId?: string; approvalStatus?: string }): Promise<{ data: any[] }> => {
    const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.SOCIAL.PARTICIPATIONS, { params });
    return res.data;
  },

  joinActivity: async (activityId: string, proofUrl?: string): Promise<{ data: any }> => {
    const res = await apiClient.post<{ data: any }>(API_ENDPOINTS.SOCIAL.JOIN(activityId), { proofUrl });
    return res.data;
  },

  reviewParticipation: async (participationId: string, approvalStatus: 'APPROVED' | 'REJECTED', pointsEarned?: number): Promise<{ data: any }> => {
    const res = await apiClient.patch<{ data: any }>(API_ENDPOINTS.SOCIAL.APPROVE(participationId), { approvalStatus, pointsEarned });
    return res.data;
  },
};
