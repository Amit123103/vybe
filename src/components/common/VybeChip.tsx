import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface VybeChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const VybeChip: React.FC<VybeChipProps> = ({
  label,
  selected = false,
  onPress,
  size = 'md',
  icon,
  style,
}) => {
  const { colors } = useTheme();
  const isSmall = size === 'sm';

  if (selected) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={style}
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        <LinearGradient
          colors={['#FF3CAC', '#784BA0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.chip,
            {
              paddingVertical: isSmall ? 6 : 8,
              paddingHorizontal: isSmall ? 12 : 16,
            },
          ]}
        >
          {icon && icon}
          <Text
            style={[
              styles.label,
              {
                color: '#FFFFFF',
                fontSize: isSmall ? 12 : 14,
                marginLeft: icon ? 6 : 0,
              },
            ]}
          >
            {label}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        {
          backgroundColor: colors.bgTertiary,
          borderWidth: 1,
          borderColor: colors.border,
          paddingVertical: isSmall ? 6 : 8,
          paddingHorizontal: isSmall ? 12 : 16,
        },
        style,
      ]}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {icon && icon}
      <Text
        style={[
          styles.label,
          {
            color: colors.textSecondary,
            fontSize: isSmall ? 12 : 14,
            marginLeft: icon ? 6 : 0,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
  },
  label: {
    fontFamily: typography.bodyMedium.fontFamily,
    fontWeight: '500',
  },
});
