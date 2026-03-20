import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../hooks/useTheme';
import { radius } from '../../constants/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PostMediaProps {
  mediaType: 'image' | 'video' | 'text' | 'carousel';
  mediaUrls: string[];
  onDoubleTap?: () => void;
  textBackground?: string[];
}

export const PostMedia: React.FC<PostMediaProps> = React.memo(
  ({ mediaType, mediaUrls, onDoubleTap, textBackground }) => {
    const { colors } = useTheme();
    const [activeSlide, setActiveSlide] = useState(0);
    let lastTap = 0;

    const handlePress = () => {
      const now = Date.now();
      if (now - lastTap < 300) {
        onDoubleTap?.();
      }
      lastTap = now;
    };

    if (mediaType === 'text') {
      return (
        <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
          <View
            style={[
              styles.textContainer,
              {
                backgroundColor: textBackground ? undefined : colors.bgTertiary,
              },
            ]}
          >
            <Text style={styles.textContent}>{mediaUrls[0] || ''}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (mediaType === 'image' && mediaUrls.length === 1) {
      return (
        <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
          <Image
            source={{ uri: mediaUrls[0] }}
            style={styles.singleImage}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={300}
            accessibilityLabel="Post image"
          />
        </TouchableOpacity>
      );
    }

    if (mediaType === 'carousel' || (mediaType === 'image' && mediaUrls.length > 1)) {
      return (
        <View>
          <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
            <Image
              source={{ uri: mediaUrls[activeSlide] }}
              style={styles.singleImage}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={300}
              accessibilityLabel={`Post image ${activeSlide + 1} of ${mediaUrls.length}`}
            />
          </TouchableOpacity>
          {mediaUrls.length > 1 && (
            <View style={styles.pagination}>
              {mediaUrls.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === activeSlide ? colors.primary : 'rgba(255,255,255,0.5)',
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      );
    }

    if (mediaType === 'video') {
      return (
        <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
          <View style={[styles.videoContainer, { backgroundColor: colors.bgTertiary }]}>
            <Image
              source={{ uri: mediaUrls[0] }}
              style={styles.singleImage}
              contentFit="cover"
              cachePolicy="memory-disk"
              accessibilityLabel="Video thumbnail"
            />
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return null;
  },
);

PostMedia.displayName = 'PostMedia';

const styles = StyleSheet.create({
  singleImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  textContainer: {
    width: SCREEN_WIDTH,
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  textContent: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 34,
  },
  videoContainer: {
    position: 'relative',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
    marginLeft: -30,
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    marginLeft: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
});
