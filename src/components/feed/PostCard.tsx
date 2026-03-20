import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PostHeader } from './PostHeader';
import { PostMedia } from './PostMedia';
import { PostActions } from './PostActions';
import { PostCaption } from './PostCaption';
import { VybeReactions } from './VybeReactions';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { Post } from '../../types/post.types';
import { postService } from '../../services/postService';
import { spacing } from '../../constants/spacing';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = React.memo(({ post }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { heavyImpact } = useHaptics();
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  const handleDoubleTap = useCallback(() => {
    if (!post.isLiked) {
      heavyImpact();
      setShowLikeAnimation(true);
      postService.likePost(post.id);
      setTimeout(() => setShowLikeAnimation(false), 1000);
    }
  }, [post.id, post.isLiked, heavyImpact]);

  const handleCommentPress = useCallback(() => {
    (navigation as any).navigate('PostDetail', { postId: post.id });
  }, [post.id, navigation]);

  const handleMenuPress = useCallback(() => {
    // Bottom sheet menu - to be wired up
  }, []);

  const handleHashtagPress = useCallback(
    (tag: string) => {
      (navigation as any).navigate('Hashtag', { tag });
    },
    [navigation],
  );

  const handleUsernamePress = useCallback(() => {
      (navigation as any).navigate('UserProfile', { username: post.author.username });
  }, [post.author.username, navigation]);

  const handleReact = useCallback(
    (emoji: string) => {
      postService.reactToPost(post.id, emoji);
    },
    [post.id],
  );

  return (
    <View style={[styles.container, { borderBottomColor: colors.divider }]}>
      <PostHeader
        author={post.author}
        createdAt={post.createdAt}
        onMenuPress={handleMenuPress}
      />

      <PostMedia
        mediaType={post.mediaType}
        mediaUrls={post.mediaUrls}
        onDoubleTap={handleDoubleTap}
      />

      <VybeReactions reactions={post.reactions} onReact={handleReact} />

      <PostActions
        postId={post.id}
        likesCount={post.likesCount}
        commentsCount={post.commentsCount}
        repostsCount={post.repostsCount}
        isLiked={post.isLiked}
        isBookmarked={post.isBookmarked}
        onCommentPress={handleCommentPress}
      />

      <PostCaption
        username={post.author.username}
        caption={post.caption}
        hashtags={post.hashtags}
        onHashtagPress={handleHashtagPress}
        onUsernamePress={handleUsernamePress}
      />
    </View>
  );
});

PostCard.displayName = 'PostCard';

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingBottom: spacing.sm,
  },
});
