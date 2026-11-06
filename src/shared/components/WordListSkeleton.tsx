import React, { useMemo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { Skeleton } from './Skeleton';

const COLUMNS = 3;

type WordListSkeletonProps = {
  rows?: number;
  style?: StyleProp<ViewStyle>;
};

export function WordListSkeleton({
  rows = 8,
  style,
}: WordListSkeletonProps) {
  const { theme } = useTheme();
  const cells = useMemo(
    () => Array.from({ length: rows * COLUMNS }, (_, index) => index),
    [rows],
  );

  return (
    <View
      style={[styles.container, style]}
      accessibilityLabel="Carregando palavras">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {cells
            .slice(rowIndex * COLUMNS, rowIndex * COLUMNS + COLUMNS)
            .map(cellIndex => (
              <View
                key={cellIndex}
                style={[
                  styles.cell,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surface,
                    marginHorizontal: theme.spacing.xs,
                    marginBottom: theme.spacing.sm,
                  },
                ]}>
                <Skeleton width="62%" height={14} borderRadius={4} />
              </View>
            ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    minHeight: 72,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
});
