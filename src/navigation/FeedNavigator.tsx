import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { FeedStackParamList } from '../types/navigation.types';
import { FeedScreen } from '../screens/Feed/FeedScreen';
import { PostDetailScreen } from '../screens/Feed/PostDetailScreen';
import { InboxScreen } from '../screens/Messages/InboxScreen';
import { ChatScreen } from '../screens/Messages/ChatScreen';
import { useTheme } from '../hooks/useTheme';

const Stack = createStackNavigator<FeedStackParamList>();

export const FeedNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.bgPrimary },
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="Inbox" component={InboxScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};
