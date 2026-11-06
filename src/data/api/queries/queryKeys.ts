import type { WordListTab } from '@/domain';

export const queryKeys = {
  word: (word: string) => ['word', word.toLowerCase()] as const,
  wordsPage: (tab: WordListTab, userId: string, search = '') =>
    ['words', tab, userId, search.toLowerCase()] as const,
  isFavorite: (userId: string, word: string) =>
    ['favorite', userId, word.toLowerCase()] as const,
};
