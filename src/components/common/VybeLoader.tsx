import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';

interface VybeLoaderProps {
  size?: 'small' | 'large';
  fullScreen?: boolean;
  text?: string;
  style?: ViewStyle;
}

export const VybeLoader: React.FC<VybeLoaderProps> = ({
  size = 'large',
  fullScreen = false,
  text,
  style,
}) => {
  const { colors } = useTheme();

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, { backgroundColor: colors.bgPrimary }, style]}>
        <ActivityIndicator size={size} color={colors.primary} />
        {text && (
          <Text style={[styles.text, { color: colors.textSecondary }]}>{text}</Text>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {text && (
        <Text style={[styles.text, { color: colors.textSecondary }]}>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 14,
  },
});
