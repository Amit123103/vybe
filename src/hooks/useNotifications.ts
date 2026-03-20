import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { useNotificationStore } from '../store/notificationStore';
import { socketService } from '../services/socketService';

export const useNotifications = (type?: string) => {
  const queryClient = useQueryClient();
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  // Fetch notifications
  const notificationsQuery = useQuery({
    queryKey: ['notifications', type],
    queryFn: () => notificationService.getNotifications(1, 20, type),
  });

  // Fetch unread count
  const unreadQuery = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
  });

  // Update store when unread count changes
  useEffect(() => {
    if (unreadQuery.data !== undefined) {
      setUnreadCount(unreadQuery.data);
    }
  }, [unreadQuery.data, setUnreadCount]);

  // Listen for real-time notifications
  useEffect(() => {
    socketService.onNotification((notification) => {
      addNotification(notification);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });
  }, [addNotification, queryClient]);

  const markAsRead = async (ids: string[]) => {
    await notificationService.markAsRead(ids);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    useNotificationStore.getState().markAllAsRead();
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  return {
    notifications: notificationsQuery.data?.data ?? [],
    isLoading: notificationsQuery.isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: notificationsQuery.refetch,
  };
};
