import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing, SCREEN_PADDING } from '../../constants/spacing';

const SkeletonBlock: React.FC<{
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}> = ({ width, height, borderRadius = radius.sm, style }) => {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 }),
      ),
      -1,
      false,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: colors.bgTertiary,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export const SkeletonPost: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <SkeletonBlock width={40} height={40} borderRadius={20} />
        <View style={styles.headerText}>
          <SkeletonBlock width={120} height={14} />
          <SkeletonBlock width={80} height={10} style={{ marginTop: 6 }} />
        </View>
      </View>
      {/* Media */}
      <SkeletonBlock width="100%" height={300} borderRadius={radius.md} style={{ marginTop: 12 }} />
      {/* Actions */}
      <View style={styles.actions}>
        <SkeletonBlock width={60} height={14} />
        <SkeletonBlock width={60} height={14} />
        <SkeletonBlock width={60} height={14} />
      </View>
      {/* Caption */}
      <SkeletonBlock width="90%" height={14} style={{ marginTop: 8 }} />
      <SkeletonBlock width="60%" height={14} style={{ marginTop: 6 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingRight: spacing.xxl,
  },
});
