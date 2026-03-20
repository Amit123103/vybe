import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface VybeInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  showCharCount?: boolean;
  maxCharCount?: number;
  shake?: boolean;
}

export const VybeInput: React.FC<VybeInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  showCharCount = false,
  maxCharCount,
  shake = false,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const shakeAnimation = useSharedValue(0);

  React.useEffect(() => {
    if (shake && error) {
      shakeAnimation.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  }, [shake, error, shakeAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnimation.value }],
  }));

  const borderColor = error
    ? colors.error
    : isFocused
      ? colors.primary
      : colors.border;

  return (
    <Animated.View style={[styles.container, containerStyle, animatedStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.bgTertiary,
            borderColor,
            borderWidth: isFocused ? 1.5 : 1,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              fontFamily: typography.body2.fontFamily,
              fontSize: typography.body2.fontSize,
            },
          ]}
          placeholderTextColor={colors.textMuted}
          value={value}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      <View style={styles.footer}>
        {error && (
          <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
        )}
        {showCharCount && maxCharCount && (
          <Text
            style={[
              styles.charCount,
              {
                color: (value?.length || 0) > maxCharCount ? colors.error : colors.textMuted,
              },
            ]}
          >
            {value?.length || 0}/{maxCharCount}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.label.fontSize,
    fontFamily: typography.label.fontFamily,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  error: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    flex: 1,
  },
  charCount: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
  },
});
