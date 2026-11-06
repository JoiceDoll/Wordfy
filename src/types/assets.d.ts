declare module '*.json' {
  const value: unknown;
  export default value;
}

declare module '*.png' {
  const value: number;
  export default value;
}

declare module 'react-native-sound-player' {
  const SoundPlayer: {
    playUrl: (url: string) => void;
    stop: () => void;
  };
  export default SoundPlayer;
}
