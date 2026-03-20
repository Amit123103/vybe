import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { ProfileStackParamList } from '../types/navigation.types';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { EditProfileScreen } from '../screens/Profile/EditProfileScreen';
import { FollowersScreen } from '../screens/Profile/FollowersScreen';
import { FollowingScreen } from '../screens/Profile/FollowingScreen';
import { SettingsScreen } from '../screens/Profile/SettingsScreen';
import { PostDetailScreen } from '../screens/Feed/PostDetailScreen';
import { useTheme } from '../hooks/useTheme';

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.bgPrimary },
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Followers" component={FollowersScreen} />
      <Stack.Screen name="Following" component={FollowingScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    </Stack.Navigator>
  );
};
