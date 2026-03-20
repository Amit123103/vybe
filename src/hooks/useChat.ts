import { useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { messageService } from '../services/messageService';
import { socketService } from '../services/socketService';
import { Message, SendMessagePayload } from '../types/message.types';
import { CHAT_CONFIG } from '../constants/config';

export const useChat = (conversationId: string) => {
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const messagesQuery = useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: ({ pageParam = 1 }) =>
      messageService.getMessages(conversationId, pageParam, CHAT_CONFIG.pageSize),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!conversationId,
  });

  const messages = messagesQuery.data?.pages.flatMap((page) => page.data) ?? [];

  // Join conversation room on mount
  useEffect(() => {
    if (conversationId) {
      socketService.emitJoinConversation(conversationId);

      // Listen for typing events
      socketService.onTyping((event) => {
        if (event.conversationId === conversationId) {
          setOtherUserTyping(event.isTyping);
        }
      });

      return () => {
        socketService.emitLeaveConversation(conversationId);
      };
    }
  }, [conversationId]);

  const sendMessage = useCallback(
    async (data: SendMessagePayload) => {
      return messageService.sendMessage(conversationId, data);
    },
    [conversationId],
  );

  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      socketService.emitTyping(conversationId, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.emitTyping(conversationId, false);
    }, CHAT_CONFIG.typingTimeout);
  }, [conversationId, isTyping]);

  const loadEarlierMessages = useCallback(() => {
    if (messagesQuery.hasNextPage && !messagesQuery.isFetchingNextPage) {
      messagesQuery.fetchNextPage();
    }
  }, [messagesQuery]);

  return {
    messages,
    isLoading: messagesQuery.isLoading,
    isLoadingEarlier: messagesQuery.isFetchingNextPage,
    hasEarlier: messagesQuery.hasNextPage ?? false,
    otherUserTyping,
    sendMessage,
    handleTyping,
    loadEarlierMessages,
  };
};

export const useConversations = () => {
  const conversationsQuery = useInfiniteQuery({
    queryKey: ['conversations'],
    queryFn: ({ pageParam = 1 }) => messageService.getConversations(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  return {
    conversations: conversationsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    isLoading: conversationsQuery.isLoading,
    refetch: conversationsQuery.refetch,
  };
};
