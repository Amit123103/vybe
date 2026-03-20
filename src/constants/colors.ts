export const colors = {
  // Brand
  primary: '#FF3CAC',
  primaryDark: '#C4006E',
  secondary: '#784BA0',
  accent: '#2B86C5',
  gradient: ['#FF3CAC', '#784BA0', '#2B86C5'] as const,

  // Backgrounds (Dark-first)
  bgPrimary: '#0A0A0F',
  bgSecondary: '#12121A',
  bgTertiary: '#1C1C28',
  bgGlass: 'rgba(255,255,255,0.06)',

  // Text
  textPrimary: '#F5F5FF',
  textSecondary: '#9999BB',
  textMuted: '#555577',
  textInverse: '#0A0A0F',

  // Semantic
  success: '#00E676',
  warning: '#FFD740',
  error: '#FF5252',
  info: '#40C4FF',

  // UI
  border: 'rgba(255,255,255,0.08)',
  divider: 'rgba(255,255,255,0.06)',
  overlay: 'rgba(0,0,0,0.6)',

  // Light Mode Overrides
  light: {
    bgPrimary: '#FAFAFA',
    bgSecondary: '#FFFFFF',
    bgTertiary: '#F0F0F5',
    bgGlass: 'rgba(0,0,0,0.04)',
    textPrimary: '#0A0A0F',
    textSecondary: '#555577',
    textMuted: '#9999BB',
    textInverse: '#F5F5FF',
    border: 'rgba(0,0,0,0.08)',
    divider: 'rgba(0,0,0,0.06)',
    overlay: 'rgba(0,0,0,0.4)',
  },
};

export type ColorScheme = 'dark' | 'light';

export const getColors = (scheme: ColorScheme) => {
  if (scheme === 'light') {
    return {
      ...colors,
      bgPrimary: colors.light.bgPrimary,
      bgSecondary: colors.light.bgSecondary,
      bgTertiary: colors.light.bgTertiary,
      bgGlass: colors.light.bgGlass,
      textPrimary: colors.light.textPrimary,
      textSecondary: colors.light.textSecondary,
      textMuted: colors.light.textMuted,
      textInverse: colors.light.textInverse,
      border: colors.light.border,
      divider: colors.light.divider,
      overlay: colors.light.overlay,
    };
  }
  return colors;
};
