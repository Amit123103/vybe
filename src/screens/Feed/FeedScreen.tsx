import React, { useCallback } from 'react';
import { View, Text, RefreshControl, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/layout/Screen';
import { AppHeader } from '../../components/layout/AppHeader';
import { PostCard } from '../../components/feed/PostCard';
import { StoriesBar } from '../../components/feed/StoryRing';
import { SkeletonPost } from '../../components/common/SkeletonPost';
import { EmptyState } from '../../components/common/EmptyState';
import { VybeBadge } from '../../components/common/VybeBadge';
import { useFeed, useStories } from '../../hooks/useFeed';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useNotificationStore } from '../../store/notificationStore';
import { Post } from '../../types/post.types';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const FeedScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { posts, isLoading, isRefreshing, loadMore, refresh, hasMore } = useFeed();
  const { stories } = useStories();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const renderPost = useCallback(({ item }: { item: Post }) => {
    return <PostCard post={item} />;
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <StoriesBar
        stories={stories.map((s) => ({
          user: {
            id: s.user.id,
            avatar: s.user.avatar,
            displayName: s.user.displayName,
          },
          hasUnviewed: s.hasUnviewed,
        }))}
        onStoryPress={() => {}}
        onAddStory={() => {}}
        currentUserAvatar={user?.avatar || null}
        currentUserName={user?.displayName || 'You'}
      />
    );
  }, [stories, user]);

  if (isLoading && posts.length === 0) {
    return (
      <Screen>
        <AppHeader
          titleComponent={
            <Text style={[styles.logoText, { color: colors.primary }]}>VYBE</Text>
          }
        />
        {[1, 2, 3].map((i) => (
          <SkeletonPost key={i} />
        ))}
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader
        titleComponent={
          <Text style={[styles.logoText, { color: colors.primary }]}>VYBE</Text>
        }
        rightIcon={
          <View style={styles.iconWithBadge}>
            <Text style={{ fontSize: 22 }}>💬</Text>
            <VybeBadge count={0} size="sm" style={styles.headerBadge} />
          </View>
        }
        rightIcon2={
          <View style={styles.iconWithBadge}>
            <Text style={{ fontSize: 22 }}>🔔</Text>
            {unreadCount > 0 && (
              <VybeBadge count={unreadCount} size="sm" style={styles.headerBadge} />
            )}
          </View>
        }
        onRightPress={() => navigation.navigate('Inbox' as never)}
        onRight2Press={() => navigation.navigate('NotificationsTab' as never)}
      />

      {posts.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Your feed is empty"
          subtitle="Follow people to see their posts here"
          actionLabel="Explore"
          onAction={() => navigation.navigate('ExploreTab' as never)}
        />
      ) : (
        <FlashList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          estimatedItemSize={500}
          ListHeaderComponent={renderHeader}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing ?? false}
              onRefresh={refresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 6,
    fontFamily: typography.displayXL.fontFamily,
  },
  iconWithBadge: {
    position: 'relative',
  },
  headerBadge: {
    position: 'absolute',
    top: -5,
    right: -8,
  },
});
