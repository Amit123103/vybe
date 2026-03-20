import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation.types';
import { FeedNavigator } from './FeedNavigator';
import { ExploreScreen } from '../screens/Explore/ExploreScreen';
import { NotificationsScreen } from '../screens/Notifications/NotificationsScreen';
import { ProfileNavigator } from './ProfileNavigator';
import { TabBar } from '../components/layout/TabBar';
import { View } from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Placeholder for CreateTab — actual creation uses a modal
const CreatePlaceholder: React.FC = () => <View />;

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="FeedTab" component={FeedNavigator} />
      <Tab.Screen name="ExploreTab" component={ExploreScreen} />
      <Tab.Screen
        name="CreateTab"
        component={CreatePlaceholder}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.getParent()?.navigate('CreatePost');
          },
        })}
      />
      <Tab.Screen name="NotificationsTab" component={NotificationsScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};
