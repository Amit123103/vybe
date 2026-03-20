import api from './api';
import { API } from '../constants/endpoints';
import { LoginResponse, UsernameCheckResponse, ApiResponse } from '../types/api.types';
import { RegisterPayload, User } from '../types/user.types';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>(API.LOGIN, { email, password });
    return response.data.data;
  },

  register: async (data: RegisterPayload): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>(API.REGISTER, data);
    return response.data.data;
  },

  loginWithGoogle: async (idToken: string): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>(API.GOOGLE_AUTH, { idToken });
    return response.data.data;
  },

  loginWithApple: async (identityToken: string, fullName?: string): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>(API.APPLE_AUTH, {
      identityToken,
      fullName,
    });
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post(API.LOGOUT);
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>(API.REFRESH, { refreshToken });
    return response.data.data;
  },

  checkUsername: async (username: string): Promise<UsernameCheckResponse> => {
    const response = await api.get<ApiResponse<UsernameCheckResponse>>(API.CHECK_USERNAME, {
      params: { username },
    });
    return response.data.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post(API.FORGOT_PASSWORD, { email });
  },

  verifyOtp: async (email: string, otp: string): Promise<{ resetToken: string }> => {
    const response = await api.post<ApiResponse<{ resetToken: string }>>(API.VERIFY_OTP, {
      email,
      otp,
    });
    return response.data.data;
  },

  resetPassword: async (resetToken: string, newPassword: string): Promise<void> => {
    await api.post(API.RESET_PASSWORD, { resetToken, newPassword });
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(API.UPDATE_PROFILE);
    return response.data.data;
  },
};
