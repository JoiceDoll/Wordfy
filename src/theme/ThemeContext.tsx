import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import type { IThemeStorage, ThemeMode } from '@/domain';
import { darkTheme, lightTheme, type AppTheme } from './tokens';

type ThemeContextValue = {
  theme: AppTheme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: React.ReactNode;
  storage: IThemeStorage | null;
};

function resolveSystemMode(system: string | null | undefined): ThemeMode {
  return system === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children, storage }: ThemeProviderProps) {
  const system = useColorScheme();
  // null = seguir o tema do dispositivo até o usuário escolher no menu
  const [preference, setPreference] = useState<ThemeMode | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      if (!storage) {
        return;
      }
      const saved = await storage.getTheme();
      if (!cancelled && saved) {
        setPreference(saved);
      }
    }
    hydrate().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [storage]);

  const mode: ThemeMode = preference ?? resolveSystemMode(system);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setPreference(next);
      storage?.setTheme(next).catch(() => undefined);
    },
    [storage],
  );

  const toggleTheme = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: mode === 'dark' ? darkTheme : lightTheme,
      mode,
      toggleTheme,
      setMode,
    }),
    [mode, setMode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
