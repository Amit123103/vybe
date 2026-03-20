import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { useNotificationStore } from '../../store/notificationStore';
import { TAB_BAR_HEIGHT, radius, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { VybeBadge } from '../common/VybeBadge';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  FeedTab: { active: '🏠', inactive: '🏡' },
  ExploreTab: { active: '🔍', inactive: '🔎' },
  CreateTab: { active: '➕', inactive: '➕' },
  NotificationsTab: { active: '🔔', inactive: '🔕' },
  ProfileTab: { active: '👤', inactive: '👥' },
};

const TAB_LABELS: Record<string, string> = {
  FeedTab: 'Home',
  ExploreTab: 'Explore',
  CreateTab: 'Create',
  NotificationsTab: 'Alerts',
  ProfileTab: 'Profile',
};

const AnimatedTab: React.FC<{
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  icon: string;
  label: string;
  isCreate: boolean;
  badge?: number;
  colors: ReturnType<typeof useTheme>['colors'];
}> = ({ isFocused, onPress, onLongPress, icon, label, isCreate, badge, colors }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.85, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 15 });
    });
    onPress();
  };

  if (isCreate) {
    return (
      <View style={styles.tabItem}>
        <TouchableOpacity
          onPress={handlePress}
          onLongPress={onLongPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Create new post"
        >
          <Animated.View style={animatedStyle}>
            <LinearGradient
              colors={['#FF3CAC', '#784BA0', '#2B86C5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.createButton}
            >
              <Text style={styles.createIcon}>＋</Text>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={onLongPress}
      style={styles.tabItem}
      activeOpacity={0.7}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
    >
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        <View style={styles.iconContainer}>
          <Text style={[styles.tabIcon, { opacity: isFocused ? 1 : 0.6 }]}>
            {icon}
          </Text>
          {badge !== undefined && badge > 0 && (
            <VybeBadge count={badge} size="sm" style={styles.badge} />
          )}
        </View>
        <Text
          style={[
            styles.tabLabel,
            {
              color: isFocused ? colors.primary : colors.textMuted,
              fontWeight: isFocused ? '600' : '400',
            },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const TabBar: React.FC<BottomTabBarProps> = ({ state, navigation, descriptors }) => {
  const { colors } = useTheme();
  const { selectionFeedback } = useHaptics();
  const insets = useSafeAreaInsets();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bgSecondary,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const isCreate = route.name === 'CreateTab';
        const icons = TAB_ICONS[route.name] || { active: '●', inactive: '○' };
        const label = TAB_LABELS[route.name] || route.name;

        const onPress = () => {
          selectionFeedback();
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            if (isCreate) {
              navigation.getParent()?.navigate('CreatePost');
            } else {
              navigation.navigate(route.name);
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <AnimatedTab
            key={route.key}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            icon={isFocused ? icons.active : icons.inactive}
            label={label}
            isCreate={isCreate}
            badge={route.name === 'NotificationsTab' ? unreadCount : undefined}
            colors={colors}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: typography.caption.fontFamily,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -4,
  },
  createIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
