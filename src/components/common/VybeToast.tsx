import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface VybeToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export const VybeToast: React.FC<VybeToastProps> = ({
  message,
  type = 'info',
  visible,
  onHide,
  duration = 3000,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-100);

  const typeColors = {
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
  };

  const typeIcons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300 });
      // Auto hide
      translateY.value = withDelay(
        duration,
        withTiming(-100, { duration: 300 }, () => {
          runOnJS(onHide)();
        }),
      );
    } else {
      translateY.value = withTiming(-100, { duration: 300 });
    }
  }, [visible, duration, onHide, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + 10,
          backgroundColor: colors.bgSecondary,
          borderLeftColor: typeColors[type],
        },
        animatedStyle,
      ]}
    >
      <Text style={[styles.icon, { color: typeColors[type] }]}>{typeIcons[type]}</Text>
      <Text style={[styles.message, { color: colors.textPrimary }]} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  icon: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
  },
});
