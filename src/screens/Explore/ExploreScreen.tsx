import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Screen } from '../../components/layout/Screen';
import { VybeChip } from '../../components/common/VybeChip';
import { EmptyState } from '../../components/common/EmptyState';
import { VybeLoader } from '../../components/common/VybeLoader';
import { useSearch } from '../../hooks/useSearch';
import { useTrending } from '../../hooks/useFeed';
import { useTheme } from '../../hooks/useTheme';
import { FollowButton } from '../../components/profile/FollowButton';
import { VybeAvatar } from '../../components/common/VybeAvatar';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 2;
const GRID_ITEM_SIZE = (SCREEN_WIDTH - GRID_GAP) / 2;

const TRENDING_TAGS = ['#vybecheck', '#trending', '#photography', '#music', '#fashion', '#art'];

export const ExploreScreen: React.FC = () => {
  const { colors } = useTheme();
  const { query, setQuery, results, isSearching, recentSearches, addToRecent, clearRecent } =
    useSearch();
  const { posts: trendingPosts, isLoading: trendingLoading } = useTrending();

  return (
    <Screen>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.bgPrimary }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.bgTertiary }]}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search people, posts, hashtags..."
            placeholderTextColor={colors.textMuted}
            style={[styles.searchInput, { color: colors.textPrimary }]}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={{ color: colors.textMuted, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {query.length >= 2 ? (
          // Search Results
          <View style={styles.resultsContainer}>
            {isSearching ? (
              <VybeLoader />
            ) : results.length > 0 ? (
              results.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={styles.userResult}
                  onPress={() => addToRecent(user.username)}
                >
                  <VybeAvatar uri={user.avatar} name={user.displayName} size="md" />
                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: colors.textPrimary }]}>
                      {user.displayName}
                    </Text>
                    <Text style={[styles.userHandle, { color: colors.textSecondary }]}>
                      @{user.username}
                    </Text>
                  </View>
                  <FollowButton isFollowing={user.isFollowing} onPress={() => {}} size="sm" />
                </TouchableOpacity>
              ))
            ) : (
              <EmptyState
                icon="🔍"
                title="No results"
                subtitle={`Nothing found for "${query}"`}
              />
            )}
          </View>
        ) : (
          <>
            {/* Trending Tags */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Trending
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.tagsRow}>
                  {TRENDING_TAGS.map((tag) => (
                    <VybeChip key={tag} label={tag} onPress={() => setQuery(tag)} />
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Masonry Grid */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Discover
              </Text>
              {trendingLoading ? (
                <VybeLoader />
              ) : (
                <View style={styles.masonryGrid}>
                  {trendingPosts.slice(0, 10).map((post, index) => (
                    <TouchableOpacity key={post.id} activeOpacity={0.8}>
                      <Image
                        source={{ uri: post.mediaUrls[0] || post.thumbnailUrl }}
                        style={[
                          styles.gridItem,
                          {
                            backgroundColor: colors.bgTertiary,
                            height: index % 3 === 0 ? GRID_ITEM_SIZE * 1.4 : GRID_ITEM_SIZE,
                          },
                        ]}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
  },
  resultsContainer: {
    paddingTop: spacing.sm,
  },
  userResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: '600',
  },
  userHandle: {
    fontSize: typography.caption.fontSize,
    marginTop: 2,
  },
  section: {
    paddingTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontFamily: typography.h3.fontFamily,
    fontWeight: '700',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  masonryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    paddingHorizontal: 1,
  },
  gridItem: {
    width: GRID_ITEM_SIZE - 1,
    borderRadius: radius.xs,
  },
});
