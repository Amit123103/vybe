import { useThemeStore } from '../store/themeStore';

export const useTheme = () => {
  const scheme = useThemeStore((s) => s.scheme);
  const colors = useThemeStore((s) => s.colors);
  const fontScale = useThemeStore((s) => s.fontScale);
  const setScheme = useThemeStore((s) => s.setScheme);
  const toggleScheme = useThemeStore((s) => s.toggleScheme);
  const setFontScale = useThemeStore((s) => s.setFontScale);
  const isDark = scheme === 'dark';

  return {
    scheme,
    colors,
    fontScale,
    isDark,
    setScheme,
    toggleScheme,
    setFontScale,
  };
};
