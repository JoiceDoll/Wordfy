import type { ITtsService } from '@/domain';

import { ReactNativeTtsAdapter } from './ReactNativeTtsAdapter';

/**
 * Providers suportados pelo Factory.
 * Para trocar a lib no futuro, adicione um case + adapter aqui —
 * ViewModels e o restante do app continuam falando só com `ITtsService`.
 */
export type TtsProvider = 'react-native-tts';

export type CreateTtsServiceConfig = {
  provider?: TtsProvider;
  defaultLanguage?: string;
};

/**
 * Factory Method: cria a implementação concreta de TTS
 * sem acoplar o Composition Root à API da lib escolhida.
 */
export function createTtsService(
  config: CreateTtsServiceConfig = {},
): ITtsService {
  const provider = config.provider ?? 'react-native-tts';
  const defaultLanguage = config.defaultLanguage ?? 'en-US';

  switch (provider) {
    case 'react-native-tts':
      return new ReactNativeTtsAdapter(defaultLanguage);
    default: {
      const unsupported: never = provider;
      throw new Error(`Unsupported TTS provider: ${String(unsupported)}`);
    }
  }
}
