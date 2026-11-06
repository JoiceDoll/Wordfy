import React, { useCallback } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MainStackParamList } from '@/navigation';
import {
  EmptyState,
  ErrorBanner,
  SearchField,
  WordListSkeleton,
} from '@/shared';
import { useTheme } from '@/theme';
import { WordCell, WordTabBar } from '../components';
import { useWordListViewModel } from '../viewmodels';

type Props = NativeStackScreenProps<MainStackParamList, 'WordList'>;

function HamburgerIcon({ color }: { color: string }) {
  return (
    <View style={styles.hamburger}>
      <View style={[styles.hamburgerLine, { backgroundColor: color }]} />
      <View style={[styles.hamburgerLine, { backgroundColor: color }]} />
      <View style={[styles.hamburgerLine, { backgroundColor: color }]} />
    </View>
  );
}

function getEmptyCopy(params: {
  activeTab: 'list' | 'history' | 'favorites';
  isSearching: boolean;
  searchQuery: string;
}): { title: string; message: string } {
  if (params.isSearching) {
    return {
      title: 'Nenhuma palavra encontrada',
      message: `Não encontramos resultados para "${params.searchQuery}".`,
    };
  }

  if (params.activeTab === 'favorites') {
    return {
      title: 'Lista vazia',
      message: 'Favorite palavras no detalhe para vê-las aqui.',
    };
  }

  if (params.activeTab === 'history') {
    return {
      title: 'Lista vazia',
      message: 'Palavras que você abrir aparecerão no histórico.',
    };
  }

  return {
    title: 'Lista vazia',
    message: 'Nenhuma palavra encontrada.',
  };
}

export function WordListScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const {
    activeTab,
    selectTab,
    title,
    showSearch,
    searchText,
    setSearchText,
    searchQuery,
    isSearching,
    words,
    loadMore,
    refresh,
    isLoading,
    isRefreshing,
    isFetchingMore,
    isEmpty,
    error,
  } = useWordListViewModel();

  const onPressWord = useCallback(
    (word: string) => {
      navigation.navigate('WordDetail', {
        word,
        words: words.map(item => item.word),
      });
    },
    [navigation, words],
  );

  const renderItem = useCallback(
    ({ item }: { item: { word: string } }) => (
      <WordCell word={item.word} onPress={onPressWord} />
    ),
    [onPressWord],
  );

  const emptyCopy = getEmptyCopy({ activeTab, isSearching, searchQuery });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top + 8,
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir menu"
          onPress={() => navigation.navigate('Menu')}
          hitSlop={12}
          style={styles.menuButton}>
          <HamburgerIcon color={theme.colors.text} />
        </Pressable>
      </View>

      <View style={styles.pad}>
        <WordTabBar activeTab={activeTab} onChange={selectTab} />
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        {showSearch ? (
          <SearchField value={searchText} onChangeText={setSearchText} />
        ) : null}
        {error ? <ErrorBanner message={error} /> : null}
      </View>

      {isLoading ? (
        <WordListSkeleton style={[styles.list, styles.listContent]} />
      ) : isEmpty ? (
        <View style={styles.emptyContainer}>
          <EmptyState title={emptyCopy.title} message={emptyCopy.message} />
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={words}
          keyExtractor={item => item.word}
          numColumns={3}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
          }
          ListFooterComponent={
            isFetchingMore ? (
              <WordListSkeleton rows={1} style={styles.footer} />
            ) : (
              <View style={styles.footerSpacer} />
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuButton: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  hamburger: {
    width: 22,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    height: 2,
    borderRadius: 1,
    width: '100%',
  },
  pad: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  footer: {
    marginVertical: 16,
  },
  footerSpacer: {
    height: 16,
  },
});
