export const THEME_KEYS = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type ThemeMode = typeof THEME_KEYS[keyof typeof THEME_KEYS];

export const SIDEBAR_WIDTH = {
  COLLAPSED: '64px',
  EXPANDED: '240px',
} as const;
