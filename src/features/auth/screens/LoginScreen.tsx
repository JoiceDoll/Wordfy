import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '@/navigation';
import { AppButton, AppTextInput, BrandMark, ErrorBanner } from '@/shared';
import { useTheme } from '@/theme';
import { useAuthViewModel } from '../viewmodels';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { login } = useAuthViewModel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <BrandMark size="md" style={styles.brand} />

        <Text style={[styles.title, { color: theme.colors.text }]}>Entrar</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Acesse sua conta para sincronizar favoritos e histórico offline.
        </Text>

        <AppTextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="voce@email.com"
          keyboardType="email-address"
        />
        <AppTextInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        {login.error ? <ErrorBanner message={login.error} /> : null}

        <AppButton
          label="Entrar"
          variant="primary"
          loading={login.loading}
          onPress={() => login.run(email, password)}
        />

        <Pressable
          style={styles.linkWrap}
          onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: theme.colors.primary }}>
            Criar uma conta
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  brand: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  linkWrap: {
    marginTop: 20,
    alignItems: 'center',
  },
});
