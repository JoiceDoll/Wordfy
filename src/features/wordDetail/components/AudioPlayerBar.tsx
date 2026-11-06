import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

type AudioPlayerBarProps = {
  disabled?: boolean;
  isPlaying?: boolean;
  /** Progresso de 0 a 1. Idle / stop = 0; fim do áudio = 1. */
  progress?: number;
  onPlay: () => void;
  onStop: () => void;
};

export function AudioPlayerBar({
  disabled,
  isPlaying,
  progress = 0,
  onPlay,
  onStop,
}: AudioPlayerBarProps) {
  const { theme } = useTheme();
  const widthPercent = `${Math.round(clamp01(progress) * 100)}%`;

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={isPlaying ? onStop : onPlay}
        style={[
          styles.playButton,
          {
            borderColor: theme.colors.border,
            opacity: disabled ? 0.4 : 1,
          },
        ]}>
        <Text style={[styles.playIcon, { color: theme.colors.text }]}>
          {isPlaying ? '■' : '▶'}
        </Text>
      </Pressable>
      <View
        style={[
          styles.track,
          { backgroundColor: theme.colors.progressTrack },
        ]}>
        <View
          style={[
            styles.progress,
            {
              backgroundColor: theme.colors.progress,
              width: widthPercent,
            },
          ]}
        />
      </View>
    </View>
  );
}

function clamp01(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.min(1, Math.max(0, value));
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  playButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playIcon: {
    fontSize: 14,
  },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});
