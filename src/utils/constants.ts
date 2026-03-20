export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const POST_TEXT_BACKGROUNDS = [
  { id: '1', colors: ['#FF3CAC', '#784BA0'], label: 'Vybe' },
  { id: '2', colors: ['#00C9FF', '#92FE9D'], label: 'Ocean' },
  { id: '3', colors: ['#FC5C7D', '#6A82FB'], label: 'Sunset' },
  { id: '4', colors: ['#f953c6', '#b91d73'], label: 'Pink' },
  { id: '5', colors: ['#0F2027', '#203A43', '#2C5364'], label: 'Dark' },
  { id: '6', colors: ['#11998e', '#38ef7d'], label: 'Green' },
  { id: '7', colors: ['#ee0979', '#ff6a00'], label: 'Fire' },
] as const;

export const CAMERA_FILTERS = [
  { id: 'none', label: 'Normal', value: null },
  { id: 'bw', label: 'B&W', value: 'grayscale(1)' },
  { id: 'vivid', label: 'Vivid', value: 'saturate(1.5)' },
  { id: 'soft', label: 'Soft', value: 'brightness(1.1) contrast(0.9)' },
  { id: 'neon', label: 'Neon', value: 'saturate(2) contrast(1.3)' },
] as const;

export const AUDIENCE_OPTIONS = [
  { value: 'public' as const, label: 'Public', icon: '🌍', description: 'Visible to everyone' },
  { value: 'friends' as const, label: 'Friends', icon: '👥', description: 'Only people you follow' },
  { value: 'private' as const, label: 'Only Me', icon: '🔒', description: 'Only visible to you' },
] as const;
