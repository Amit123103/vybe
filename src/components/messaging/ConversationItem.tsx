import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { VybeAvatar } from '../common/VybeAvatar';
import { VybeBadge } from '../common/VybeBadge';
import { useTheme } from '../../hooks/useTheme';
import { Conversation } from '../../types/message.types';
import { getRelativeTime } from '../../utils/dateHelpers';
import { truncateText } from '../../utils/formatters';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: string;
  onPress: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = React.memo(
  ({ conversation, currentUserId, onPress }) => {
    const { colors } = useTheme();
    const otherParticipant = conversation.participants.find((p) => p.id !== currentUserId);
    const hasUnread = conversation.unreadCount > 0;

    if (!otherParticipant) return null;

    return (
      <TouchableOpacity
        style={[
          styles.container,
          hasUnread && { backgroundColor: 'rgba(255, 60, 172, 0.04)' },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityLabel={`Conversation with ${otherParticipant.displayName}`}
      >
        <VybeAvatar
          uri={otherParticipant.avatar}
          name={otherParticipant.displayName}
          size="lg"
          showOnlineStatus
          isOnline={false}
        />

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text
              style={[
                styles.name,
                {
                  color: colors.textPrimary,
                  fontWeight: hasUnread ? '700' : '500',
                },
              ]}
              numberOfLines={1}
            >
              {otherParticipant.displayName}
              {otherParticipant.isVerified && ' ✓'}
            </Text>
            <Text style={[styles.time, { color: colors.textMuted }]}>
              {conversation.lastMessage
                ? getRelativeTime(conversation.lastMessage.createdAt)
                : ''}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <Text
              style={[
                styles.lastMessage,
                {
                  color: hasUnread ? colors.textPrimary : colors.textSecondary,
                  fontWeight: hasUnread ? '500' : '400',
                },
              ]}
              numberOfLines={1}
            >
              {conversation.lastMessage
                ? truncateText(conversation.lastMessage.content, 45)
                : 'Start a conversation'}
            </Text>
            {hasUnread && <VybeBadge count={conversation.unreadCount} size="sm" />}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

ConversationItem.displayName = 'ConversationItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm + 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: typography.bodyMedium.fontFamily,
    flex: 1,
  },
  time: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    marginLeft: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  lastMessage: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    flex: 1,
  },
});
