import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MenuScreen } from '@/features/menu';
import { WordDetailScreen } from '@/features/wordDetail';
import { WordListScreen } from '@/features/words';

import type { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WordList" component={WordListScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen
        name="WordDetail"
        component={WordDetailScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
