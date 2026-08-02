// src/styles/designSystem.js

export const colors = {
  // Surface Colors
  surface: '#FFF8F6',
  'surface-dim': '#FBD1C4',
  'surface-bright': '#FFF8F6',
  'surface-container-lowest': '#FFFFFF',
  'surface-container-low': '#FFF1ED',
  'surface-container': '#FFE9E3',
  'surface-container-high': '#FFE2DA',
  'surface-container-highest': '#FFDBD0',
  
  // On-Surface Colors
  'on-surface': '#2C160E',
  'on-surface-variant': '#40493D',
  
  // Inverse Surface
  'inverse-surface': '#442A22',
  'inverse-on-surface': '#FFEDE8',
  
  // Outline
  outline: '#707A6C',
  'outline-variant': '#BFCABA',
  
  // Primary Colors
  primary: '#0D631B',
  'on-primary': '#FFFFFF',
  'primary-container': '#2E7D32',
  'on-primary-container': '#CBFFC2',
  'inverse-primary': '#88D982',
  
  // Secondary Colors
  secondary: '#7A5649',
  'on-secondary': '#FFFFFF',
  'secondary-container': '#FDCDBC',
  'on-secondary-container': '#795548',
  
  // Tertiary Colors
  tertiary: '#774C00',
  'on-tertiary': '#FFFFFF',
  'tertiary-container': '#986200',
  'on-tertiary-container': '#FFEEDE',
  
  // Error Colors
  error: '#BA1A1A',
  'on-error': '#FFFFFF',
  'error-container': '#FFDAD6',
  'on-error-container': '#93000A',
  
  // Primary Fixed
  'primary-fixed': '#A3F69C',
  'primary-fixed-dim': '#88D982',
  'on-primary-fixed': '#002204',
  'on-primary-fixed-variant': '#005312',
  
  // Secondary Fixed
  'secondary-fixed': '#FFDBCF',
  'secondary-fixed-dim': '#EBBCAC',
  'on-secondary-fixed': '#2E150B',
  'on-secondary-fixed-variant': '#603F33',
  
  // Tertiary Fixed
  'tertiary-fixed': '#FFDDB5',
  'tertiary-fixed-dim': '#FFB957',
  'on-tertiary-fixed': '#2A1800',
  'on-tertiary-fixed-variant': '#643F00',
  
  // Background
  background: '#FFF8F6',
  'on-background': '#2C160E',
  'surface-variant': '#FFDBD0',
  
  // Surface Tint
  'surface-tint': '#1B6D24',
};

export const typography = {
  'display-lg': {
    fontFamily: 'Playfair Display',
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 56,
  },
  'headline-lg': {
    fontFamily: 'Montserrat',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  'headline-md': {
    fontFamily: 'Montserrat',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  'headline-sm': {
    fontFamily: 'Montserrat',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  'body-lg': {
    fontFamily: 'Open Sans',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
  },
  'body-md': {
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  'label-lg': {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  'label-sm': {
    fontFamily: 'Open Sans',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  'headline-lg-mobile': {
    fontFamily: 'Montserrat',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
};

export const spacing = {
  base: 8,
  xs: 4,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  'margin-mobile': 20,
  'gutter-mobile': 16,
};

export const rounded = {
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};