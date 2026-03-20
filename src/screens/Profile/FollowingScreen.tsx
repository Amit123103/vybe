import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Screen } from '../../components/layout/Screen';
import { AppHeader } from '../../components/layout/AppHeader';
import { VybeAvatar } from '../../components/common/VybeAvatar';
import { FollowButton } from '../../components/profile/FollowButton';
import { VybeLoader } from '../../components/common/VybeLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { useFollowing } from '../../hooks/useProfile';
import { useTheme } from '../../hooks/useTheme';
import { ProfileStackParamList } from '../../types/navigation.types';
import { UserPreview } from '../../types/user.types';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

type FollowingRoute = RouteProp<ProfileStackParamList, 'Following'>;

export const FollowingScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<FollowingRoute>();
  const { userId } = route.params;
  const { data, isLoading } = useFollowing(userId);

  const renderUser = useCallback(
    ({ item }: { item: UserPreview }) => (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => (navigation as any).navigate('UserProfile', { username: item.username })}
      >
        <VybeAvatar uri={item.avatar} name={item.displayName} size="md" />
        <View style={styles.userInfo}>
          <Text style={[styles.displayName, { color: colors.textPrimary }]}>
            {item.displayName}
          </Text>
          <Text style={[styles.username, { color: colors.textSecondary }]}>
            @{item.username}
          </Text>
        </View>
        <FollowButton isFollowing={true} onPress={() => {}} size="sm" />
      </TouchableOpacity>
    ),
    [colors, navigation],
  );

  return (
    <Screen>
      <AppHeader
        title="Following"
        leftIcon={<Text style={{ color: colors.textPrimary, fontSize: 20 }}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />
      {isLoading ? (
        <VybeLoader fullScreen />
      ) : !data || data.data.length === 0 ? (
        <EmptyState icon="👥" title="Not following anyone" />
      ) : (
        <FlatList
          data={data.data}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: '600',
  },
  username: {
    fontSize: typography.caption.fontSize,
    marginTop: 2,
  },
});
