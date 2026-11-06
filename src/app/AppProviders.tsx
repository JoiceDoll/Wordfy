import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';

import { getContainer } from '@/di';
import { bootstrapApp } from './bootstrap';
import type { IThemeStorage } from '@/domain';
import { RootNavigator } from '@/navigation';
import { store } from '@/store';
import { ThemeProvider, useTheme } from '@/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function StatusBarBridge() {
  const { theme } = useTheme();
  return (
    <StatusBar
      barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
    />
  );
}

export function AppProviders() {
  const [themeStorage, setThemeStorage] = useState<IThemeStorage | null>(null);

  useEffect(() => {
    bootstrapApp(store.dispatch)
      .then(() => {
        try {
          setThemeStorage(getContainer().themeStorage);
        } catch {
          setThemeStorage(null);
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider storage={themeStorage}>
              <StatusBarBridge />
              <RootNavigator />
            </ThemeProvider>
          </QueryClientProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
