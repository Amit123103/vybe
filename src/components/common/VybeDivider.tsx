import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface VybeDividerProps {
  style?: ViewStyle;
  marginVertical?: number;
}

export const VybeDivider: React.FC<VybeDividerProps> = ({
  style,
  marginVertical = 16,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: colors.divider, marginVertical },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
  },
});
