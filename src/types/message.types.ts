import { UserPreview } from './user.types';

export interface Message {
  id: string;
  conversationId: string;
  sender: UserPreview;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  sharedPostId?: string;
  replyTo?: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: UserPreview[];
  lastMessage: Message | null;
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  updatedAt: string;
}

export interface SendMessagePayload {
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  sharedPostId?: string;
  replyTo?: string;
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}
