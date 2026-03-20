import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../constants/config';
import { Message, TypingEvent } from '../types/message.types';
import { AppNotification } from '../types/notification.types';

type SocketEventCallback<T> = (data: T) => void;

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string): void {
    if (this.socket?.connected) return;

    this.socket = io(API_CONFIG.socketURL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (_reason: string) => {
      // Handle disconnect
    });

    this.socket.on('connect_error', (_error: Error) => {
      this.reconnectAttempts++;
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  // Message events
  onNewMessage(callback: SocketEventCallback<Message>): void {
    this.socket?.on('new_message', callback);
  }

  onTyping(callback: SocketEventCallback<TypingEvent>): void {
    this.socket?.on('typing', callback);
  }

  // Notification events
  onNotification(callback: SocketEventCallback<AppNotification>): void {
    this.socket?.on('notification', callback);
  }

  // Post events
  onPostLiked(callback: SocketEventCallback<{ postId: string; likesCount: number }>): void {
    this.socket?.on('post_liked', callback);
  }

  // User events
  onUserOnline(callback: SocketEventCallback<{ userId: string; isOnline: boolean }>): void {
    this.socket?.on('user_online', callback);
  }

  onStoryViewed(callback: SocketEventCallback<{ storyId: string; viewsCount: number }>): void {
    this.socket?.on('story_viewed', callback);
  }

  // Emit events
  emitTyping(conversationId: string, isTyping: boolean): void {
    this.socket?.emit('typing', { conversationId, isTyping });
  }

  emitJoinConversation(conversationId: string): void {
    this.socket?.emit('join_conversation', { conversationId });
  }

  emitLeaveConversation(conversationId: string): void {
    this.socket?.emit('leave_conversation', { conversationId });
  }

  emitMarkSeen(conversationId: string, messageId: string): void {
    this.socket?.emit('mark_seen', { conversationId, messageId });
  }

  // Cleanup
  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
