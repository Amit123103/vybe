import api from './api';
import { API } from '../constants/endpoints';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { UserProfile, UpdateProfilePayload, FollowUser } from '../types/user.types';

export const userService = {
  getProfile: async (username: string): Promise<UserProfile> => {
    const response = await api.get<ApiResponse<UserProfile>>(API.USER(username));
    return response.data.data;
  },

  updateProfile: async (data: UpdateProfilePayload): Promise<UserProfile> => {
    const response = await api.patch<ApiResponse<UserProfile>>(API.UPDATE_PROFILE, data);
    return response.data.data;
  },

  followUser: async (id: string): Promise<{ following: boolean; followersCount: number }> => {
    const response = await api.post<
      ApiResponse<{ following: boolean; followersCount: number }>
    >(API.FOLLOW(id));
    return response.data.data;
  },

  getFollowers: async (
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<FollowUser>> => {
    const response = await api.get<PaginatedResponse<FollowUser>>(API.FOLLOWERS(userId), {
      params: { page, limit },
    });
    return response.data;
  },

  getFollowing: async (
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<FollowUser>> => {
    const response = await api.get<PaginatedResponse<FollowUser>>(API.FOLLOWING(userId), {
      params: { page, limit },
    });
    return response.data;
  },

  searchUsers: async (
    query: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<FollowUser>> => {
    const response = await api.get<PaginatedResponse<FollowUser>>(API.SEARCH_USERS, {
      params: { q: query, page, limit },
    });
    return response.data;
  },

  blockUser: async (id: string): Promise<{ blocked: boolean }> => {
    const response = await api.post<ApiResponse<{ blocked: boolean }>>(API.BLOCK_USER(id));
    return response.data.data;
  },
};
