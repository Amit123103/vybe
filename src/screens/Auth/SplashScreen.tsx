import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { mmkvStorage, STORAGE_KEYS } from '../../services/storageService';

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation();
  const { initialize, isAuthenticated, isInitialized } = useAuth();
  const { colors: themeColors } = useTheme();

  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate logo
    logoScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back(2)) });
    logoOpacity.value = withTiming(1, { duration: 800 });

    // Animate glow pulse
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 }),
      ),
      -1,
      true,
    );

    // Animate tagline
    taglineOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));

    // Initialize auth and navigate
    initialize();
  }, [logoScale, logoOpacity, glowOpacity, taglineOpacity, initialize]);

  useEffect(() => {
    if (isInitialized) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigation.reset({ index: 0, routes: [{ name: 'Main' as never }] });
        } else {
          const onboarded = mmkvStorage.getBoolean(STORAGE_KEYS.ONBOARDING_COMPLETE);
          navigation.reset({
            index: 0,
            routes: [{ name: onboarded ? ('Login' as never) : ('Onboarding' as never) }],
          });
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, isAuthenticated, navigation]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: themeColors.bgPrimary }]}>
      {/* Glow Effect */}
      <Animated.View style={[styles.glowContainer, glowAnimatedStyle]}>
        <LinearGradient
          colors={['#FF3CAC', '#784BA0', '#2B86C5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glow}
        />
      </Animated.View>

      {/* Logo */}
      <Animated.View style={logoAnimatedStyle}>
        <Text style={styles.logoText}>VYBE</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={taglineStyle}>
        <Text style={[styles.tagline, { color: themeColors.textSecondary }]}>
          Where your vibe finds its tribe
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  glow: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  logoText: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 12,
    fontFamily: typography.displayXL.fontFamily,
  },
  tagline: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    marginTop: 12,
    letterSpacing: 1,
  },
});
