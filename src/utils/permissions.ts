import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { Camera } from 'expo-camera';
import { Alert, Linking, Platform } from 'react-native';

export const requestCameraPermission = async (): Promise<boolean> => {
  const { status } = await Camera.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    showPermissionAlert('Camera');
    return false;
  }
  return true;
};

export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    showPermissionAlert('Photo Library');
    return false;
  }
  return true;
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Vybe Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF3CAC',
    });
  }

  return true;
};

const showPermissionAlert = (permissionName: string): void => {
  Alert.alert(
    `${permissionName} Access Required`,
    `Vybe needs access to your ${permissionName.toLowerCase()} to continue. Please enable it in Settings.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ],
  );
};
