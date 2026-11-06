import { useQuery } from '@tanstack/react-query';

import { getContainer } from '@/di';

import { queryKeys } from './queryKeys';

export function useWordQuery(word: string, enabled = true) {
  const { dictionaryRepository } = getContainer();

  return useQuery({
    queryKey: queryKeys.word(word),
    queryFn: () => dictionaryRepository.getWord(word),
    enabled: enabled && Boolean(word),
    staleTime: 1000 * 60 * 10,
  });
}
