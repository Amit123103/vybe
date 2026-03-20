import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface VybeBadgeProps {
  count?: number;
  maxCount?: number;
  visible?: boolean;
  size?: 'sm' | 'md';
  color?: string;
  style?: ViewStyle;
}

export const VybeBadge: React.FC<VybeBadgeProps> = ({
  count,
  maxCount = 99,
  visible = true,
  size = 'sm',
  color,
  style,
}) => {
  const { colors } = useTheme();

  if (!visible || (count !== undefined && count <= 0)) return null;

  const bgColor = color || colors.primary;
  const isSmall = size === 'sm';
  const displayText = count !== undefined
    ? count > maxCount
      ? `${maxCount}+`
      : count.toString()
    : '';

  if (!displayText) {
    return (
      <View
        style={[
          styles.dot,
          { backgroundColor: bgColor },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor,
          minWidth: isSmall ? 18 : 22,
          height: isSmall ? 18 : 22,
          paddingHorizontal: displayText.length > 1 ? (isSmall ? 5 : 6) : 0,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: isSmall ? 10 : 12,
            color: '#FFFFFF',
          },
        ]}
      >
        {displayText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  badge: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
