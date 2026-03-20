import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User, RegisterPayload } from '../types/user.types';
import { authService } from '../services/authService';
import { AUTH_CONFIG } from '../constants/config';
import { socketService } from '../services/socketService';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  loginWithApple: (identityToken: string, fullName?: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    try {
      const token = await SecureStore.getItemAsync(AUTH_CONFIG.tokenKey);
      if (token) {
        const user = await authService.getMe();
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          isInitialized: true,
        });
        socketService.connect(token);
      } else {
        set({ isInitialized: true });
      }
    } catch {
      await SecureStore.deleteItemAsync(AUTH_CONFIG.tokenKey);
      await SecureStore.deleteItemAsync(AUTH_CONFIG.refreshTokenKey);
      set({ isInitialized: true });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user, tokens } = await authService.login(email, password);
      await SecureStore.setItemAsync(AUTH_CONFIG.tokenKey, tokens.accessToken);
      await SecureStore.setItemAsync(AUTH_CONFIG.refreshTokenKey, tokens.refreshToken);
      socketService.connect(tokens.accessToken);
      set({
        user,
        accessToken: tokens.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  loginWithGoogle: async (idToken: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user, tokens } = await authService.loginWithGoogle(idToken);
      await SecureStore.setItemAsync(AUTH_CONFIG.tokenKey, tokens.accessToken);
      await SecureStore.setItemAsync(AUTH_CONFIG.refreshTokenKey, tokens.refreshToken);
      socketService.connect(tokens.accessToken);
      set({
        user,
        accessToken: tokens.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Google sign in failed.';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  loginWithApple: async (identityToken: string, fullName?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user, tokens } = await authService.loginWithApple(identityToken, fullName);
      await SecureStore.setItemAsync(AUTH_CONFIG.tokenKey, tokens.accessToken);
      await SecureStore.setItemAsync(AUTH_CONFIG.refreshTokenKey, tokens.refreshToken);
      socketService.connect(tokens.accessToken);
      set({
        user,
        accessToken: tokens.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Apple sign in failed.';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterPayload) => {
    set({ isLoading: true, error: null });
    try {
      const { user, tokens } = await authService.register(data);
      await SecureStore.setItemAsync(AUTH_CONFIG.tokenKey, tokens.accessToken);
      await SecureStore.setItemAsync(AUTH_CONFIG.refreshTokenKey, tokens.refreshToken);
      socketService.connect(tokens.accessToken);
      set({
        user,
        accessToken: tokens.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed.';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Continue with local logout even if API call fails
    } finally {
      socketService.disconnect();
      await SecureStore.deleteItemAsync(AUTH_CONFIG.tokenKey);
      await SecureStore.deleteItemAsync(AUTH_CONFIG.refreshTokenKey);
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync(AUTH_CONFIG.refreshTokenKey);
      if (!refreshToken) {
        get().logout();
        return;
      }
      const { tokens } = await authService.refreshToken(refreshToken);
      await SecureStore.setItemAsync(AUTH_CONFIG.tokenKey, tokens.accessToken);
      await SecureStore.setItemAsync(AUTH_CONFIG.refreshTokenKey, tokens.refreshToken);
      set({ accessToken: tokens.accessToken });
    } catch {
      get().logout();
    }
  },

  updateUser: (data: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...data } });
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
