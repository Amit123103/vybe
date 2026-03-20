import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ViewToken,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { VybeButton } from '../../components/common/VybeButton';
import { mmkvStorage, STORAGE_KEYS } from '../../services/storageService';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '📸',
    title: 'Share Your Vybe',
    subtitle: 'Post photos, videos, and text. Let the world see your unique vibe and style.',
  },
  {
    id: '2',
    emoji: '🌍',
    title: 'Find Your Tribe',
    subtitle: 'Connect with creators, friends, and communities that match your energy.',
  },
  {
    id: '3',
    emoji: '🚀',
    title: 'Go Viral Today',
    subtitle: 'Discover trending content, react with vibes, and build your audience fast.',
  },
];

export const OnboardingScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleComplete = () => {
    mmkvStorage.setBoolean(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
    navigation.navigate('Login' as never);
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      handleComplete();
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      {/* Skip */}
      {activeIndex < SLIDES.length - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleComplete}
          accessibilityLabel="Skip onboarding"
        >
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.slideEmoji}>{item.emoji}</Text>
            <Text style={[styles.slideTitle, { color: colors.textPrimary }]}>
              {item.title}
            </Text>
            <Text style={[styles.slideSubtitle, { color: colors.textSecondary }]}>
              {item.subtitle}
            </Text>
          </View>
        )}
      />

      {/* Bottom */}
      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === activeIndex ? colors.primary : colors.textMuted,
                  width: index === activeIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <VybeButton
          title={activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          fullWidth
        />

        {activeIndex === SLIDES.length - 1 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Login' as never)}
            style={styles.loginLink}
          >
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>
              I have an account
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: spacing.md,
    zIndex: 10,
    padding: 12,
  },
  skipText: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    fontWeight: '500',
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  slideEmoji: {
    fontSize: 80,
    marginBottom: spacing.xl,
  },
  slideTitle: {
    fontSize: typography.displayL.fontSize,
    fontFamily: typography.displayL.fontFamily,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  slideSubtitle: {
    fontSize: typography.body1.fontSize,
    fontFamily: typography.body1.fontFamily,
    textAlign: 'center',
    lineHeight: 26,
  },
  bottom: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  loginLink: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  loginText: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
  },
});
