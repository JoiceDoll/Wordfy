import React from 'react';
import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

const logoMark = require('@/assets/logo-mark.png');

type Props = {
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
};

const ICON_SIZE = {
  sm: 28,
  md: 40,
  lg: 72,
} as const;

const TITLE_SIZE = {
  sm: 20,
  md: 28,
  lg: 36,
} as const;

export function BrandMark({ size = 'md', style }: Props) {
  const { theme } = useTheme();
  const icon = ICON_SIZE[size];

  return (
    <View style={[styles.row, style]}>
      <Image
        source={logoMark}
        style={{ width: icon, height: icon, borderRadius: icon * 0.22 }}
        accessibilityLabel="Logo Wordfy"
      />
      <Text
        style={[
          styles.title,
          { color: theme.colors.primary, fontSize: TITLE_SIZE[size] },
        ]}>
        Wordfy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.4,
  },
});
