import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { VybeAvatar } from '../common/VybeAvatar';
import { useTheme } from '../../hooks/useTheme';
import { STORY_RING_SIZE, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface StoryRingProps {
  uri: string | null;
  name: string;
  hasUnviewed: boolean;
  isOwn?: boolean;
  onPress: () => void;
}

export const StoryRing: React.FC<StoryRingProps> = React.memo(
  ({ uri, name, hasUnviewed, isOwn = false, onPress }) => {
    const { colors } = useTheme();

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityLabel={isOwn ? 'Add to your story' : `View ${name}'s story`}
      >
        <VybeAvatar
          uri={uri}
          name={name}
          size="lg"
          showRing={hasUnviewed}
          ringColor={hasUnviewed ? ['#FF3CAC', '#784BA0', '#2B86C5'] : [colors.textMuted, colors.textMuted]}
        />
        {isOwn && (
          <View style={[styles.addButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.addIcon}>+</Text>
          </View>
        )}
        <Text
          style={[
            styles.name,
            { color: colors.textSecondary },
          ]}
          numberOfLines={1}
        >
          {isOwn ? 'Your Story' : name.split(' ')[0]}
        </Text>
      </TouchableOpacity>
    );
  },
);

StoryRing.displayName = 'StoryRing';

export const StoriesBar: React.FC<{
  stories: Array<{
    user: { id: string; avatar: string | null; displayName: string };
    hasUnviewed: boolean;
  }>;
  onStoryPress: (userId: string) => void;
  onAddStory: () => void;
  currentUserAvatar: string | null;
  currentUserName: string;
}> = React.memo(({ stories, onStoryPress, onAddStory, currentUserAvatar, currentUserName }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.barContainer, { borderBottomColor: colors.divider }]}>
      <View style={styles.scrollContent}>
        <StoryRing
          uri={currentUserAvatar}
          name={currentUserName}
          hasUnviewed={false}
          isOwn
          onPress={onAddStory}
        />
        {stories.map((story) => (
          <StoryRing
            key={story.user.id}
            uri={story.user.avatar}
            name={story.user.displayName}
            hasUnviewed={story.hasUnviewed}
            onPress={() => onStoryPress(story.user.id)}
          />
        ))}
      </View>
    </View>
  );
});

StoriesBar.displayName = 'StoriesBar';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: STORY_RING_SIZE + 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0A0A0F',
  },
  addIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: -1,
  },
  name: {
    fontSize: typography.micro.fontSize,
    fontFamily: typography.micro.fontFamily,
    marginTop: 4,
    textAlign: 'center',
  },
  barContainer: {
    borderBottomWidth: 1,
    paddingVertical: spacing.sm,
  },
  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
  },
});
