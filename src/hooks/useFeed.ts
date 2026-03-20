import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { feedService } from '../services/feedService';
import { FEED_CONFIG } from '../constants/config';

export const useFeed = () => {
  const queryClient = useQueryClient();

  const feedQuery = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam = 1 }) => feedService.getFeed(pageParam, FEED_CONFIG.pageSize),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const posts = feedQuery.data?.pages.flatMap((page) => page.data) ?? [];

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['feed'] });
  }, [queryClient]);

  const loadMore = useCallback(() => {
    if (feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
      feedQuery.fetchNextPage();
    }
  }, [feedQuery]);

  return {
    posts,
    isLoading: feedQuery.isLoading,
    isRefetching: feedQuery.isRefetching,
    isLoadingMore: feedQuery.isFetchingNextPage,
    hasMore: feedQuery.hasNextPage ?? false,
    error: feedQuery.error,
    refresh,
    loadMore,
  };
};

export const useTrending = () => {
  const trendingQuery = useInfiniteQuery({
    queryKey: ['trending'],
    queryFn: ({ pageParam = 1 }) => feedService.getTrending(pageParam, FEED_CONFIG.pageSize),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  return {
    posts: trendingQuery.data?.pages.flatMap((page) => page.data) ?? [],
    isLoading: trendingQuery.isLoading,
    hasMore: trendingQuery.hasNextPage ?? false,
    loadMore: () => {
      if (trendingQuery.hasNextPage && !trendingQuery.isFetchingNextPage) {
        trendingQuery.fetchNextPage();
      }
    },
  };
};

export const useStories = () => {
  const storiesQuery = useInfiniteQuery({
    queryKey: ['stories'],
    queryFn: () => feedService.getStories(),
    getNextPageParam: () => undefined,
    initialPageParam: 1,
  });

  return {
    stories: storiesQuery.data?.pages.flat() ?? [],
    isLoading: storiesQuery.isLoading,
    refetch: storiesQuery.refetch,
  };
};
