// src/theme/index.js

export const colors = {
  // Primary palette
  primary: '#1A73E8',
  primaryDark: '#1557B0',
  primaryLight: '#E8F0FE',

  // Accent
  accent: '#34A853',
  accentLight: '#E6F4EA',

  // Status colors
  warning: '#FBBC04',
  warningLight: '#FEF7E0',
  error: '#EA4335',
  errorLight: '#FCE8E6',

  // Neutrals
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E8EAED',
  divider: '#F1F3F4',

  // Text
  textPrimary: '#202124',
  textSecondary: '#5F6368',
  textTertiary: '#9AA0A6',
  textOnPrimary: '#FFFFFF',

  // Star rating
  star: '#FBBC04',
  starEmpty: '#E8EAED',

  // Insight card colors
  insightColors: [
    { bg: '#E8F0FE', icon: '#1A73E8', text: '#1557B0' },
    { bg: '#E6F4EA', icon: '#34A853', text: '#1E8E3E' },
    { bg: '#FEF7E0', icon: '#FBBC04', text: '#F29900' },
    { bg: '#FCE8E6', icon: '#EA4335', text: '#C5221F' },
    { bg: '#F3E8FD', icon: '#A142F4', text: '#7B1FA2' },
  ],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' },
  h4: { fontSize: 16, fontWeight: '600' },
  body1: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  body2: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  button: { fontSize: 15, fontWeight: '600', letterSpacing: 0.3 },
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};
