import api from './api';
import { API } from '../constants/endpoints';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { AppNotification } from '../types/notification.types';

export const notificationService = {
  getNotifications: async (
    page: number = 1,
    limit: number = 20,
    type?: string,
  ): Promise<PaginatedResponse<AppNotification>> => {
    const response = await api.get<PaginatedResponse<AppNotification>>(API.NOTIFICATIONS, {
      params: { page, limit, type },
    });
    return response.data;
  },

  markAsRead: async (notificationIds: string[]): Promise<void> => {
    await api.post(API.MARK_READ, { ids: notificationIds });
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post(API.MARK_READ, { all: true });
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<{ count: number }>>(`${API.NOTIFICATIONS}/unread-count`);
    return response.data.data.count;
  },
};
