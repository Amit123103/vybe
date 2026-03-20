import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { postService } from '../services/postService';
import { Post, CreatePostPayload } from '../types/post.types';

export const usePost = (postId: string) => {
  const queryClient = useQueryClient();

  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postService.getPost(postId),
    enabled: !!postId,
  });

  return {
    post: postQuery.data,
    isLoading: postQuery.isLoading,
    error: postQuery.error,
    refetch: postQuery.refetch,
  };
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.likePost(postId),
    onMutate: async (postId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['feed'] });

      // Optimistic update
      const previousFeed = queryClient.getQueryData(['feed']);
      queryClient.setQueryData(['feed'], (old: unknown) => {
        if (!old) return old;
        const data = old as { pages: Array<{ data: Post[] }> };
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            data: page.data.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
                  }
                : post,
            ),
          })),
        };
      });

      return { previousFeed };
    },
    onError: (_err, _postId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed);
      }
    },
  });
};

export const useBookmarkPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.bookmark(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      const previousFeed = queryClient.getQueryData(['feed']);
      queryClient.setQueryData(['feed'], (old: unknown) => {
        if (!old) return old;
        const data = old as { pages: Array<{ data: Post[] }> };
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            data: page.data.map((post) =>
              post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post,
            ),
          })),
        };
      });
      return { previousFeed };
    },
    onError: (_err, _postId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed);
      }
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostPayload) => postService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};

export const usePostComments = (postId: string) => {
  const commentsQuery = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => postService.getComments(postId),
    enabled: !!postId,
  });

  const addCommentMutation = useMutation({
    mutationFn: (text: string) => postService.addComment(postId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const queryClient = useQueryClient();

  return {
    comments: commentsQuery.data?.data ?? [],
    isLoading: commentsQuery.isLoading,
    addComment: useCallback((text: string) => addCommentMutation.mutateAsync(text), [addCommentMutation]),
    isAddingComment: addCommentMutation.isPending,
  };
};
