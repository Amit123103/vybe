import api from './api';
import { API } from '../constants/endpoints';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { Conversation, Message, SendMessagePayload } from '../types/message.types';

export const messageService = {
  getConversations: async (
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Conversation>> => {
    const response = await api.get<PaginatedResponse<Conversation>>(API.CONVERSATIONS, {
      params: { page, limit },
    });
    return response.data;
  },

  getMessages: async (
    conversationId: string,
    page: number = 1,
    limit: number = 30,
  ): Promise<PaginatedResponse<Message>> => {
    const response = await api.get<PaginatedResponse<Message>>(API.MESSAGES(conversationId), {
      params: { page, limit },
    });
    return response.data;
  },

  sendMessage: async (
    conversationId: string,
    data: SendMessagePayload,
  ): Promise<Message> => {
    const response = await api.post<ApiResponse<Message>>(
      API.SEND_MESSAGE(conversationId),
      data,
    );
    return response.data.data;
  },

  createConversation: async (participantId: string): Promise<Conversation> => {
    const response = await api.post<ApiResponse<Conversation>>(API.CONVERSATIONS, {
      participantId,
    });
    return response.data.data;
  },

  deleteConversation: async (conversationId: string): Promise<void> => {
    await api.delete(API.MESSAGES(conversationId));
  },

  muteConversation: async (
    conversationId: string,
    muted: boolean,
  ): Promise<{ muted: boolean }> => {
    const response = await api.patch<ApiResponse<{ muted: boolean }>>(
      `${API.MESSAGES(conversationId)}/mute`,
      { muted },
    );
    return response.data.data;
  },
};
