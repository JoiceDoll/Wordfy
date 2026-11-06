import React, { useCallback } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MainStackParamList } from '@/navigation';
import {
  AppButton,
  BottomSafeArea,
  EmptyState,
  ErrorBanner,
  Toast,
  WordDetailSkeleton,
} from '@/shared';
import { useTheme } from '@/theme';
import { AudioPlayerBar } from '../components';
import { useWordDetailViewModel } from '../viewmodels';

type Props = NativeStackScreenProps<MainStackParamList, 'WordDetail'>;

const FAVORITE_RED = '#E11D48';
const heartFilled = require('@/assets/heart-filled.png');
const heartOutline = require('@/assets/heart-outline.png');

export function WordDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { word, words } = route.params;

  const onNavigateToWord = useCallback(
    (nextWord: string) => {
      navigation.setParams({ word: nextWord, words });
    },
    [navigation, words],
  );

  const onClose = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('WordList');
  }, [navigation]);

  const vm = useWordDetailViewModel({
    word,
    words,
    onNavigateToWord,
    onClose,
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top + 8,
        },
      ]}>
      <View style={styles.headerActions}>
        <Pressable
          onPress={vm.onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          hitSlop={12}>
          <Text style={[styles.close, { color: theme.colors.text }]}>✕</Text>
        </Pressable>
        <Pressable
          onPress={vm.onToggleFavorite}
          disabled={vm.favoriteLoading}
          accessibilityRole="button"
          accessibilityLabel={
            vm.isFavorite ? 'Remover dos favoritos' : 'Favoritar palavra'
          }
          hitSlop={12}
          style={styles.favoriteButton}>
          <Image
            source={vm.isFavorite ? heartFilled : heartOutline}
            style={[
              styles.favoriteIcon,
              {
                tintColor: vm.isFavorite
                  ? FAVORITE_RED
                  : theme.colors.textSecondary,
              },
            ]}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {vm.isLoading ? (
        <WordDetailSkeleton />
      ) : vm.isNotFound ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            title="Palavra não encontrada"
            message="Essa palavra não está no dicionário. Tente outra da lista."
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.wordCard,
              { backgroundColor: theme.colors.primarySoft },
            ]}>
            <Text style={[styles.word, { color: theme.colors.text }]}>
              {vm.definition?.word ?? word}
            </Text>
            {vm.definition?.phonetic ? (
              <Text
                style={[styles.phonetic, { color: theme.colors.textSecondary }]}>
                {vm.definition.phonetic}
              </Text>
            ) : null}
          </View>

          <AudioPlayerBar
            disabled={!word.trim()}
            isPlaying={vm.isPlaying}
            progress={vm.playbackProgress}
            onPlay={() => {
              vm.playAudio().catch(() => undefined);
            }}
            onStop={() => {
              vm.stopAudio().catch(() => undefined);
            }}
          />

          {vm.audioError ? <ErrorBanner message={vm.audioError} /> : null}
          {vm.error ? <ErrorBanner message={vm.error} /> : null}

          {!vm.error ? (
            <View style={styles.meanings}>
              <Text style={[styles.meaningsTitle, { color: theme.colors.text }]}>
                Meanings
              </Text>
              {(vm.definition?.meanings ?? []).map((meaning, meaningIndex) => (
                <View
                  key={`${meaning.partOfSpeech}-${meaningIndex}`}
                  style={styles.meaningBlock}>
                  {meaning.definitions.map((definition, index) => (
                    <Text
                      key={`${meaning.partOfSpeech}-${meaningIndex}-${index}`}
                      style={[
                        styles.definition,
                        { color: theme.colors.textSecondary },
                      ]}>
                      {meaning.partOfSpeech} - {definition}
                    </Text>
                  ))}
                </View>
              ))}
              {(vm.definition?.meanings?.length ?? 0) === 0 ? (
                <Text style={{ color: theme.colors.textSecondary }}>
                  Sem significados disponíveis.
                </Text>
              ) : null}
            </View>
          ) : null}
        </ScrollView>
      )}

      <BottomSafeArea style={styles.footer}>
        <AppButton
          label="Voltar"
          style={styles.footerButton}
          onPress={vm.goPrevious}
        />
        <View style={styles.footerSpacer} />
        <AppButton
          label="Próximo"
          style={styles.footerButton}
          disabled={!vm.hasNext}
          onPress={vm.goNext}
        />
      </BottomSafeArea>

      <Toast message={vm.toastMessage} onHide={vm.hideToast} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  close: {
    fontSize: 22,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    width: 26,
    height: 26,
  },
  content: {
    paddingBottom: 16,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  wordCard: {
    borderRadius: 8,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  word: {
    fontSize: 34,
    fontWeight: '700',
  },
  phonetic: {
    marginTop: 8,
    fontSize: 18,
  },
  meanings: {
    marginTop: 28,
  },
  meaningsTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  meaningBlock: {
    marginBottom: 12,
  },
  definition: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  footerButton: {
    flex: 1,
  },
  footerSpacer: {
    width: 12,
  },
});
