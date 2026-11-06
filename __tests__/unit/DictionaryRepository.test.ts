import type { AxiosInstance } from 'axios';
import type { DB } from '@op-engineering/op-sqlite';

import { DictionaryRepository } from '@/data/api/repositories';

function createDbMock(initial?: { payload: string; cached_at: number }) {
  const store = new Map<string, { payload: string; cached_at: number }>();
  if (initial) {
    store.set('hello', initial);
  }

  return {
    execute: jest.fn(async (sql: string, params?: unknown[]) => {
      if (sql.includes('SELECT payload')) {
        const word = String(params?.[0]);
        const row = store.get(word);
        return { rows: row ? [row] : [] };
      }
      if (sql.includes('INSERT OR REPLACE INTO word_cache')) {
        store.set(String(params?.[0]), {
          payload: String(params?.[1]),
          cached_at: Number(params?.[2]),
        });
        return { rows: [] };
      }
      return { rows: [] };
    }),
  } as unknown as DB;
}

describe('DictionaryRepository', () => {
  it('returns cached definition without calling the API', async () => {
    const cached = {
      word: 'hello',
      phonetic: 'həˈləʊ',
      audioUrl: null,
      meanings: [],
      raw: [],
    };
    const db = createDbMock({
      payload: JSON.stringify(cached),
      cached_at: Date.now(),
    });
    const client = {
      get: jest.fn(),
    } as unknown as AxiosInstance;

    const repo = new DictionaryRepository(client, db);
    const result = await repo.getWord('hello');

    expect(result.word).toBe('hello');
    expect(client.get).not.toHaveBeenCalled();
  });

  it('fetches from API and writes cache on miss', async () => {
    const db = createDbMock();
    const client = {
      get: jest.fn(async () => ({
        data: [
          {
            word: 'peace',
            phonetic: '/piːs/',
            phonetics: [{ audio: 'https://example.com/peace.mp3' }],
            meanings: [
              {
                partOfSpeech: 'noun',
                definitions: [{ definition: 'Freedom from war' }],
              },
            ],
          },
        ],
      })),
    } as unknown as AxiosInstance;

    const repo = new DictionaryRepository(client, db);
    const result = await repo.getWord('peace');

    expect(result.word).toBe('peace');
    expect(result.audioUrl).toContain('peace.mp3');
    expect(client.get).toHaveBeenCalledTimes(1);
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT OR REPLACE INTO word_cache'),
      expect.any(Array),
    );
  });

  it('falls back to stale cache when the network fails', async () => {
    const stale = {
      word: 'hello',
      phonetic: 'old',
      audioUrl: null,
      meanings: [],
      raw: [],
    };
    const db = createDbMock({
      payload: JSON.stringify(stale),
      cached_at: Date.now() - 1000 * 60 * 60 * 24 * 30,
    });
    const client = {
      get: jest.fn(async () => {
        throw new Error('network down');
      }),
    } as unknown as AxiosInstance;

    const repo = new DictionaryRepository(client, db);
    const result = await repo.getWord('hello');
    expect(result.phonetic).toBe('old');
  });
});
