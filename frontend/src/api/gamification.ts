import apiClient from './client';
import { API_ENDPOINTS } from '../constants/api';

export const gamificationApi = {
  getChallenges: async (status?: string): Promise<{ data: any[] }> => {
    const params = status ? { status } : {};
    const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.GAMIFICATION.CHALLENGES, { params });
    return res.data;
  },

  createChallenge: async (data: {
    title: string;
    description: string;
    pointsAward: number;
    xpAward: number;
    targetValue: number;
    status: 'ACTIVE' | 'COMPLETED';
    startDate: string;
    endDate: string;
    categoryId?: string;
  }): Promise<{ data: any }> => {
    const res = await apiClient.post<{ data: any }>(API_ENDPOINTS.GAMIFICATION.CHALLENGES, data);
    return res.data;
  },

  joinChallenge: async (challengeId: string): Promise<{ data: any }> => {
    const res = await apiClient.post<{ data: any }>(API_ENDPOINTS.GAMIFICATION.JOIN_CHALLENGE(challengeId));
    return res.data;
  },

  getParticipations: async (params?: { userId?: string; challengeId?: string; approvalStatus?: string }): Promise<{ data: any[] }> => {
    const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.GAMIFICATION.PARTICIPATIONS, { params });
    return res.data;
  },

  updateProgress: async (challengeId: string, progress: number, proofUrl?: string): Promise<{ data: any }> => {
    const res = await apiClient.patch<{ data: any }>(API_ENDPOINTS.GAMIFICATION.UPDATE_PROGRESS(challengeId), { progress, proofUrl });
    return res.data;
  },

  approveParticipation: async (participationId: string, approvalStatus: 'APPROVED' | 'REJECTED'): Promise<{ data: any }> => {
    const res = await apiClient.patch<{ data: any }>(API_ENDPOINTS.GAMIFICATION.APPROVE_PARTICIPATION(participationId), { approvalStatus });
    return res.data;
  },

  getBadges: async (): Promise<{ data: any[] }> => {
    const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.GAMIFICATION.BADGES);
    return res.data;
  },

  getMyBadges: async (): Promise<{ data: any[] }> => {
    const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.GAMIFICATION.MY_BADGES);
    return res.data;
  },

  getRewards: async (): Promise<{ data: any[] }> => {
    const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.GAMIFICATION.REWARDS);
    return res.data;
  },

  createReward: async (data: {
    name: string;
    description?: string;
    pointsRequired: number;
    stock: number;
    status: 'ACTIVE' | 'INACTIVE';
  }): Promise<{ data: any }> => {
    const res = await apiClient.post<{ data: any }>(API_ENDPOINTS.GAMIFICATION.REWARDS, data);
    return res.data;
  },

  redeemReward: async (rewardId: string): Promise<{ data: any }> => {
    const res = await apiClient.post<{ data: any }>(API_ENDPOINTS.GAMIFICATION.REDEEM(rewardId));
    return res.data;
  },

  getLeaderboard: async (): Promise<{ data: any }> => {
    const res = await apiClient.get<{ data: any }>(API_ENDPOINTS.GAMIFICATION.LEADERBOARD);
    return res.data;
  },
};
