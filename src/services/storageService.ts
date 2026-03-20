import * as SecureStore from 'expo-secure-store';
const { MMKV } = require('react-native-mmkv');

// MMKV for non-sensitive, fast-access storage
export const storage = new (MMKV as any)();

// Secure storage for sensitive data (tokens, etc.)
export const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Fallback to MMKV if SecureStore fails
      storage.set(key, value);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      storage.delete(key);
    }
  },
};

// MMKV helpers for common data types
export const mmkvStorage = {
  getString: (key: string): string | undefined => {
    return storage.getString(key);
  },

  setString: (key: string, value: string): void => {
    storage.set(key, value);
  },

  getBoolean: (key: string): boolean => {
    return storage.getBoolean(key) ?? false;
  },

  setBoolean: (key: string, value: boolean): void => {
    storage.set(key, value);
  },

  getJSON: <T>(key: string): T | null => {
    const raw = storage.getString(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setJSON: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },

  remove: (key: string): void => {
    storage.delete(key);
  },

  clearAll: (): void => {
    storage.clearAll();
  },
};

// Storage keys
export const STORAGE_KEYS = {
  THEME: 'theme_preference',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  RECENT_SEARCHES: 'recent_searches',
  DRAFT_POST: 'draft_post',
  NOTIFICATION_SETTINGS: 'notification_settings',
  FONT_SIZE_SCALE: 'font_size_scale',
} as const;
