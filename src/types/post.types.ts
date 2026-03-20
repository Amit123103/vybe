import { UserPreview } from './user.types';

export interface Post {
  id: string;
  author: UserPreview;
  mediaType: 'image' | 'video' | 'text' | 'carousel';
  mediaUrls: string[];
  thumbnailUrl?: string;
  caption: string;
  hashtags: string[];
  location?: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  reactions: Reaction[];
  isLiked: boolean;
  isBookmarked: boolean;
  isReposted: boolean;
  audience: 'public' | 'friends' | 'private';
  createdAt: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  hasReacted: boolean;
}

export interface Comment {
  id: string;
  author: UserPreview;
  text: string;
  likesCount: number;
  isLiked: boolean;
  replies: Comment[];
  createdAt: string;
}

export interface CreatePostPayload {
  mediaType: Post['mediaType'];
  mediaUrls: string[];
  caption: string;
  hashtags: string[];
  location?: string;
  audience: Post['audience'];
}

export interface Story {
  id: string;
  author: UserPreview;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  duration: number;
  viewsCount: number;
  hasViewed: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface StoryGroup {
  user: UserPreview;
  stories: Story[];
  hasUnviewed: boolean;
}

export interface HashtagInfo {
  tag: string;
  postsCount: number;
  isFollowing: boolean;
}
