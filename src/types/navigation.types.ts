import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  FeedTab: NavigatorScreenParams<FeedStackParamList>;
  ExploreTab: undefined;
  CreateTab: undefined;
  NotificationsTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type FeedStackParamList = {
  Feed: undefined;
  PostDetail: { postId: string };
  UserProfile: { username: string };
  Hashtag: { tag: string };
  Chat: { conversationId: string; recipientName: string };
  Inbox: undefined;
};

export type ProfileStackParamList = {
  Profile: { username?: string };
  EditProfile: undefined;
  Followers: { userId: string; username: string };
  Following: { userId: string; username: string };
  Settings: undefined;
  PostDetail: { postId: string };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  CreatePost: { mediaType?: string };
  Camera: undefined;
  EditPost: { postId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
