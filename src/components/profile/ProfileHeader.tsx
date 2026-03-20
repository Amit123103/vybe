import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { VybeAvatar } from '../common/VybeAvatar';
import { VybeButton } from '../common/VybeButton';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { UserProfile } from '../../types/user.types';
import { formatNumber } from '../../utils/formatters';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile: boolean;
  onEditPress: () => void;
  onFollowPress: () => void;
  onMessagePress: () => void;
  onFollowersPress: () => void;
  onFollowingPress: () => void;
  isFollowLoading?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isOwnProfile,
  onEditPress,
  onFollowPress,
  onMessagePress,
  onFollowersPress,
  onFollowingPress,
  isFollowLoading = false,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Cover Photo */}
      <View style={[styles.coverContainer, { backgroundColor: colors.bgTertiary }]}>
        {profile.coverPhoto ? (
          <Image
            source={{ uri: profile.coverPhoto }}
            style={styles.coverImage}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={[styles.coverImage, { backgroundColor: colors.bgTertiary }]} />
        )}
      </View>

      {/* Avatar */}
      <View style={[styles.avatarContainer, { borderColor: colors.bgPrimary }]}>
        <VybeAvatar
          uri={profile.avatar}
          name={profile.displayName}
          size="xl"
          showRing
        />
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={[styles.displayName, { color: colors.textPrimary }]}>
            {profile.displayName}
          </Text>
          {profile.isVerified && <Text style={styles.verified}> ✓</Text>}
        </View>
        <Text style={[styles.username, { color: colors.textSecondary }]}>
          @{profile.username}
        </Text>

        {profile.bio ? (
          <Text style={[styles.bio, { color: colors.textPrimary }]}>{profile.bio}</Text>
        ) : null}

        {profile.website ? (
          <TouchableOpacity>
            <Text style={[styles.website, { color: colors.accent }]}>{profile.website}</Text>
          </TouchableOpacity>
        ) : null}

        {/* Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
              {formatNumber(profile.postsCount)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stat} onPress={onFollowersPress}>
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
              {formatNumber(profile.followersCount)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stat} onPress={onFollowingPress}>
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
              {formatNumber(profile.followingCount)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Following</Text>
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          {isOwnProfile ? (
            <VybeButton
              title="Edit Profile"
              onPress={onEditPress}
              variant="secondary"
              fullWidth
            />
          ) : (
            <>
              <VybeButton
                title={profile.isFollowing ? 'Following' : 'Follow'}
                onPress={onFollowPress}
                variant={profile.isFollowing ? 'secondary' : 'primary'}
                style={styles.followButton}
                loading={isFollowLoading}
              />
              <VybeButton
                title="Message"
                onPress={onMessagePress}
                variant="secondary"
                style={styles.messageButton}
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  coverContainer: {
    height: 200,
    width: SCREEN_WIDTH,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  avatarContainer: {
    position: 'absolute',
    top: 156,
    left: spacing.md,
    borderWidth: 4,
    borderRadius: 44,
    zIndex: 10,
  },
  infoContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: 48,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {
    fontSize: typography.h2.fontSize,
    fontFamily: typography.h2.fontFamily,
    fontWeight: '700',
  },
  verified: {
    color: '#40C4FF',
    fontSize: 18,
    fontWeight: '700',
  },
  username: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    marginTop: 2,
  },
  bio: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  website: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    marginTop: 4,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.h3.fontSize,
    fontFamily: typography.h3.fontFamily,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  followButton: {
    flex: 1,
  },
  messageButton: {
    flex: 1,
  },
});
