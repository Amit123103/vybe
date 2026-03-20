import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/layout/Screen';
import { AppHeader } from '../../components/layout/AppHeader';
import { VybeButton } from '../../components/common/VybeButton';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const CameraScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <Screen>
      <AppHeader
        title="Camera"
        leftIcon={<Text style={{ color: colors.textPrimary, fontSize: 20 }}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <View style={[styles.cameraPreview, { backgroundColor: colors.bgTertiary }]}>
          <Text style={styles.cameraEmoji}>📸</Text>
          <Text style={[styles.cameraText, { color: colors.textSecondary }]}>
            Camera preview will appear here
          </Text>
        </View>
        <View style={styles.controls}>
          <VybeButton
            title="Capture"
            onPress={() => {}}
            fullWidth
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  cameraText: {
    fontSize: typography.body2.fontSize,
  },
  controls: {
    padding: spacing.lg,
  },
});
