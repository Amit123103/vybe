import { Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';

export const fontFamilies = {
  clashBold: isIOS ? 'ClashDisplay-Bold' : 'ClashDisplay-Bold',
  clashSemiBold: isIOS ? 'ClashDisplay-Semibold' : 'ClashDisplay-Semibold',
  satoshiRegular: isIOS ? 'Satoshi-Regular' : 'Satoshi-Regular',
  satoshiMedium: isIOS ? 'Satoshi-Medium' : 'Satoshi-Medium',
  satoshiBold: isIOS ? 'Satoshi-Bold' : 'Satoshi-Bold',
  // Fallback system fonts
  systemBold: isIOS ? 'System' : 'sans-serif',
  systemRegular: isIOS ? 'System' : 'sans-serif',
};

export const typography = {
  displayXL: {
    fontFamily: fontFamilies.clashBold,
    fontSize: 40,
    lineHeight: 48,
  },
  displayL: {
    fontFamily: fontFamilies.clashBold,
    fontSize: 32,
    lineHeight: 40,
  },
  h1: {
    fontFamily: fontFamilies.clashSemiBold,
    fontSize: 28,
    lineHeight: 36,
  },
  h2: {
    fontFamily: fontFamilies.clashSemiBold,
    fontSize: 22,
    lineHeight: 30,
  },
  h3: {
    fontFamily: fontFamilies.clashSemiBold,
    fontSize: 18,
    lineHeight: 26,
  },
  body1: {
    fontFamily: fontFamilies.satoshiRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontFamily: fontFamilies.satoshiRegular,
    fontSize: 14,
    lineHeight: 22,
  },
  bodyMedium: {
    fontFamily: fontFamilies.satoshiMedium,
    fontSize: 14,
    lineHeight: 22,
  },
  label: {
    fontFamily: fontFamilies.satoshiBold,
    fontSize: 13,
    lineHeight: 18,
  },
  caption: {
    fontFamily: fontFamilies.satoshiRegular,
    fontSize: 12,
    lineHeight: 16,
  },
  micro: {
    fontFamily: fontFamilies.satoshiRegular,
    fontSize: 10,
    lineHeight: 14,
  },
};
