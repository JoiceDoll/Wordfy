import React, { useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthViewModel } from '@/features/auth';
import type { MainStackParamList } from '@/navigation';
import { BrandMark } from '@/shared';
import { setActiveTab, useAppDispatch } from '@/store';
import { useTheme } from '@/theme';

type Props = NativeStackScreenProps<MainStackParamList, 'Menu'>;

export function MenuScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { theme, mode, setMode } = useTheme();
  const { logout, session } = useAuthViewModel();

  const openTab = useCallback(
    (tab: 'favorites' | 'history') => {
      dispatch(setActiveTab(tab));
      navigation.goBack();
    },
    [dispatch, navigation],
  );

  const fullName = session?.name?.trim() ?? '';
  const firstName =
    fullName.split(/\s+/)[0] ||
    session?.email?.split('@')[0] ||
    'Usuário';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 16,
        },
      ]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fechar menu"
        onPress={() => navigation.goBack()}
        style={styles.closeButton}
        hitSlop={12}>
        <Text style={[styles.closeLabel, { color: theme.colors.text }]}>✕</Text>
      </Pressable>

      <BrandMark size="md" style={styles.brand} />
      <Text style={[styles.greeting, { color: theme.colors.text }]}>
        Olá, {firstName}
      </Text>

      <View
        style={[
          styles.row,
          styles.themeRow,
          { borderBottomColor: theme.colors.border },
        ]}>
        <Text style={[styles.rowLabel, { color: theme.colors.text }]}>
          Tema
        </Text>
        <View style={styles.themeControl}>
          <Text
            style={[styles.themeHint, { color: theme.colors.textSecondary }]}>
            {mode === 'dark' ? 'Dark' : 'Light'}
          </Text>
          <Switch
            value={mode === 'dark'}
            onValueChange={value => setMode(value ? 'dark' : 'light')}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primarySoft,
            }}
            thumbColor={mode === 'dark' ? theme.colors.primary : '#F8FAFC'}
            accessibilityLabel="Alternar tema escuro"
          />
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => openTab('favorites')}
        style={[styles.row, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.rowLabel, { color: theme.colors.text }]}>
          Favoritos
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={() => openTab('history')}
        style={[styles.row, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.rowLabel, { color: theme.colors.text }]}>
          Histórico
        </Text>
      </Pressable>

      <View style={styles.spacer} />

      <Pressable
        accessibilityRole="button"
        onPress={() => logout.run()}
        disabled={logout.loading}
        style={styles.logoutButton}>
        <Text style={[styles.logoutLabel, { color: theme.colors.danger }]}>
          {logout.loading ? 'Saindo…' : 'Sair'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  closeLabel: {
    fontSize: 22,
    fontWeight: '600',
  },
  brand: {
    marginBottom: 12,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  themeRow: {
    marginBottom: 4,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
  },
  themeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeHint: {
    fontSize: 13,
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
});
