import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { VYBE_REACTIONS } from '../../constants/config';
import { Reaction } from '../../types/post.types';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { formatNumber } from '../../utils/formatters';

interface VybeReactionsProps {
  reactions: Reaction[];
  onReact: (emoji: string) => void;
}

export const VybeReactions: React.FC<VybeReactionsProps> = React.memo(
  ({ reactions, onReact }) => {
    const { colors } = useTheme();

    const totalReactions = reactions.reduce((sum, r) => sum + r.count, 0);

    if (totalReactions === 0) return null;

    return (
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.reactionsRow}>
            {reactions
              .filter((r) => r.count > 0)
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((reaction) => (
                <TouchableOpacity
                  key={reaction.emoji}
                  style={[
                    styles.reactionChip,
                    {
                      backgroundColor: reaction.hasReacted
                        ? 'rgba(255, 60, 172, 0.15)'
                        : colors.bgTertiary,
                      borderColor: reaction.hasReacted
                        ? colors.primary
                        : 'transparent',
                      borderWidth: reaction.hasReacted ? 1 : 0,
                    },
                  ]}
                  onPress={() => onReact(reaction.emoji)}
                  activeOpacity={0.7}
                  accessibilityLabel={`React with ${reaction.emoji}`}
                >
                  <Text style={styles.emoji}>{reaction.emoji}</Text>
                  <Text style={[styles.count, { color: colors.textSecondary }]}>
                    {formatNumber(reaction.count)}
                  </Text>
                </TouchableOpacity>
              ))}
            {totalReactions > 0 && (
              <Text style={[styles.totalCount, { color: colors.textMuted }]}>
                +{formatNumber(totalReactions)} reactions
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  },
);

VybeReactions.displayName = 'VybeReactions';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  reactionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reactionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    gap: 4,
  },
  emoji: {
    fontSize: 14,
  },
  count: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    fontWeight: '500',
  },
  totalCount: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    marginLeft: 4,
  },
});
