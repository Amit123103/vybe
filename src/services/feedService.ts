import api from './api';
import { API } from '../constants/endpoints';
import { PaginatedResponse } from '../types/api.types';
import { Post, StoryGroup } from '../types/post.types';

export const feedService = {
  getFeed: async (page: number = 1, limit: number = 20): Promise<PaginatedResponse<Post>> => {
    const response = await api.get<PaginatedResponse<Post>>(API.FEED, {
      params: { page, limit },
    });
    return response.data;
  },

  getTrending: async (page: number = 1, limit: number = 20): Promise<PaginatedResponse<Post>> => {
    const response = await api.get<PaginatedResponse<Post>>(API.TRENDING, {
      params: { page, limit },
    });
    return response.data;
  },

  getExplore: async (page: number = 1, limit: number = 20): Promise<PaginatedResponse<Post>> => {
    const response = await api.get<PaginatedResponse<Post>>(API.EXPLORE, {
      params: { page, limit },
    });
    return response.data;
  },

  getStories: async (): Promise<StoryGroup[]> => {
    const response = await api.get<{ success: boolean; data: StoryGroup[] }>(API.STORIES);
    return response.data.data;
  },
};
