import {
  levenshteinDistance,
  maxEditDistanceForQuery,
} from './levenshtein';

type RankedWord = {
  word: string;
  score: number;
};

function scoreWord(word: string, query: string): number | null {
  const normalizedWord = word.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (normalizedWord === normalizedQuery) {
    return 0;
  }
  if (normalizedWord.startsWith(normalizedQuery)) {
    return 1;
  }
  if (normalizedWord.includes(normalizedQuery)) {
    return 2;
  }

  const maxDistance = maxEditDistanceForQuery(normalizedQuery);
  if (maxDistance === 0) {
    return null;
  }

  if (Math.abs(normalizedWord.length - normalizedQuery.length) > maxDistance) {
    return null;
  }

  const distance = levenshteinDistance(normalizedWord, normalizedQuery);
  if (distance > maxDistance) {
    return null;
  }

  // Prefer closer edits after substring matches.
  return 3 + distance;
}

/**
 * Keeps exact/partial matches and close typos, ranked by relevance.
 * Returns the matched words in display order.
 */
export function rankWordsBySimilarity(
  words: string[],
  query: string,
): string[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return words;
  }

  const ranked: RankedWord[] = [];

  for (const word of words) {
    const score = scoreWord(word, normalizedQuery);
    if (score == null) {
      continue;
    }
    ranked.push({ word, score });
  }

  ranked.sort((a, b) => {
    if (a.score !== b.score) {
      return a.score - b.score;
    }
    return a.word.localeCompare(b.word, undefined, { sensitivity: 'base' });
  });

  return ranked.map(item => item.word);
}
