import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { formatMessageTime } from '../../utils/dateHelpers';

interface ChatBubbleProps {
  content: string;
  isSent: boolean;
  time: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export const ChatBubble: React.FC<ChatBubbleProps> = React.memo(
  ({ content, isSent, time, status }) => {
    const { colors } = useTheme();

    const statusIcons: Record<string, string> = {
      sending: '⏳',
      sent: '✓',
      delivered: '✓✓',
      read: '✓✓',
    };

    return (
      <View style={[styles.container, isSent ? styles.sent : styles.received]}>
        <View
          style={[
            styles.bubble,
            isSent
              ? { backgroundColor: colors.primary }
              : { backgroundColor: colors.bgSecondary },
            isSent ? styles.sentBubble : styles.receivedBubble,
          ]}
        >
          <Text
            style={[
              styles.content,
              { color: isSent ? '#FFFFFF' : colors.textPrimary },
            ]}
          >
            {content}
          </Text>
          <View style={styles.meta}>
            <Text
              style={[
                styles.time,
                { color: isSent ? 'rgba(255,255,255,0.7)' : colors.textMuted },
              ]}
            >
              {formatMessageTime(time)}
            </Text>
            {isSent && status && (
              <Text
                style={[
                  styles.status,
                  {
                    color: status === 'read' ? '#40C4FF' : 'rgba(255,255,255,0.7)',
                  },
                ]}
              >
                {statusIcons[status]}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  },
);

ChatBubble.displayName = 'ChatBubble';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
  },
  sent: {
    alignItems: 'flex-end',
  },
  received: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sentBubble: {
    borderRadius: radius.lg,
    borderBottomRightRadius: radius.xs,
  },
  receivedBubble: {
    borderRadius: radius.lg,
    borderBottomLeftRadius: radius.xs,
  },
  content: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  time: {
    fontSize: typography.micro.fontSize,
    fontFamily: typography.micro.fontFamily,
  },
  status: {
    fontSize: 10,
  },
});
