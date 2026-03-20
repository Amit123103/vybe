export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string | null;
  coverPhoto: string | null;
  bio: string;
  website: string;
  pronouns: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreview {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  isVerified: boolean;
  isFollowing: boolean;
}

export interface UserProfile extends User {
  isFollowing: boolean;
  isFollowedBy: boolean;
  isBlocked: boolean;
  mutualFollowers: UserPreview[];
  interests: string[];
}

export interface RegisterPayload {
  displayName: string;
  username: string;
  email: string;
  password: string;
  interests: string[];
}

export interface UpdateProfilePayload {
  displayName?: string;
  username?: string;
  bio?: string;
  website?: string;
  pronouns?: string;
  avatar?: string;
  coverPhoto?: string;
  isPrivate?: boolean;
  interests?: string[];
}

export interface FollowUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  isVerified: boolean;
  isFollowing: boolean;
  bio: string;
}
