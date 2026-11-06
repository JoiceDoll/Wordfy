import React, { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/theme';

type WordCellProps = {
  word: string;
  onPress: (word: string) => void;
};

function WordCellComponent({ word, onPress }: WordCellProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(word)}
      style={({ pressed }) => [
        styles.cell,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          opacity: pressed ? 0.75 : 1,
          marginHorizontal: theme.spacing.xs,
          marginBottom: theme.spacing.sm,
        },
      ]}>
      <Text
        numberOfLines={1}
        style={[styles.label, { color: theme.colors.text }]}>
        {word}
      </Text>
    </Pressable>
  );
}

export const WordCell = memo(WordCellComponent);

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    minHeight: 72,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
