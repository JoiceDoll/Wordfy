export type WordMeaning = {
  partOfSpeech: string;
  definitions: string[];
};

export type WordDefinition = {
  word: string;
  phonetic: string | null;
  audioUrl: string | null;
  meanings: WordMeaning[];
  raw: unknown;
};

export type WordListItem = {
  word: string;
};

export type WordListTab = 'list' | 'history' | 'favorites';
