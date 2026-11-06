import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { LoadingView } from '@/shared';
import { useAppSelector } from '@/store';
import { useTheme } from '@/theme';

import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

export function RootNavigator() {
  const { theme } = useTheme();
  const bootstrapped = useAppSelector(state => state.auth.bootstrapped);
  const session = useAppSelector(state => state.auth.session);

  if (!bootstrapped) {
    return <LoadingView />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: theme.mode === 'dark',
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.primary,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '800',
          },
        },
      }}>
      {session ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
