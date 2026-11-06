import type { DB } from '@op-engineering/op-sqlite';

import { createAxiosClient } from '@/data/api/client';
import {
  AuthRepository,
  DictionaryRepository,
  FavoritesRepository,
  HistoryRepository,
  WordsRepository,
} from '@/data/api/repositories';
import {
  AudioPlayerService,
  createTtsService,
  KeychainService,
  ThemeStorageService,
} from '@/services';
import type { AppContainer } from './types';

let container: AppContainer | null = null;

export function createContainer(db: DB): AppContainer {
  const axiosClient = createAxiosClient();
  const keychainService = new KeychainService();
  const ttsService = createTtsService({
    provider: 'react-native-tts',
    defaultLanguage: 'en-US',
  });

  const next: AppContainer = {
    keychainService,
    authRepository: new AuthRepository(db, keychainService),
    dictionaryRepository: new DictionaryRepository(axiosClient, db),
    wordsRepository: new WordsRepository(db),
    favoritesRepository: new FavoritesRepository(db),
    historyRepository: new HistoryRepository(db),
    audioPlayerService: new AudioPlayerService(),
    ttsService,
    themeStorage: new ThemeStorageService(db),
  };

  container = next;
  return next;
}

export function getContainer(): AppContainer {
  if (!container) {
    throw new Error('DI container is not ready. Call createContainer() after initDatabase().');
  }
  return container;
}

export function setContainerForTests(next: AppContainer): void {
  container = next;
}
