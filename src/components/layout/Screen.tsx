import React from 'react';
import { View, StyleSheet, StatusBar, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

interface ScreenProps {
  children: React.ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: ViewStyle;
  statusBarStyle?: 'light' | 'dark';
  backgroundColor?: string;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  edges = ['top'],
  style,
  statusBarStyle,
  backgroundColor,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const bgColor = backgroundColor || colors.bgPrimary;
  const mappedBarStyle = statusBarStyle === 'dark' ? 'dark-content' : statusBarStyle === 'light' ? 'light-content' : undefined;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor },
        edges.includes('top') && { paddingTop: insets.top },
        edges.includes('bottom') && { paddingBottom: insets.bottom },
        edges.includes('left') && { paddingLeft: insets.left },
        edges.includes('right') && { paddingRight: insets.right },
        style,
      ]}
    >
      <StatusBar
        barStyle={mappedBarStyle || (isDark ? 'light-content' : 'dark-content')}
        backgroundColor={bgColor}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
