import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useDebounce } from './useDebounce';
import { mmkvStorage, STORAGE_KEYS } from '../services/storageService';
import { FEED_CONFIG } from '../constants/config';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, FEED_CONFIG.searchDebounceDelay);

  const searchResults = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => userService.searchUsers(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  const recentSearches = mmkvStorage.getJSON<string[]>(STORAGE_KEYS.RECENT_SEARCHES) ?? [];

  const addToRecent = useCallback((term: string) => {
    const current = mmkvStorage.getJSON<string[]>(STORAGE_KEYS.RECENT_SEARCHES) ?? [];
    const updated = [term, ...current.filter((s) => s !== term)].slice(0, 10);
    mmkvStorage.setJSON(STORAGE_KEYS.RECENT_SEARCHES, updated);
  }, []);

  const clearRecent = useCallback(() => {
    mmkvStorage.remove(STORAGE_KEYS.RECENT_SEARCHES);
  }, []);

  return {
    query,
    setQuery,
    results: searchResults.data?.data ?? [],
    isSearching: searchResults.isLoading,
    recentSearches,
    addToRecent,
    clearRecent,
  };
};
