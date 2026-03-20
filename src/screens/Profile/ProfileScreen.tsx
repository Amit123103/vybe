import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/layout/Screen';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { ProfileGrid } from '../../components/profile/ProfileGrid';
import { VybeLoader } from '../../components/common/VybeLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { useProfile, useFollowUser } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../constants/spacing';

export const ProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { profile, isLoading } = useProfile(user?.username || '');
  const followMutation = useFollowUser();
  const isOwnProfile = true;

  if (isLoading || !profile) {
    return (
      <Screen>
        <VybeLoader fullScreen />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          profile={profile}
          isOwnProfile={isOwnProfile}
          onEditPress={() => (navigation as any).navigate('EditProfile')}
          onFollowPress={() => followMutation.mutate(profile.id)}
          onMessagePress={() => {}}
          onFollowersPress={() =>
            (navigation as any).navigate('Followers', { userId: profile.id })
          }
          onFollowingPress={() =>
            (navigation as any).navigate('Following', { userId: profile.id })
          }
          isFollowLoading={followMutation.isPending}
        />

        <View style={styles.gridContainer}>
          {profile.posts && profile.posts.length > 0 ? (
            <ProfileGrid posts={profile.posts} />
          ) : (
            <EmptyState
              icon="📸"
              title="No posts yet"
              subtitle={isOwnProfile ? 'Share your first post!' : 'This user hasn\'t posted yet'}
              actionLabel={isOwnProfile ? 'Create Post' : undefined}
              onAction={isOwnProfile ? () => (navigation as any).navigate('CreatePost') : undefined}
            />
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    marginTop: spacing.md,
    minHeight: 300,
  },
});
