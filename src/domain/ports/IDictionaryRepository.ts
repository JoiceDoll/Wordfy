import type { WordDefinition } from '../models';

export interface IDictionaryRepository {
  getWord(word: string): Promise<WordDefinition>;
}
