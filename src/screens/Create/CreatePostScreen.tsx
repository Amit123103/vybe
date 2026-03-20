import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../components/layout/Screen';
import { AppHeader } from '../../components/layout/AppHeader';
import { VybeButton } from '../../components/common/VybeButton';
import { VybeChip } from '../../components/common/VybeChip';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { useCreatePost } from '../../hooks/usePost';
import { useDraftStore } from '../../store/draftStore';
import { pickImage, pickVideo, pickMultipleImages } from '../../utils/imageHelpers';
import { extractHashtags } from '../../utils/formatters';
import { AUDIENCE_OPTIONS } from '../../utils/constants';
import { POST_TEXT_BACKGROUNDS } from '../../utils/constants';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const CreatePostScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { successNotification } = useHaptics();
  const createPost = useCreatePost();
  const { saveDraft } = useDraftStore();

  const [postType, setPostType] = useState<'photo' | 'video' | 'text'>('photo');
  const [mediaUris, setMediaUris] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [audience, setAudience] = useState<'public' | 'friends' | 'private'>('public');
  const [textBgIndex, setTextBgIndex] = useState(0);

  const handlePickPhoto = async () => {
    const image = await pickImage();
    if (image) {
      setMediaUris([image.uri]);
      setPostType('photo');
    }
  };

  const handlePickMultiple = async () => {
    const images = await pickMultipleImages();
    if (images.length > 0) {
      setMediaUris(images.map((i) => i.uri));
      setPostType('photo');
    }
  };

  const handlePickVideo = async () => {
    const video = await pickVideo();
    if (video) {
      setMediaUris([video.uri]);
      setPostType('video');
    }
  };

  const handlePost = async () => {
    const hashtags = extractHashtags(caption);
    try {
      await createPost.mutateAsync({
        mediaType: postType === 'photo' ? 'image' : postType === 'video' ? 'video' : 'text',
        mediaUrls: postType === 'text' ? [caption] : mediaUris,
        caption,
        hashtags,
        audience,
      });
      successNotification();
      navigation.goBack();
    } catch {
      // Error handled
    }
  };

  const handleSaveDraft = () => {
    saveDraft({
      caption,
      mediaUris,
      mediaType: postType === 'photo' ? 'image' : postType === 'video' ? 'video' : 'text',
      hashtags: extractHashtags(caption),
      audience,
      savedAt: new Date().toISOString(),
    });
    navigation.goBack();
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <AppHeader
        title="Create Post"
        leftIcon={<Text style={{ color: colors.textSecondary, fontSize: 16 }}>Cancel</Text>}
        onLeftPress={() => navigation.goBack()}
        rightIcon={<Text style={{ color: colors.textMuted, fontSize: 14 }}>Save Draft</Text>}
        onRightPress={handleSaveDraft}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Post Type Tabs */}
          <View style={styles.typeTabs}>
            {(['photo', 'video', 'text'] as const).map((type) => (
              <VybeChip
                key={type}
                label={type === 'photo' ? '📷 Photo' : type === 'video' ? '🎥 Video' : '✍️ Text'}
                selected={postType === type}
                onPress={() => setPostType(type)}
              />
            ))}
          </View>

          {/* Media Picker */}
          {postType !== 'text' && mediaUris.length === 0 && (
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={[styles.pickerButton, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}
                onPress={postType === 'video' ? handlePickVideo : handlePickPhoto}
              >
                <Text style={styles.pickerEmoji}>{postType === 'video' ? '🎬' : '🖼️'}</Text>
                <Text style={[styles.pickerText, { color: colors.textSecondary }]}>
                  {postType === 'video' ? 'Choose a video' : 'Choose photos'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cameraButton, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}
                onPress={() => navigation.navigate('Camera' as never)}
              >
                <Text style={styles.pickerEmoji}>📸</Text>
                <Text style={[styles.pickerText, { color: colors.textSecondary }]}>Camera</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Text Background Picker */}
          {postType === 'text' && (
            <View style={styles.textBgPicker}>
              {POST_TEXT_BACKGROUNDS.map((bg, index) => (
                <TouchableOpacity
                  key={bg.id}
                  onPress={() => setTextBgIndex(index)}
                  style={[
                    styles.textBgOption,
                    index === textBgIndex && { borderColor: colors.primary, borderWidth: 2 },
                  ]}
                >
                  <LinearGradient
                    colors={bg.colors as unknown as string[]}
                    style={styles.textBgGradient}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Caption */}
          <View style={styles.captionContainer}>
            <TextInput
              style={[
                styles.captionInput,
                { color: colors.textPrimary, backgroundColor: colors.bgTertiary },
              ]}
              value={caption}
              onChangeText={setCaption}
              placeholder="Write a caption..."
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={2200}
              textAlignVertical="top"
            />
          </View>

          {/* Audience */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Audience</Text>
            <View style={styles.audienceOptions}>
              {AUDIENCE_OPTIONS.map((opt) => (
                <VybeChip
                  key={opt.value}
                  label={`${opt.icon} ${opt.label}`}
                  selected={audience === opt.value}
                  onPress={() => setAudience(opt.value)}
                />
              ))}
            </View>
          </View>

          {/* Post Button */}
          <VybeButton
            title="Share Post"
            onPress={handlePost}
            loading={createPost.isPending}
            disabled={(postType !== 'text' && mediaUris.length === 0) || !caption.trim()}
            fullWidth
            style={styles.postButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  typeTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  pickerButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  cameraButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  pickerEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  pickerText: {
    fontSize: typography.caption.fontSize,
    textAlign: 'center',
  },
  textBgPicker: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  textBgOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  textBgGradient: {
    width: '100%',
    height: '100%',
  },
  captionContainer: {
    marginBottom: spacing.md,
  },
  captionInput: {
    borderRadius: radius.lg,
    padding: spacing.md,
    minHeight: 120,
    fontSize: typography.body1.fontSize,
    fontFamily: typography.body1.fontFamily,
    lineHeight: 24,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.label.fontSize,
    fontFamily: typography.label.fontFamily,
    marginBottom: spacing.sm,
  },
  audienceOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  postButton: {
    marginTop: spacing.md,
  },
});
