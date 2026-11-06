import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

type ErrorBannerProps = {
  message: string;
};

export function ErrorBanner({ message }: ErrorBannerProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.mode === 'dark' ? '#3A1F24' : '#FDECEA',
          borderColor: theme.colors.danger,
        },
      ]}>
      <Text style={{ color: theme.colors.danger }}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
});
