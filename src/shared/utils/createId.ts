import 'react-native-get-random-values';

type RandomSource = {
  getRandomValues: <T extends ArrayBufferView>(array: T) => T;
};

function getRandomSource(): RandomSource {
  const candidate = (globalThis as { crypto?: RandomSource }).crypto;
  if (!candidate?.getRandomValues) {
    throw new Error('Secure random generator is unavailable.');
  }
  return candidate;
}

export function createId(): string {
  const bytes = new Uint8Array(16);
  getRandomSource().getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
