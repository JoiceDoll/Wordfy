import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getContainer } from '@/di';

import { queryKeys } from './queryKeys';

export function useIsFavoriteQuery(userId: string, word: string) {
  const { favoritesRepository } = getContainer();

  return useQuery({
    queryKey: queryKeys.isFavorite(userId, word),
    queryFn: () => favoritesRepository.isFavorite(userId, word),
    enabled: Boolean(userId && word),
  });
}

export function useToggleFavoriteMutation(userId: string, word: string) {
  const queryClient = useQueryClient();
  const { favoritesRepository } = getContainer();

  return useMutation({
    mutationFn: async (shouldFavorite: boolean) => {
      if (shouldFavorite) {
        await favoritesRepository.addFavorite(userId, word);
      } else {
        await favoritesRepository.removeFavorite(userId, word);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.isFavorite(userId, word),
      });
      await queryClient.invalidateQueries({
        queryKey: ['words', 'favorites', userId],
      });
    },
  });
}
