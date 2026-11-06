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

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { register } = useAuthViewModel();
  const [name, setName] = useState('');
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
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Criar conta
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Seus favoritos e histórico ficam associados ao seu usuário no SQLite.
        </Text>

        <AppTextInput
          label="Nome"
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          autoCapitalize="words"
        />
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
          placeholder="mínimo 6 caracteres"
          secureTextEntry
        />

        {register.error ? <ErrorBanner message={register.error} /> : null}

        <AppButton
          label="Cadastrar"
          variant="primary"
          loading={register.loading}
          onPress={() => register.run(email, password, name)}
        />

        <Pressable style={styles.linkWrap} onPress={() => navigation.goBack()}>
          <Text style={{ color: theme.colors.primary }}>Já tenho conta</Text>
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
    paddingTop: 64,
    paddingBottom: 32,
  },
  brand: {
    marginBottom: 28,
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
