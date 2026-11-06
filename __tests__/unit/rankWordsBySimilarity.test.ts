import {
  levenshteinDistance,
  rankWordsBySimilarity,
} from '@/shared/utils';

describe('levenshteinDistance', () => {
  it('returns 0 for identical strings', () => {
    expect(levenshteinDistance('worse', 'worse')).toBe(0);
  });

  it('counts a single substitution', () => {
    expect(levenshteinDistance('worsg', 'worse')).toBe(1);
  });
});

describe('rankWordsBySimilarity', () => {
  const dictionary = [
    'word',
    'worse',
    'worst',
    'worship',
    'worth',
    'apple',
  ];

  it('finds close typos like worsg → worse', () => {
    const ranked = rankWordsBySimilarity(dictionary, 'worsg');

    expect(ranked).toContain('worse');
    expect(ranked).toContain('worst');
    expect(ranked).not.toContain('apple');
  });

  it('ranks exact and prefix matches before fuzzy ones', () => {
    const ranked = rankWordsBySimilarity(dictionary, 'wors');

    expect(ranked[0]).toBe('worse');
    expect(ranked).toEqual(
      expect.arrayContaining(['worse', 'worst', 'worship']),
    );
  });

  it('keeps very short queries exact-only', () => {
    const ranked = rankWordsBySimilarity(dictionary, 'wo');

    expect(ranked).toEqual(
      expect.arrayContaining(['word', 'worse', 'worst', 'worship', 'worth']),
    );
    expect(ranked).not.toContain('apple');
  });
});
