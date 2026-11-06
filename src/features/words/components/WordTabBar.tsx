import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { WordListTab } from '@/domain';
import { useTheme } from '@/theme';

const TABS: { key: WordListTab; label: string }[] = [
  { key: 'list', label: 'Word list' },
  { key: 'history', label: 'Histórico' },
  { key: 'favorites', label: 'Favoritos' },
];

type WordTabBarProps = {
  activeTab: WordListTab;
  onChange: (tab: WordListTab) => void;
};

export function WordTabBar({ activeTab, onChange }: WordTabBarProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
      ]}>
      {TABS.map((tab, index) => {
        const active = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.key)}
            style={[
              styles.tab,
              index < TABS.length - 1 && {
                borderRightWidth: StyleSheet.hairlineWidth,
                borderRightColor: theme.colors.border,
              },
              {
                backgroundColor: active
                  ? theme.colors.tabActive
                  : theme.colors.tabInactive,
              },
            ]}>
            <Text
              style={[
                styles.label,
                {
                  color: theme.colors.text,
                  fontWeight: active ? '700' : '500',
                },
              ]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
  },
});
