import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { Skeleton } from './Skeleton';

export function WordDetailSkeleton() {
  const { theme } = useTheme();

  return (
    <View style={styles.container} accessibilityLabel="Carregando palavra">
      <View
        style={[
          styles.wordCard,
          { backgroundColor: theme.colors.primarySoft },
        ]}>
        <Skeleton width="48%" height={34} borderRadius={8} />
        <Skeleton
          width="28%"
          height={18}
          borderRadius={6}
          style={styles.phonetic}
        />
      </View>

      <View style={styles.audioRow}>
        <Skeleton width={36} height={36} borderRadius={18} />
        <View style={styles.audioTrack}>
          <Skeleton height={4} borderRadius={2} />
        </View>
      </View>

      <View style={styles.meanings}>
        <Skeleton width="36%" height={22} borderRadius={6} />
        <Skeleton height={15} style={styles.line} />
        <Skeleton width="92%" height={15} style={styles.line} />
        <Skeleton width="86%" height={15} style={styles.line} />
        <Skeleton width="78%" height={15} style={styles.line} />
        <Skeleton width="90%" height={15} style={styles.lineSpaced} />
        <Skeleton width="84%" height={15} style={styles.line} />
        <Skeleton width="70%" height={15} style={styles.line} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wordCard: {
    borderRadius: 8,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  phonetic: {
    marginTop: 12,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  audioTrack: {
    flex: 1,
    marginLeft: 12,
  },
  meanings: {
    marginTop: 28,
  },
  line: {
    marginTop: 12,
  },
  lineSpaced: {
    marginTop: 24,
  },
});
