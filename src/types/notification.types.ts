import { UserPreview } from './user.types';

export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'mention'
  | 'repost'
  | 'reaction'
  | 'message'
  | 'story_view'
  | 'trending'
  | 'tag';

export interface AppNotification {
  id: string;
  type: NotificationType;
  actor: UserPreview;
  message: string;
  postId?: string;
  postThumbnail?: string;
  commentText?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationGroup {
  label: string;
  data: AppNotification[];
}

export interface PushNotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data: {
    screen: string;
    params: Record<string, string>;
  };
}
