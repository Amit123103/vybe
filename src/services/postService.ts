import api from './api';
import { API } from '../constants/endpoints';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { Post, Comment, CreatePostPayload } from '../types/post.types';

export const postService = {
  getPost: async (id: string): Promise<Post> => {
    const response = await api.get<ApiResponse<Post>>(API.POST(id));
    return response.data.data;
  },

  createPost: async (data: CreatePostPayload): Promise<Post> => {
    const response = await api.post<ApiResponse<Post>>(API.POSTS, data);
    return response.data.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(API.POST(id));
  },

  likePost: async (id: string): Promise<{ liked: boolean; likesCount: number }> => {
    const response = await api.post<ApiResponse<{ liked: boolean; likesCount: number }>>(
      API.LIKE(id),
    );
    return response.data.data;
  },

  reactToPost: async (
    id: string,
    emoji: string,
  ): Promise<{ reacted: boolean; reactions: Post['reactions'] }> => {
    const response = await api.post<
      ApiResponse<{ reacted: boolean; reactions: Post['reactions'] }>
    >(API.REACT(id), { emoji });
    return response.data.data;
  },

  getComments: async (
    postId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get<PaginatedResponse<Comment>>(API.COMMENT(postId), {
      params: { page, limit },
    });
    return response.data;
  },

  addComment: async (postId: string, text: string): Promise<Comment> => {
    const response = await api.post<ApiResponse<Comment>>(API.COMMENT(postId), { text });
    return response.data.data;
  },

  repost: async (id: string): Promise<{ reposted: boolean; repostsCount: number }> => {
    const response = await api.post<ApiResponse<{ reposted: boolean; repostsCount: number }>>(
      API.REPOST(id),
    );
    return response.data.data;
  },

  bookmark: async (id: string): Promise<{ bookmarked: boolean }> => {
    const response = await api.post<ApiResponse<{ bookmarked: boolean }>>(API.BOOKMARK(id));
    return response.data.data;
  },

  uploadMedia: async (uri: string, type: 'image' | 'video'): Promise<{ url: string }> => {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'media';
    const match = /\.(\w+)$/.exec(filename);
    const mimeType = type === 'image' ? `image/${match?.[1] || 'jpeg'}` : `video/${match?.[1] || 'mp4'}`;

    formData.append('file', {
      uri,
      name: filename,
      type: mimeType,
    } as unknown as Blob);

    const response = await api.post<ApiResponse<{ url: string }>>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};
