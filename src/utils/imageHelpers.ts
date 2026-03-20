import * as ImagePicker from 'expo-image-picker';
import { MEDIA_CONFIG } from '../constants/config';

export interface PickedMedia {
  uri: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
  duration?: number;
  fileSize?: number;
}

export const pickImage = async (
  options?: Partial<ImagePicker.ImagePickerOptions>,
): Promise<PickedMedia | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: MEDIA_CONFIG.imageQuality,
    ...options,
  });

  if (result.canceled || !result.assets[0]) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    type: 'image',
    width: asset.width,
    height: asset.height,
    fileSize: asset.fileSize,
  };
};

export const pickVideo = async (): Promise<PickedMedia | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['videos'],
    allowsEditing: true,
    videoMaxDuration: MEDIA_CONFIG.maxVideoDuration,
  });

  if (result.canceled || !result.assets[0]) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    type: 'video',
    width: asset.width,
    height: asset.height,
    duration: asset.duration || 0,
    fileSize: asset.fileSize,
  };
};

export const pickMultipleImages = async (
  selectionLimit: number = 10,
): Promise<PickedMedia[]> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit,
    quality: MEDIA_CONFIG.imageQuality,
  });

  if (result.canceled) return [];

  return result.assets.map((asset) => ({
    uri: asset.uri,
    type: 'image' as const,
    width: asset.width,
    height: asset.height,
    fileSize: asset.fileSize,
  }));
};

export const getImageAspectRatio = (width: number, height: number): number => {
  if (!width || !height) return 1;
  return width / height;
};

export const validateMediaSize = (
  fileSize: number | undefined,
  type: 'image' | 'video',
): boolean => {
  if (!fileSize) return true;
  const maxSize = type === 'image' ? MEDIA_CONFIG.maxImageSize : MEDIA_CONFIG.maxVideoSize;
  return fileSize <= maxSize;
};
