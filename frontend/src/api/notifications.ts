import apiClient from './client';
import { Notification } from '../types/notification';

export const notificationsApi = {
  getNotifications: async (): Promise<{ data: Notification[] }> => {
    const res = await apiClient.get<{ data: Notification[] }>('/notifications');
    return res.data;
  },

  markAsRead: async (id: string): Promise<{ data: Notification }> => {
    const res = await apiClient.patch<{ data: Notification }>(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  },
};
