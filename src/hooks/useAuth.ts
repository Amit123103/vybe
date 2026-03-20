import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const error = useAuthStore((s) => s.error);
  const login = useAuthStore((s) => s.login);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const loginWithApple = useAuthStore((s) => s.loginWithApple);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const updateUser = useAuthStore((s) => s.updateUser);
  const clearError = useAuthStore((s) => s.clearError);
  const initialize = useAuthStore((s) => s.initialize);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login,
    loginWithGoogle,
    loginWithApple,
    register,
    logout,
    updateUser,
    clearError,
    initialize,
  };
};
