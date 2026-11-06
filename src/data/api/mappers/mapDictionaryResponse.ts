import type { WordDefinition, WordMeaning } from '@/domain';

type ApiPhonetic = {
  text?: string;
  audio?: string;
};

type ApiDefinition = {
  definition?: string;
};

type ApiMeaning = {
  partOfSpeech?: string;
  definitions?: ApiDefinition[];
};

type ApiEntry = {
  word?: string;
  phonetic?: string;
  phonetics?: ApiPhonetic[];
  meanings?: ApiMeaning[];
};

export function mapDictionaryResponse(payload: unknown): WordDefinition {
  const entries = Array.isArray(payload) ? (payload as ApiEntry[]) : [];
  const primary = entries[0] ?? {};

  const phoneticFromList = primary.phonetics?.find(p => p.text)?.text ?? null;
  const audioUrl =
    primary.phonetics?.find(p => p.audio && p.audio.length > 0)?.audio ?? null;

  const meanings: WordMeaning[] = (primary.meanings ?? []).map(meaning => ({
    partOfSpeech: meaning.partOfSpeech ?? 'unknown',
    definitions: (meaning.definitions ?? [])
      .map(d => d.definition ?? '')
      .filter(Boolean),
  }));

  return {
    word: (primary.word ?? '').toLowerCase(),
    phonetic: primary.phonetic ?? phoneticFromList,
    audioUrl,
    meanings,
    raw: payload,
  };
}
