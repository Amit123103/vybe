import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing, shadow } from '../../constants/spacing';

interface VybeCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  padding?: keyof typeof spacing;
  style?: ViewStyle;
}

export const VybeCard: React.FC<VybeCardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
}) => {
  const { colors } = useTheme();

  const variantStyles: Record<string, ViewStyle> = {
    default: {
      backgroundColor: colors.bgSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    glass: {
      backgroundColor: colors.bgGlass,
      borderWidth: 1,
      borderColor: colors.border,
    },
    elevated: {
      backgroundColor: colors.bgSecondary,
      ...shadow.card,
    },
  };

  return (
    <View
      style={[
        styles.card,
        variantStyles[variant],
        { padding: spacing[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});
