import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { AVATAR_SIZES } from '../../constants/spacing';
import { generateInitials } from '../../utils/formatters';

interface VybeAvatarProps {
  uri: string | null;
  name: string;
  size?: keyof typeof AVATAR_SIZES;
  showRing?: boolean;
  ringColor?: string[];
  showOnlineStatus?: boolean;
  isOnline?: boolean;
  style?: ViewStyle;
}

export const VybeAvatar: React.FC<VybeAvatarProps> = ({
  uri,
  name,
  size = 'md',
  showRing = false,
  ringColor = ['#FF3CAC', '#784BA0', '#2B86C5'],
  showOnlineStatus = false,
  isOnline = false,
  style,
}) => {
  const { colors } = useTheme();
  const avatarSize = AVATAR_SIZES[size];
  const ringSize = avatarSize + 6;

  const initials = generateInitials(name);

  const avatar = uri ? (
    <Image
      source={{ uri }}
      style={[
        styles.image,
        { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
      ]}
      contentFit="cover"
      cachePolicy="memory-disk"
      transition={200}
      accessibilityLabel={`${name}'s avatar`}
    />
  ) : (
    <View
      style={[
        styles.placeholder,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: colors.bgTertiary,
        },
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            color: colors.primary,
            fontSize: avatarSize * 0.35,
          },
        ]}
      >
        {initials}
      </Text>
    </View>
  );

  if (showRing) {
    return (
      <View style={[styles.container, style]}>
        <LinearGradient
          colors={ringColor}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.ring,
            { width: ringSize, height: ringSize, borderRadius: ringSize / 2 },
          ]}
        >
          <View
            style={[
              styles.ringInner,
              {
                backgroundColor: colors.bgPrimary,
                borderRadius: (avatarSize + 2) / 2,
                width: avatarSize + 2,
                height: avatarSize + 2,
              },
            ]}
          >
            {avatar}
          </View>
        </LinearGradient>
        {showOnlineStatus && (
          <View
            style={[
              styles.onlineIndicator,
              {
                backgroundColor: isOnline ? '#00E676' : colors.textMuted,
                borderColor: colors.bgPrimary,
              },
            ]}
          />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {avatar}
      {showOnlineStatus && (
        <View
          style={[
            styles.onlineIndicator,
            {
              backgroundColor: isOnline ? '#00E676' : colors.textMuted,
              borderColor: colors.bgPrimary,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    overflow: 'hidden',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  ringInner: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
});
