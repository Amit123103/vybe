import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/layout/Screen';
import { AppHeader } from '../../components/layout/AppHeader';
import { VybeDivider } from '../../components/common/VybeDivider';
import { VybeCard } from '../../components/common/VybeCard';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface SettingsItemProps {
  icon: string;
  label: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps & { colors: ReturnType<typeof useTheme>['colors'] }> = ({
  icon,
  label,
  onPress,
  rightElement,
  danger = false,
  colors,
}) => (
  <TouchableOpacity
    style={styles.settingsItem}
    onPress={onPress}
    disabled={!onPress && !rightElement}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <Text style={{ fontSize: 18 }}>{icon}</Text>
    <Text
      style={[
        styles.settingsLabel,
        { color: danger ? colors.error : colors.textPrimary },
      ]}
    >
      {label}
    </Text>
    {rightElement || (
      <Text style={{ color: colors.textMuted, fontSize: 16 }}>›</Text>
    )}
  </TouchableOpacity>
);

export const SettingsScreen: React.FC = () => {
  const { colors, isDark, toggleScheme } = useTheme();
  const navigation = useNavigation();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => logout() },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ],
    );
  };

  return (
    <Screen>
      <AppHeader
        title="Settings"
        leftIcon={<Text style={{ color: colors.textPrimary, fontSize: 20 }}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>Appearance</Text>
        <VybeCard>
          <SettingsItem
            icon="🌙"
            label="Dark Mode"
            colors={colors}
            rightElement={
              <Switch
                value={isDark}
                onValueChange={toggleScheme}
                trackColor={{ false: colors.bgTertiary, true: colors.primary }}
              />
            }
          />
        </VybeCard>

        {/* Account */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>Account</Text>
        <VybeCard>
          <SettingsItem icon="🔒" label="Privacy" onPress={() => {}} colors={colors} />
          <VybeDivider marginVertical={0} />
          <SettingsItem icon="🔔" label="Notifications" onPress={() => {}} colors={colors} />
          <VybeDivider marginVertical={0} />
          <SettingsItem icon="🔑" label="Change Password" onPress={() => {}} colors={colors} />
          <VybeDivider marginVertical={0} />
          <SettingsItem icon="🚫" label="Blocked Users" onPress={() => {}} colors={colors} />
        </VybeCard>

        {/* Support */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>Support</Text>
        <VybeCard>
          <SettingsItem icon="❓" label="Help Center" onPress={() => {}} colors={colors} />
          <VybeDivider marginVertical={0} />
          <SettingsItem icon="📜" label="Terms of Service" onPress={() => {}} colors={colors} />
          <VybeDivider marginVertical={0} />
          <SettingsItem icon="🛡️" label="Privacy Policy" onPress={() => {}} colors={colors} />
        </VybeCard>

        {/* Danger Zone */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>Account Actions</Text>
        <VybeCard>
          <SettingsItem icon="🚪" label="Log Out" onPress={handleLogout} colors={colors} />
          <VybeDivider marginVertical={0} />
          <SettingsItem
            icon="💀"
            label="Delete Account"
            onPress={handleDeleteAccount}
            danger
            colors={colors}
          />
        </VybeCard>

        <Text style={[styles.versionText, { color: colors.textMuted }]}>
          Vybe v1.0.0
        </Text>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl * 2,
  },
  sectionHeader: {
    fontSize: typography.label.fontSize,
    fontFamily: typography.label.fontFamily,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  settingsLabel: {
    flex: 1,
    fontSize: typography.body1.fontSize,
    fontFamily: typography.body1.fontFamily,
  },
  versionText: {
    textAlign: 'center',
    marginTop: spacing.xl,
    fontSize: typography.caption.fontSize,
  },
});
