import { DICTIONARY_API_BASE_URL } from '@env';

if (!DICTIONARY_API_BASE_URL) {
  throw new Error('DICTIONARY_API_BASE_URL is not set');
}

export const DICTIONARY_BASE_URL = DICTIONARY_API_BASE_URL;

export function wordEntryEndpoint(word: string): string {
  return `${DICTIONARY_BASE_URL}/${encodeURIComponent(word.toLowerCase())}`;
}
