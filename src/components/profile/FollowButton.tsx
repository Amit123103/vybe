import React, { useState, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface FollowButtonProps {
  isFollowing: boolean;
  onPress: () => void;
  loading?: boolean;
  size?: 'sm' | 'md';
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  isFollowing: initialFollowing,
  onPress,
  loading = false,
  size = 'md',
}) => {
  const { colors } = useTheme();
  const { mediumImpact } = useHaptics();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const progress = useSharedValue(initialFollowing ? 1 : 0);

  const handlePress = useCallback(() => {
    mediumImpact();
    const newState = !isFollowing;
    setIsFollowing(newState);
    progress.value = withTiming(newState ? 1 : 0, { duration: 300 });
    onPress();
  }, [isFollowing, onPress, progress, mediumImpact]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.primary, colors.bgTertiary],
    ),
    borderWidth: progress.value > 0.5 ? 1 : 0,
    borderColor: colors.border,
  }));

  const isSmall = size === 'sm';

  return (
    <Animated.View style={[styles.container, animatedStyle, isSmall && styles.small]}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={loading}
        style={styles.touchable}
        activeOpacity={0.8}
        accessibilityLabel={isFollowing ? 'Unfollow' : 'Follow'}
        accessibilityRole="button"
      >
        <Text
          style={[
            styles.label,
            {
              color: isFollowing ? colors.textPrimary : '#FFFFFF',
              fontSize: isSmall ? 12 : 14,
            },
          ]}
        >
          {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  small: {
    minWidth: 80,
  },
  touchable: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    minHeight: 36,
  },
  label: {
    fontFamily: typography.label.fontFamily,
    fontWeight: '600',
    textAlign: 'center',
  },
});
