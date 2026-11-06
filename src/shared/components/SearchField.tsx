import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '@/theme';

type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

function SearchIcon({ color }: { color: string }) {
  return (
    <View style={styles.icon}>
      <View style={[styles.iconLens, { borderColor: color }]} />
      <View style={[styles.iconHandle, { backgroundColor: color }]} />
    </View>
  );
}

export function SearchField({
  value,
  onChangeText,
  placeholder = 'Pesquisar palavra',
}: SearchFieldProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.field,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          },
        ]}>
        <View style={styles.iconSlot}>
          <SearchIcon color={theme.colors.primary} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Pesquisar palavra"
          style={[styles.input, { color: theme.colors.text }]}
        />
        {value.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Limpar pesquisa"
            hitSlop={8}
            onPress={() => onChangeText('')}
            style={styles.clearButton}>
            <Text style={[styles.clearText, { color: theme.colors.textSecondary }]}>
              limpar
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  field: {
    borderWidth: 1,
    borderRadius: 24,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
  },
  iconSlot: {
    marginRight: 4,
  },
  icon: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLens: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  iconHandle: {
    position: 'absolute',
    width: 2.5,
    height: 8,
    borderRadius: 2,
    right: 2,
    bottom: 1,
    transform: [{ rotate: '-45deg' }],
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 16,
    fontSize: 16,
  },
  clearButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
