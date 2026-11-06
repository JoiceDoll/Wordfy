import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

type ToastProps = {
  message: string | null;
  onHide: () => void;
  durationMs?: number;
};

export function Toast({ message, onHide, durationMs = 2200 }: ToastProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 16) + 84;

  useEffect(() => {
    if (!message) {
      return;
    }
    const timer = setTimeout(onHide, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, message, onHide]);

  if (!message) {
    return null;
  }

  return (
    <View pointerEvents="none" style={[styles.wrap, { bottom }]}>
      <View
        style={[
          styles.toast,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}>
        <Text style={[styles.text, { color: theme.colors.text }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 20,
  },
  toast: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
