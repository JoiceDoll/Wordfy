import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '@/theme';

const eyeOpen = require('@/assets/eye-open.png');
const eyeOff = require('@/assets/eye-off.png');

type AppTextInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
};

export function AppTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
}: AppTextInputProps) {
  const { theme } = useTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = secureTextEntry;
  const hideText = isPassword && !passwordVisible;

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>
      <View
        style={[
          styles.field,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          },
        ]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry={hideText}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          autoCorrect={false}
          textContentType={isPassword ? 'password' : undefined}
          style={[
            styles.input,
            isPassword && styles.inputWithToggle,
            { color: theme.colors.text },
          ]}
        />
        {isPassword ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              passwordVisible ? 'Ocultar senha' : 'Mostrar senha'
            }
            hitSlop={8}
            onPress={() => setPasswordVisible(current => !current)}
            style={styles.toggle}>
            <Image
              source={passwordVisible ? eyeOpen : eyeOff}
              style={[styles.eyeIcon, { tintColor: theme.colors.textSecondary }]}
              resizeMode="contain"
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  label: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '600',
  },
  field: {
    borderWidth: 1,
    borderRadius: 24,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  inputWithToggle: {
    paddingRight: 8,
  },
  toggle: {
    width: 44,
    height: 44,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexShrink: 0,
  },
  eyeIcon: {
    width: 22,
    height: 22,
  },
});
