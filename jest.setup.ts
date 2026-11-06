import 'react-native-gesture-handler/jestSetup.js';

jest.mock('react-native-get-random-values', () => ({}));

jest.mock('react-native-keychain', () => ({
  ACCESSIBLE: {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly',
  },
  setGenericPassword: jest.fn(async () => true),
  getGenericPassword: jest.fn(async () => false),
  resetGenericPassword: jest.fn(async () => true),
}));

jest.mock('react-native-sound-player', () => ({
  __esModule: true,
  default: {
    playUrl: jest.fn(),
    stop: jest.fn(),
  },
}));

jest.mock('react-native-tts', () => ({
  __esModule: true,
  default: {
    getInitStatus: jest.fn(async () => 'success'),
    requestInstallEngine: jest.fn(async () => 'success'),
    setDefaultLanguage: jest.fn(async () => 'success'),
    setDefaultRate: jest.fn(async () => 'success'),
    setIgnoreSilentSwitch: jest.fn(async () => true),
    speak: jest.fn(() => 'utterance-1'),
    stop: jest.fn(async () => true),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

jest.mock('@op-engineering/op-sqlite', () => ({
  open: jest.fn(),
}));
