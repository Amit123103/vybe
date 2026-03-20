import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation.types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { CreatePostScreen } from '../screens/Create/CreatePostScreen';
import { CameraScreen } from '../screens/Create/CameraScreen';
import { useAuth } from '../hooks/useAuth';
import { VybeLoader } from '../components/common/VybeLoader';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <VybeLoader fullScreen text="Loading Vybe..." />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.ModalPresentationIOS,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen
            name="CreatePost"
            component={CreatePostScreen}
            options={{
              ...TransitionPresets.ModalSlideFromBottomIOS,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};
