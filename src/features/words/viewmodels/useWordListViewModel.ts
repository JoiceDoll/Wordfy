import { useCallback, useMemo, useState } from 'react';

import { useWordsInfiniteQuery } from '@/data';
import type { WordListTab } from '@/domain';
import { useDebouncedValue } from '@/shared';
import { setActiveTab, useAppDispatch, useAppSelector } from '@/store';

const SEARCH_DEBOUNCE_MS = 1000;

function isSearchableTab(tab: WordListTab): boolean {
  return tab === 'list' || tab === 'favorites';
}

export function useWordListViewModel() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(state => state.ui.activeTab);
  const userId = useAppSelector(state => state.auth.session?.userId ?? '');
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, SEARCH_DEBOUNCE_MS);

  const searchQuery = isSearchableTab(activeTab) ? debouncedSearch.trim() : '';
  const query = useWordsInfiniteQuery(activeTab, userId, searchQuery);

  const words = useMemo(
    () => query.data?.pages.flatMap(page => page) ?? [],
    [query.data],
  );

  const selectTab = useCallback(
    (tab: WordListTab) => {
      dispatch(setActiveTab(tab));
    },
    [dispatch],
  );

  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage().catch(() => undefined);
    }
  }, [query]);

  const refresh = useCallback(() => {
    query.refetch().catch(() => undefined);
  }, [query]);

  const titleByTab: Record<WordListTab, string> = {
    list: 'Word list',
    history: 'Histórico',
    favorites: 'Favoritos',
  };

  const isSearching = searchQuery.length > 0;
  const isEmpty = !query.isLoading && words.length === 0;

  return {
    activeTab,
    selectTab,
    title: titleByTab[activeTab],
    showSearch: isSearchableTab(activeTab),
    searchText,
    setSearchText,
    searchQuery,
    isSearching,
    words,
    loadMore,
    refresh,
    isLoading: query.isLoading,
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    isFetchingMore: query.isFetchingNextPage,
    isEmpty,
    error: query.error ? 'Não foi possível carregar as palavras.' : null,
  };
}
