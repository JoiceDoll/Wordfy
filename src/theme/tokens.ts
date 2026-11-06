import type { ThemeMode } from '@/domain';

export type AppTheme = {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    primarySoft: string;
    tabActive: string;
    tabInactive: string;
    danger: string;
    progress: string;
    progressTrack: string;
    button: string;
    buttonText: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    title: number;
    body: number;
    caption: number;
  };
  radius: {
    sm: number;
    md: number;
  };
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

const typography = {
  title: 22,
  body: 16,
  caption: 13,
} as const;

const radius = {
  sm: 6,
  md: 10,
} as const;

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: '#E5E7EB',
    primary: '#2563EB',
    primarySoft: '#DBEAFE',
    tabActive: '#E5E7EB',
    tabInactive: '#FFFFFF',
    danger: '#B00020',
    progress: '#2563EB',
    progressTrack: '#E5E7EB',
    button: '#F3F4F6',
    buttonText: '#1E3A8A',
  },
  spacing,
  typography,
  radius,
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    background: '#0B1220',
    surface: '#111827',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#1E3A5F',
    primary: '#60A5FA',
    primarySoft: '#1E3A5F',
    tabActive: '#1E3A5F',
    tabInactive: '#111827',
    danger: '#FF6B7A',
    progress: '#60A5FA',
    progressTrack: '#334155',
    button: '#1E3A5F',
    buttonText: '#F8FAFC',
  },
  spacing,
  typography,
  radius,
};
