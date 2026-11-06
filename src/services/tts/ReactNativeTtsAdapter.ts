import Tts from 'react-native-tts';

import type { ITtsService, TtsSpeakOptions } from '@/domain';

type EventSubscription = {
  remove: () => void;
};

type TtsProgressEvent = {
  location?: number;
  length?: number;
  start?: number;
  end?: number;
};

/**
 * Adapter: isola `react-native-tts` atrás da porta `ITtsService`.
 * Nenhuma feature/view importa a lib diretamente.
 */
export class ReactNativeTtsAdapter implements ITtsService {
  private readonly defaultLanguage: string;
  private readonly ready: Promise<void>;

  constructor(defaultLanguage = 'en-US') {
    this.defaultLanguage = defaultLanguage;
    this.ready = this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await Tts.getInitStatus();
    } catch {
      try {
        await Tts.requestInstallEngine();
        await Tts.getInitStatus();
      } catch {
        return;
      }
    }

    try {
      await Tts.setDefaultLanguage(this.defaultLanguage);
      await Tts.setIgnoreSilentSwitch('ignore');
    } catch {
      return;
    }
  }

  async speak(text: string, options?: TtsSpeakOptions): Promise<void> {
    const utterance = text.trim();
    if (!utterance) {
      throw new Error('Texto indisponível para pronunciar.');
    }

    await this.ready;

    const language = options?.language ?? this.defaultLanguage;
    const onProgress = options?.onProgress;
    try {
      await Tts.setDefaultLanguage(language);
      if (typeof options?.rate === 'number') {
        await Tts.setDefaultRate(options.rate);
      }
    } catch {
      // Segue com defaults do engine se a voz/idioma não estiver instalado.
    }

    // Para a fala anterior e espera o bridge drenar `tts-cancel`,
    // senão o play resolve na hora e parece "falso play".
    try {
      await Tts.stop();
    } catch {
      // ignore
    }
    await delay(120);

    onProgress?.(0);

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      let receivedNativeProgress = false;
      const subscriptions: EventSubscription[] = [];

      // Fallback: iOS/Android às vezes não emitem progress com frequência.
      const estimatedMs = Math.max(700, utterance.length * 90);
      const startedAt = Date.now();
      const progressTimer = setInterval(() => {
        if (settled || receivedNativeProgress) {
          return;
        }
        const ratio = (Date.now() - startedAt) / estimatedMs;
        onProgress?.(Math.min(0.92, Math.max(0, ratio)));
      }, 50);

      const cleanup = () => {
        clearInterval(progressTimer);
        while (subscriptions.length > 0) {
          const subscription = subscriptions.pop();
          try {
            subscription?.remove();
          } catch {
            // RN moderno removeu EventEmitter#removeListener.
          }
        }
      };

      const finish = () => {
        if (settled) {
          return;
        }
        settled = true;
        onProgress?.(1);
        cleanup();
        resolve();
      };

      const fail = () => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        reject(new Error('Falha ao pronunciar a palavra.'));
      };

      const onNativeProgress = (event: TtsProgressEvent) => {
        if (settled) {
          return;
        }
        receivedNativeProgress = true;
        onProgress?.(progressFromEvent(event, utterance.length));
      };

      // addEventListener retorna EmitterSubscription (.remove()).
      // NÃO usar Tts.removeEventListener — quebra no RN atual.
      subscriptions.push(
        Tts.addEventListener(
          'tts-progress',
          onNativeProgress,
        ) as unknown as EventSubscription,
        Tts.addEventListener(
          'tts-finish',
          finish,
        ) as unknown as EventSubscription,
        Tts.addEventListener(
          'tts-cancel',
          finish,
        ) as unknown as EventSubscription,
        Tts.addEventListener(
          'tts-error',
          fail,
        ) as unknown as EventSubscription,
      );

      // Android devolve Promise; iOS pode devolver id síncrono.
      Promise.resolve(Tts.speak(utterance)).catch(err => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        reject(
          err instanceof Error
            ? err
            : new Error('Falha ao pronunciar a palavra.'),
        );
      });
    });
  }

  async stop(): Promise<void> {
    try {
      await Tts.stop();
    } catch {
      return;
    }
  }
}

function progressFromEvent(
  event: TtsProgressEvent,
  textLength: number,
): number {
  if (textLength <= 0) {
    return 0;
  }

  // Android: start/end — iOS: location/length
  if (typeof event.end === 'number') {
    return clamp01(event.end / textLength);
  }

  if (typeof event.location === 'number') {
    return clamp01((event.location + (event.length ?? 0)) / textLength);
  }

  if (typeof event.start === 'number') {
    return clamp01(event.start / textLength);
  }

  return 0;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
