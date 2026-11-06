import type {
  IAudioPlayerService,
  IAuthRepository,
  IDictionaryRepository,
  IFavoritesRepository,
  IHistoryRepository,
  IKeychainService,
  IThemeStorage,
  ITtsService,
  IWordsRepository,
} from '@/domain';

export type AppContainer = {
  authRepository: IAuthRepository;
  dictionaryRepository: IDictionaryRepository;
  wordsRepository: IWordsRepository;
  favoritesRepository: IFavoritesRepository;
  historyRepository: IHistoryRepository;
  keychainService: IKeychainService;
  audioPlayerService: IAudioPlayerService;
  ttsService: ITtsService;
  themeStorage: IThemeStorage;
};
