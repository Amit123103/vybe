import { create } from 'zustand';
import { AppNotification } from '../types/notification.types';

interface NotificationState {
  unreadCount: number;
  notifications: AppNotification[];
  hasNewNotification: boolean;

  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: (amount?: number) => void;
  addNotification: (notification: AppNotification) => void;
  markAsRead: (ids: string[]) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  setHasNewNotification: (hasNew: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  notifications: [],
  hasNewNotification: false,

  setUnreadCount: (count: number) => set({ unreadCount: count }),

  incrementUnreadCount: () => set({ unreadCount: get().unreadCount + 1 }),

  decrementUnreadCount: (amount = 1) =>
    set({ unreadCount: Math.max(0, get().unreadCount - amount) }),

  addNotification: (notification: AppNotification) => {
    set({
      notifications: [notification, ...get().notifications],
      hasNewNotification: true,
      unreadCount: get().unreadCount + 1,
    });
  },

  markAsRead: (ids: string[]) => {
    set({
      notifications: get().notifications.map((n) =>
        ids.includes(n.id) ? { ...n, isRead: true } : n,
      ),
      unreadCount: Math.max(0, get().unreadCount - ids.length),
    });
  },

  markAllAsRead: () => {
    set({
      notifications: get().notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
      hasNewNotification: false,
    });
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0, hasNewNotification: false });
  },

  setHasNewNotification: (hasNew: boolean) => set({ hasNewNotification: hasNew }),
}));
