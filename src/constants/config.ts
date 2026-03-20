export const APP_CONFIG = {
  name: 'Vybe',
  tagline: 'Where your vibe finds its tribe',
  bundleId: 'com.vybe.app',
  version: '1.0.0',
  buildNumber: '1',
  scheme: 'vybe',
} as const;

export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.vybe.app/v1',
  socketURL: process.env.EXPO_PUBLIC_SOCKET_URL || 'wss://socket.vybe.app',
  timeout: 15000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

export const MEDIA_CONFIG = {
  maxImageSize: 10 * 1024 * 1024, // 10MB
  maxVideoSize: 100 * 1024 * 1024, // 100MB
  maxVideoDuration: 60, // seconds
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedVideoTypes: ['video/mp4', 'video/quicktime'],
  imageQuality: 0.8,
  thumbnailSize: { width: 300, height: 300 },
} as const;

export const FEED_CONFIG = {
  pageSize: 20,
  visibilityThreshold: 0.7,
  maxCaptionPreview: 150,
  debounceDelay: 400,
  searchDebounceDelay: 500,
} as const;

export const AUTH_CONFIG = {
  tokenKey: 'accessToken',
  refreshTokenKey: 'refreshToken',
  userKey: 'currentUser',
  otpLength: 4,
  otpResendDelay: 60, // seconds
  minPasswordLength: 8,
  maxBioLength: 150,
  maxUsernameLength: 30,
  minInterests: 3,
} as const;

export const CHAT_CONFIG = {
  maxMessageLength: 1000,
  typingTimeout: 3000,
  pageSize: 30,
} as const;

export const INTERESTS = [
  'Music', 'Art', 'Gaming', 'Fashion', 'Food',
  'Travel', 'Fitness', 'Tech', 'Photography', 'Movies',
  'Dance', 'Comedy', 'Nature', 'Sports', 'Books',
  'Beauty', 'Cooking', 'Education', 'Science', 'Pets',
] as const;

export const VYBE_REACTIONS = [
  { emoji: '🔥', label: 'Fire' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '😍', label: 'Heart Eyes' },
  { emoji: '🤯', label: 'Mind Blown' },
  { emoji: '💯', label: 'Hundred' },
  { emoji: '✨', label: 'Sparkle' },
  { emoji: '🥳', label: 'Party' },
] as const;
