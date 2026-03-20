import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Screen } from '../../components/layout/Screen';
import { AppHeader } from '../../components/layout/AppHeader';
import { VybeAvatar } from '../../components/common/VybeAvatar';
import { VybeLoader } from '../../components/common/VybeLoader';
import { PostCard } from '../../components/feed/PostCard';
import { usePost, usePostComments } from '../../hooks/usePost';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Comment } from '../../types/post.types';
import { FeedStackParamList } from '../../types/navigation.types';
import { getRelativeTime } from '../../utils/dateHelpers';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

type PostDetailRoute = RouteProp<FeedStackParamList, 'PostDetail'>;

export const PostDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<PostDetailRoute>();
  const { postId } = route.params;
  const { user } = useAuth();
  const { post, isLoading: postLoading } = usePost(postId);
  const { comments, isLoading: commentsLoading, addComment, isAddingComment } =
    usePostComments(postId);
  const [commentText, setCommentText] = React.useState('');

  const handleAddComment = useCallback(async () => {
    if (commentText.trim()) {
      await addComment(commentText.trim());
      setCommentText('');
    }
  }, [commentText, addComment]);

  const renderComment = useCallback(
    ({ item }: { item: Comment }) => (
      <View style={styles.commentContainer}>
        <VybeAvatar uri={item.author.avatar} name={item.author.displayName} size="sm" />
        <View style={styles.commentContent}>
          <Text style={[styles.commentUsername, { color: colors.textPrimary }]}>
            @{item.author.username}
          </Text>
          <Text style={[styles.commentText, { color: colors.textPrimary }]}>
            {item.text}
          </Text>
          <Text style={[styles.commentTime, { color: colors.textMuted }]}>
            {getRelativeTime(item.createdAt)}
          </Text>
        </View>
      </View>
    ),
    [colors],
  );

  if (postLoading) {
    return (
      <Screen>
        <AppHeader
          title="Post"
          leftIcon={<Text style={{ color: colors.textPrimary, fontSize: 20 }}>←</Text>}
          onLeftPress={() => navigation.goBack()}
        />
        <VybeLoader fullScreen />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader
        title="Post"
        leftIcon={<Text style={{ color: colors.textPrimary, fontSize: 20 }}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={post ? <PostCard post={post} /> : null}
          ListEmptyComponent={
            commentsLoading ? (
              <VybeLoader />
            ) : (
              <Text style={[styles.noComments, { color: colors.textMuted }]}>
                No comments yet. Be the first!
              </Text>
            )
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Comment Input */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.bgSecondary, borderTopColor: colors.border },
          ]}
        >
          <VybeAvatar uri={user?.avatar || null} name={user?.displayName || ''} size="sm" />
          <TextInput
            style={[
              styles.commentInput,
              { backgroundColor: colors.bgTertiary, color: colors.textPrimary },
            ]}
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textMuted}
            multiline
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!commentText.trim() || isAddingComment}
            accessibilityLabel="Post comment"
          >
            <Text
              style={{
                color: commentText.trim() ? colors.primary : colors.textMuted,
                fontWeight: '700',
                fontSize: 15,
              }}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  commentContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: '600',
  },
  commentText: {
    fontSize: typography.body2.fontSize,
    lineHeight: 20,
    marginTop: 2,
  },
  commentTime: {
    fontSize: typography.caption.fontSize,
    marginTop: 4,
  },
  noComments: {
    textAlign: 'center',
    padding: spacing.xxl,
    fontSize: typography.body2.fontSize,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
  },
  commentInput: {
    flex: 1,
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 80,
    fontSize: 14,
  },
});
