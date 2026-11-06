import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  useIsFavoriteQuery,
  useToggleFavoriteMutation,
  useWordQuery,
} from '@/data';
import { getContainer } from '@/di';
import { useAppSelector } from '@/store';

const NOT_FOUND_MESSAGE = 'Palavra não encontrada no dicionário.';

type UseWordDetailViewModelParams = {
  word: string;
  words: string[];
  onNavigateToWord: (word: string) => void;
  onClose: () => void;
};

export function useWordDetailViewModel({
  word,
  words,
  onNavigateToWord,
  onClose,
}: UseWordDetailViewModelParams) {
  const userId = useAppSelector(state => state.auth.session?.userId ?? '');
  const { historyRepository, audioPlayerService, ttsService } = getContainer();
  const queryClient = useQueryClient();
  const wordQuery = useWordQuery(word);
  const favoriteQuery = useIsFavoriteQuery(userId, word);
  const toggleFavorite = useToggleFavoriteMutation(userId, word);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !word) {
      return;
    }
    historyRepository
      .addHistory(userId, word)
      .then(() =>
        queryClient.invalidateQueries({
          queryKey: ['words', 'history', userId],
        }),
      )
      .catch(() => undefined);
  }, [historyRepository, queryClient, userId, word]);

  useEffect(() => {
    setIsPlaying(false);
    setPlaybackProgress(0);
    setAudioError(null);
    return () => {
      audioPlayerService.stop().catch(() => undefined);
      ttsService.stop().catch(() => undefined);
    };
  }, [audioPlayerService, ttsService, word]);

  const normalizedWord = word.trim().toLowerCase();
  const index = words.findIndex(
    item => item.trim().toLowerCase() === normalizedWord,
  );
  const hasPrevious = index > 0;
  const hasNext = index >= 0 && index < words.length - 1;

  const goPrevious = useCallback(() => {
    if (hasPrevious) {
      onNavigateToWord(words[index - 1]);
      return;
    }
    onClose();
  }, [hasPrevious, index, onClose, onNavigateToWord, words]);

  const goNext = useCallback(() => {
    if (!hasNext) {
      return;
    }
    onNavigateToWord(words[index + 1]);
  }, [hasNext, index, onNavigateToWord, words]);

  const playAudio = useCallback(async () => {
    setAudioError(null);
    const definition = wordQuery.data;
    const spokenWord = definition?.word?.trim() || word.trim();
    if (!spokenWord) {
      setAudioError('Pronúncia indisponível para esta palavra.');
      return;
    }

    try {
      setPlaybackProgress(0);
      setIsPlaying(true);
      await Promise.all([audioPlayerService.stop(), ttsService.stop()]);

      // Pronúncia sempre via TTS (porta ITtsService). Evita "play falso"
      // quando a API tem audioUrl mas o stream remoto falha em silêncio.
      await ttsService.speak(spokenWord, {
        language: 'en-US',
        onProgress: setPlaybackProgress,
      });
      setPlaybackProgress(1);
      setIsPlaying(false);
      // Mantém 100% um instante para a barra chegar visualmente ao fim.
      await new Promise<void>(resolve => {
        setTimeout(resolve, 180);
      });
      setPlaybackProgress(0);
    } catch (err) {
      setAudioError(
        err instanceof Error ? err.message : 'Falha ao reproduzir áudio.',
      );
      setIsPlaying(false);
      setPlaybackProgress(0);
    }
  }, [audioPlayerService, ttsService, word, wordQuery.data]);

  const stopAudio = useCallback(async () => {
    await Promise.all([audioPlayerService.stop(), ttsService.stop()]);
    setIsPlaying(false);
    setPlaybackProgress(0);
  }, [audioPlayerService, ttsService]);

  const onToggleFavorite = useCallback(() => {
    const next = !favoriteQuery.data;
    toggleFavorite.mutate(next, {
      onSuccess: () => {
        if (next) {
          setToastMessage('Palavra favoritada');
        }
      },
    });
  }, [favoriteQuery.data, toggleFavorite]);

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const errorMessage = wordQuery.error
    ? wordQuery.error instanceof Error
      ? wordQuery.error.message
      : 'Não foi possível carregar a definição desta palavra.'
    : null;
  const isNotFound = errorMessage === NOT_FOUND_MESSAGE;

  return {
    definition: wordQuery.data,
    isLoading: wordQuery.isLoading,
    error: isNotFound ? null : errorMessage,
    isNotFound,
    isFavorite: Boolean(favoriteQuery.data),
    onToggleFavorite,
    favoriteLoading: toggleFavorite.isPending,
    playAudio,
    stopAudio,
    isPlaying,
    playbackProgress,
    audioError,
    goPrevious,
    goNext,
    hasPrevious,
    hasNext,
    onClose,
    toastMessage,
    hideToast,
  };
}
