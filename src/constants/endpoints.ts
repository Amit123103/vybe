export const API = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  GOOGLE_AUTH: '/auth/google',
  APPLE_AUTH: '/auth/apple',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_OTP: '/auth/verify-otp',
  RESET_PASSWORD: '/auth/reset-password',
  CHECK_USERNAME: '/auth/check-username',

  // Feed
  FEED: '/feed',
  TRENDING: '/feed/trending',
  EXPLORE: '/explore',

  // Posts
  POSTS: '/posts',
  POST: (id: string) => `/posts/${id}` as const,
  LIKE: (id: string) => `/posts/${id}/like` as const,
  REACT: (id: string) => `/posts/${id}/react` as const,
  COMMENT: (id: string) => `/posts/${id}/comments` as const,
  REPOST: (id: string) => `/posts/${id}/repost` as const,
  BOOKMARK: (id: string) => `/posts/${id}/bookmark` as const,

  // Users
  USER: (username: string) => `/users/${username}` as const,
  FOLLOW: (id: string) => `/users/${id}/follow` as const,
  FOLLOWERS: (id: string) => `/users/${id}/followers` as const,
  FOLLOWING: (id: string) => `/users/${id}/following` as const,
  SEARCH_USERS: '/users/search',
  UPDATE_PROFILE: '/users/me',
  BLOCK_USER: (id: string) => `/users/${id}/block` as const,

  // Stories
  STORIES: '/stories',
  USER_STORIES: (id: string) => `/stories/${id}` as const,

  // Messages
  CONVERSATIONS: '/messages',
  MESSAGES: (conversationId: string) => `/messages/${conversationId}` as const,
  SEND_MESSAGE: (conversationId: string) => `/messages/${conversationId}/send` as const,

  // Notifications
  NOTIFICATIONS: '/notifications',
  MARK_READ: '/notifications/read',

  // Hashtags
  HASHTAG: (tag: string) => `/hashtags/${tag}` as const,
  TRENDING_HASHTAGS: '/hashtags/trending',

  // Search
  SEARCH: '/search',
} as const;
