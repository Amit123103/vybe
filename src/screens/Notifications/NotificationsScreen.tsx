import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, SectionList, StyleSheet } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { AppHeader } from '../../components/layout/AppHeader';
import { VybeAvatar } from '../../components/common/VybeAvatar';
import { VybeLoader } from '../../components/common/VybeLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { FollowButton } from '../../components/profile/FollowButton';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../hooks/useTheme';
import { AppNotification, NotificationGroup } from '../../types/notification.types';
import { getRelativeTime, getGroupLabel } from '../../utils/dateHelpers';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

const TABS = ['All', 'Mentions', 'Follows', 'Reactions'];

const typeIcons: Record<string, string> = {
  like: '💜',
  comment: '💬',
  follow: '👤',
  mention: '🏷️',
  repost: '🔁',
  reaction: '🔥',
  trending: '📈',
  tag: '🏷️',
};

export const NotificationsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('All');
  const tabType = activeTab === 'All' ? undefined : activeTab.toLowerCase();
  const { notifications, isLoading, markAllAsRead } = useNotifications(tabType);

  const sections = useMemo(() => {
    const groups: Record<string, AppNotification[]> = {};
    notifications.forEach((n) => {
      const label = getGroupLabel(n.createdAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(n);
    });
    return Object.entries(groups).map(([label, data]) => ({ label, data }));
  }, [notifications]);

  const renderNotification = useCallback(
    ({ item }: { item: AppNotification }) => (
      <View
        style={[
          styles.notifItem,
          !item.isRead && { borderLeftColor: colors.primary, borderLeftWidth: 3 },
        ]}
      >
        <VybeAvatar uri={item.actor.avatar} name={item.actor.displayName} size="md" />
        <View style={styles.notifContent}>
          <Text style={[styles.notifText, { color: colors.textPrimary }]}>
            <Text style={{ fontWeight: '700' }}>@{item.actor.username} </Text>
            {item.message}
          </Text>
          <Text style={[styles.notifTime, { color: colors.textMuted }]}>
            {typeIcons[item.type]} {getRelativeTime(item.createdAt)}
          </Text>
        </View>
        {item.type === 'follow' && (
          <FollowButton isFollowing={false} onPress={() => {}} size="sm" />
        )}
      </View>
    ),
    [colors],
  );

  return (
    <Screen>
      <AppHeader
        title="Notifications"
        rightIcon={
          <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>
            Mark all read
          </Text>
        }
        onRightPress={markAllAsRead}
      />

      {/* Tabs */}
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === tab ? colors.primary : colors.textSecondary,
                  fontWeight: activeTab === tab ? '700' : '400',
                },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <VybeLoader fullScreen />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No notifications yet"
          subtitle="When someone interacts with you, you'll see it here"
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          renderSectionHeader={({ section }) => (
            <View style={[styles.sectionHeader, { backgroundColor: colors.bgPrimary }]}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                {section.label}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: typography.body2.fontSize,
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.label.fontSize,
    fontFamily: typography.label.fontFamily,
    fontWeight: '600',
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  notifContent: {
    flex: 1,
  },
  notifText: {
    fontSize: typography.body2.fontSize,
    lineHeight: 20,
  },
  notifTime: {
    fontSize: typography.caption.fontSize,
    marginTop: 4,
  },
});
