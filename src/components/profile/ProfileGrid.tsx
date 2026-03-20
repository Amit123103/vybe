import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { Post } from '../../types/post.types';
import { spacing } from '../../constants/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 2;
const GRID_ITEM_SIZE = (SCREEN_WIDTH - GRID_GAP * 2) / 3;

interface ProfileGridProps {
  posts: Post[];
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({ posts }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {posts.map((post) => (
        <TouchableOpacity
          key={post.id}
          onPress={() => navigation.navigate('PostDetail' as never, { postId: post.id } as never)}
          activeOpacity={0.8}
          accessibilityLabel="View post"
        >
          <Image
            source={{ uri: post.mediaUrls[0] || post.thumbnailUrl }}
            style={[styles.gridItem, { backgroundColor: colors.bgTertiary }]}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
  },
});
