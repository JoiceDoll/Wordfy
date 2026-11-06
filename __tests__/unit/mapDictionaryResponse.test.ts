import { mapDictionaryResponse } from '@/data/api/mappers';

describe('mapDictionaryResponse', () => {
  it('maps phonetic, audio and meanings from Free Dictionary payload', () => {
    const result = mapDictionaryResponse([
      {
        word: 'Hello',
        phonetic: '/həˈloʊ/',
        phonetics: [
          { text: '/həˈloʊ/', audio: '' },
          {
            text: '/həˈləʊ/',
            audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/hello-uk.mp3',
          },
        ],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [{ definition: 'A greeting' }],
          },
          {
            partOfSpeech: 'verb',
            definitions: [{ definition: 'To greet' }],
          },
        ],
      },
    ]);

    expect(result.word).toBe('hello');
    expect(result.phonetic).toBe('/həˈloʊ/');
    expect(result.audioUrl).toContain('hello-uk.mp3');
    expect(result.meanings).toHaveLength(2);
    expect(result.meanings[0].definitions[0]).toBe('A greeting');
  });
});
