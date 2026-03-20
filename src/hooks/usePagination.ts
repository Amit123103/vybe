import { useState, useCallback } from 'react';

interface PaginationState {
  page: number;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export const usePagination = (initialPage: number = 1) => {
  const [state, setState] = useState<PaginationState>({
    page: initialPage,
    hasMore: true,
    isLoadingMore: false,
  });

  const nextPage = useCallback(() => {
    if (state.hasMore && !state.isLoadingMore) {
      setState((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [state.hasMore, state.isLoadingMore]);

  const reset = useCallback(() => {
    setState({ page: initialPage, hasMore: true, isLoadingMore: false });
  }, [initialPage]);

  const setHasMore = useCallback((hasMore: boolean) => {
    setState((prev) => ({ ...prev, hasMore }));
  }, []);

  const setIsLoadingMore = useCallback((isLoadingMore: boolean) => {
    setState((prev) => ({ ...prev, isLoadingMore }));
  }, []);

  return {
    ...state,
    nextPage,
    reset,
    setHasMore,
    setIsLoadingMore,
  };
};
