import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { FEED_CONFIG } from '../../constants/config';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface PostCaptionProps {
  username: string;
  caption: string;
  hashtags: string[];
  onHashtagPress?: (tag: string) => void;
  onUsernamePress?: () => void;
}

export const PostCaption: React.FC<PostCaptionProps> = React.memo(
  ({ username, caption, hashtags, onHashtagPress, onUsernamePress }) => {
    const { colors } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldTruncate = caption.length > FEED_CONFIG.maxCaptionPreview;

    const displayCaption = isExpanded || !shouldTruncate
      ? caption
      : caption.slice(0, FEED_CONFIG.maxCaptionPreview);

    const toggleExpand = useCallback(() => {
      setIsExpanded(!isExpanded);
    }, [isExpanded]);

    return (
      <View style={styles.container}>
        <Text style={styles.captionText}>
          <Text
            style={[styles.username, { color: colors.textPrimary }]}
            onPress={onUsernamePress}
          >
            @{username}
          </Text>
          {'  '}
          <Text style={[styles.caption, { color: colors.textPrimary }]}>
            {displayCaption}
          </Text>
          {shouldTruncate && !isExpanded && (
            <Text
              style={[styles.seeMore, { color: colors.textMuted }]}
              onPress={toggleExpand}
            >
              {' '}...See more
            </Text>
          )}
        </Text>

        {hashtags.length > 0 && (
          <View style={styles.hashtagsRow}>
            {hashtags.map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => onHashtagPress?.(tag)}
                accessibilityLabel={`Hashtag ${tag}`}
              >
                <Text style={[styles.hashtag, { color: colors.accent }]}>
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  },
);

PostCaption.displayName = 'PostCaption';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  captionText: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    lineHeight: 20,
  },
  username: {
    fontWeight: '700',
  },
  caption: {
    fontWeight: '400',
  },
  seeMore: {
    fontWeight: '400',
  },
  hashtagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  hashtag: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    fontWeight: '500',
  },
});
