import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { VybeAvatar } from '../common/VybeAvatar';
import { VybeButton } from '../common/VybeButton';
import { useTheme } from '../../hooks/useTheme';
import { useFollowUser } from '../../hooks/useProfile';
import { useHaptics } from '../../hooks/useHaptics';
import { UserPreview } from '../../types/user.types';
import { getRelativeTime } from '../../utils/dateHelpers';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface PostHeaderProps {
  author: UserPreview;
  createdAt: string;
  onMenuPress: () => void;
}

export const PostHeader: React.FC<PostHeaderProps> = React.memo(
  ({ author, createdAt, onMenuPress }) => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const followMutation = useFollowUser();
    const { mediumImpact } = useHaptics();

    const handleFollow = useCallback(() => {
      mediumImpact();
      followMutation.mutate(author.id);
    }, [author.id, followMutation, mediumImpact]);

    const handleProfilePress = useCallback(() => {
      (navigation as any).navigate('UserProfile', { username: author.username });
    }, [author.username, navigation]);

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.left}
          onPress={handleProfilePress}
          activeOpacity={0.7}
          accessibilityLabel={`View ${author.displayName}'s profile`}
        >
          <VybeAvatar uri={author.avatar} name={author.displayName} size="md" />
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={[styles.username, { color: colors.textPrimary }]}>
                @{author.username}
              </Text>
              {author.isVerified && <Text style={styles.verified}> ✓</Text>}
            </View>
            <Text style={[styles.time, { color: colors.textMuted }]}>
              {getRelativeTime(createdAt)}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.right}>
          {!author.isFollowing && (
            <VybeButton
              title="Follow"
              onPress={handleFollow}
              variant="outline"
              size="sm"
              loading={followMutation.isPending}
            />
          )}
          <TouchableOpacity
            onPress={onMenuPress}
            style={styles.menuButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Post options"
          >
            <Text style={[styles.menuIcon, { color: colors.textSecondary }]}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

PostHeader.displayName = 'PostHeader';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  info: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: typography.bodyMedium.fontFamily,
    fontWeight: '600',
  },
  verified: {
    color: '#40C4FF',
    fontSize: 14,
    fontWeight: '700',
  },
  time: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 20,
    fontWeight: '700',
  },
});
