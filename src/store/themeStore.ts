import { create } from 'zustand';
import { ColorScheme, getColors } from '../constants/colors';
import { mmkvStorage, STORAGE_KEYS } from '../services/storageService';
import { Appearance } from 'react-native';

interface ThemeState {
  scheme: ColorScheme;
  colors: ReturnType<typeof getColors>;
  fontScale: number;

  setScheme: (scheme: ColorScheme) => void;
  toggleScheme: () => void;
  setFontScale: (scale: number) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  scheme: 'dark',
  colors: getColors('dark'),
  fontScale: 1,

  setScheme: (scheme: ColorScheme) => {
    mmkvStorage.setString(STORAGE_KEYS.THEME, scheme);
    set({ scheme, colors: getColors(scheme) });
  },

  toggleScheme: () => {
    const newScheme = get().scheme === 'dark' ? 'light' : 'dark';
    get().setScheme(newScheme);
  },

  setFontScale: (scale: number) => {
    mmkvStorage.setString(STORAGE_KEYS.FONT_SIZE_SCALE, scale.toString());
    set({ fontScale: scale });
  },

  initializeTheme: () => {
    const savedTheme = mmkvStorage.getString(STORAGE_KEYS.THEME) as ColorScheme | undefined;
    const savedFontScale = mmkvStorage.getString(STORAGE_KEYS.FONT_SIZE_SCALE);

    const scheme: ColorScheme = savedTheme || (Appearance.getColorScheme() as ColorScheme) || 'dark';
    const fontScale = savedFontScale ? parseFloat(savedFontScale) : 1;

    set({
      scheme,
      colors: getColors(scheme),
      fontScale,
    });
  },
}));
