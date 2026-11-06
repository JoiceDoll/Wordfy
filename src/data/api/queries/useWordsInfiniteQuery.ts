import { useInfiniteQuery } from '@tanstack/react-query';

import { getContainer } from '@/di';
import type { WordListTab } from '@/domain';
import { WORDS_PAGE_SIZE } from '@/shared';

import { queryKeys } from './queryKeys';

export function useWordsInfiniteQuery(
  tab: WordListTab,
  userId: string,
  search = '',
) {
  const { wordsRepository } = getContainer();
  const normalizedSearch = search.trim();

  return useInfiniteQuery({
    queryKey: queryKeys.wordsPage(tab, userId, normalizedSearch),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      await wordsRepository.ensureSeeded();
      return wordsRepository.getWordsPage(
        tab,
        userId,
        WORDS_PAGE_SIZE,
        pageParam,
        normalizedSearch,
      );
    },
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (lastPage.length < WORDS_PAGE_SIZE) {
        return undefined;
      }
      return lastPageParam + WORDS_PAGE_SIZE;
    },
    enabled: Boolean(userId),
  });
}
