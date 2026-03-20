import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Share } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { useLikePost, useBookmarkPost } from '../../hooks/usePost';
import { formatNumber } from '../../utils/formatters';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface PostActionsProps {
  postId: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  onCommentPress: () => void;
}

export const PostActions: React.FC<PostActionsProps> = React.memo(
  ({ postId, likesCount, commentsCount, repostsCount, isLiked, isBookmarked, onCommentPress }) => {
    const { colors } = useTheme();
    const { heavyImpact, mediumImpact, successNotification } = useHaptics();
    const likeMutation = useLikePost();
    const bookmarkMutation = useBookmarkPost();
    const likeScale = useSharedValue(1);
    const bookmarkScale = useSharedValue(1);

    const [localIsLiked, setLocalIsLiked] = useState(isLiked);
    const [localLikesCount, setLocalLikesCount] = useState(likesCount);
    const [localIsBookmarked, setLocalIsBookmarked] = useState(isBookmarked);

    const handleLike = useCallback(() => {
      heavyImpact();
      likeScale.value = withSequence(
        withSpring(1.4, { damping: 4 }),
        withSpring(1, { damping: 6 }),
      );
      setLocalIsLiked(!localIsLiked);
      setLocalLikesCount(localIsLiked ? localLikesCount - 1 : localLikesCount + 1);
      likeMutation.mutate(postId);
    }, [postId, localIsLiked, localLikesCount, likeMutation, heavyImpact, likeScale]);

    const handleBookmark = useCallback(() => {
      mediumImpact();
      bookmarkScale.value = withSequence(
        withSpring(1.3, { damping: 4 }),
        withSpring(1, { damping: 6 }),
      );
      setLocalIsBookmarked(!localIsBookmarked);
      bookmarkMutation.mutate(postId);
    }, [postId, localIsBookmarked, bookmarkMutation, mediumImpact, bookmarkScale]);

    const handleShare = useCallback(async () => {
      mediumImpact();
      try {
        await Share.share({
          message: `Check out this post on Vybe! https://vybe.app/posts/${postId}`,
        });
      } catch {
        // Share cancelled
      }
    }, [postId, mediumImpact]);

    const likeAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: likeScale.value }],
    }));

    const bookmarkAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: bookmarkScale.value }],
    }));

    return (
      <View style={styles.container}>
        <View style={styles.leftActions}>
          {/* Like */}
          <TouchableOpacity
            onPress={handleLike}
            style={styles.actionButton}
            activeOpacity={0.7}
            accessibilityLabel={localIsLiked ? 'Unlike post' : 'Like post'}
            accessibilityRole="button"
          >
            <Animated.Text
              style={[
                styles.actionIcon,
                likeAnimatedStyle,
                { color: localIsLiked ? '#FF3CAC' : colors.textPrimary },
              ]}
            >
              {localIsLiked ? '❤️' : '🤍'}
            </Animated.Text>
            <Text style={[styles.actionCount, { color: colors.textSecondary }]}>
              {formatNumber(localLikesCount)}
            </Text>
          </TouchableOpacity>

          {/* Comment */}
          <TouchableOpacity
            onPress={onCommentPress}
            style={styles.actionButton}
            activeOpacity={0.7}
            accessibilityLabel="Comment on post"
            accessibilityRole="button"
          >
            <Text style={[styles.actionIcon, { color: colors.textPrimary }]}>💬</Text>
            <Text style={[styles.actionCount, { color: colors.textSecondary }]}>
              {formatNumber(commentsCount)}
            </Text>
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity
            onPress={handleShare}
            style={styles.actionButton}
            activeOpacity={0.7}
            accessibilityLabel="Share post"
            accessibilityRole="button"
          >
            <Text style={[styles.actionIcon, { color: colors.textPrimary }]}>↗️</Text>
          </TouchableOpacity>
        </View>

        {/* Bookmark */}
        <TouchableOpacity
          onPress={handleBookmark}
          style={styles.actionButton}
          activeOpacity={0.7}
          accessibilityLabel={localIsBookmarked ? 'Remove bookmark' : 'Bookmark post'}
          accessibilityRole="button"
        >
          <Animated.Text
            style={[
              styles.actionIcon,
              bookmarkAnimatedStyle,
              { color: localIsBookmarked ? colors.warning : colors.textPrimary },
            ]}
          >
            {localIsBookmarked ? '🔖' : '🏷️'}
          </Animated.Text>
        </TouchableOpacity>
      </View>
    );
  },
);

PostActions.displayName = 'PostActions';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
    gap: 4,
  },
  actionIcon: {
    fontSize: 22,
  },
  actionCount: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    fontWeight: '500',
  },
});
