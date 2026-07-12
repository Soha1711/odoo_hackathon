import apiClient from './client';
import { API_ENDPOINTS } from '../constants/api';
import { AuthResponse, User } from '../types/auth';

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return res.data;
  },

  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    departmentId?: string;
  }): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    return res.data;
  },

  getMe: async (): Promise<{ data: User }> => {
    const res = await apiClient.get<{ data: User }>(API_ENDPOINTS.AUTH.ME);
    return res.data;
  },
};
