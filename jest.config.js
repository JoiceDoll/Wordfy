module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@tanstack|react-redux|@reduxjs|immer|react-native-safe-area-context|react-native-gesture-handler|react-native-screens|react-native-keychain|@op-engineering)/)',
  ],
};
