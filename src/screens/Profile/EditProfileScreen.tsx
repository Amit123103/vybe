import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/layout/Screen';
import { AppHeader } from '../../components/layout/AppHeader';
import { VybeInput } from '../../components/common/VybeInput';
import { VybeButton } from '../../components/common/VybeButton';
import { VybeAvatar } from '../../components/common/VybeAvatar';
import { useAuth } from '../../hooks/useAuth';
import { useUpdateProfile } from '../../hooks/useProfile';
import { useTheme } from '../../hooks/useTheme';
import { pickImage } from '../../utils/imageHelpers';
import { spacing } from '../../constants/spacing';

export const EditProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);

  const handlePickAvatar = async () => {
    const image = await pickImage({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (image) {
      setAvatar(image.uri);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        displayName,
        bio,
        website,
        avatar: avatar || undefined,
      });
      navigation.goBack();
    } catch {
      // Error handled
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <AppHeader
        title="Edit Profile"
        leftIcon={<Text style={{ color: colors.textPrimary, fontSize: 20 }}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <TouchableOpacity style={styles.avatarContainer} onPress={handlePickAvatar}>
            <VybeAvatar uri={avatar} name={displayName} size="xl" />
            <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
              <Text style={{ color: '#FFFFFF', fontSize: 12 }}>📷</Text>
            </View>
          </TouchableOpacity>

          <VybeInput
            label="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your display name"
            showCharCount
            maxCharCount={50}
          />

          <VybeInput
            label="Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell the world about your vibe..."
            multiline
            numberOfLines={4}
            showCharCount
            maxCharCount={160}
          />

          <VybeInput
            label="Website"
            value={website}
            onChangeText={setWebsite}
            placeholder="https://yourvybe.com"
            keyboardType="url"
            autoCapitalize="none"
          />

          <VybeButton
            title="Save Changes"
            onPress={handleSave}
            loading={updateProfile.isPending}
            fullWidth
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: spacing.lg,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});
