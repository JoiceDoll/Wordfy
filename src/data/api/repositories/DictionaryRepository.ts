import axios, { type AxiosInstance } from 'axios';
import type { DB } from '@op-engineering/op-sqlite';

import type { IDictionaryRepository, WordDefinition } from '@/domain';
import { mapDictionaryResponse } from '../mappers';

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function isAxiosNotFound(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

export class DictionaryRepository implements IDictionaryRepository {
  constructor(
    private readonly client: AxiosInstance,
    private readonly db: DB,
  ) {}

  async getWord(word: string): Promise<WordDefinition> {
    const normalized = word.trim().toLowerCase();
    const cached = await this.readCache(normalized);
    if (cached) {
      return cached;
    }

    try {
      const response = await this.client.get(encodeURIComponent(normalized));
      const mapped = mapDictionaryResponse(response.data);
      await this.writeCache(normalized, mapped);
      return mapped;
    } catch (error) {
      const stale = await this.readCacheIgnoringTtl(normalized);
      if (stale) {
        return stale;
      }
      if (isAxiosNotFound(error)) {
        throw new Error('Palavra não encontrada no dicionário.');
      }
      throw new Error(
        'Falha de rede ao buscar a palavra. Tente novamente quando estiver online.',
      );
    }
  }

  private async readCacheIgnoringTtl(
    word: string,
  ): Promise<WordDefinition | null> {
    const result = await this.db.execute(
      'SELECT payload FROM word_cache WHERE word = ?',
      [word],
    );
    const row = result.rows?.[0];
    if (!row) {
      return null;
    }
    try {
      return JSON.parse(String(row.payload)) as WordDefinition;
    } catch {
      return null;
    }
  }

  private async readCache(word: string): Promise<WordDefinition | null> {
    const result = await this.db.execute(
      'SELECT payload, cached_at FROM word_cache WHERE word = ?',
      [word],
    );
    const row = result.rows?.[0];
    if (!row) {
      return null;
    }

    const cachedAt = Number(row.cached_at);
    if (Number.isFinite(cachedAt) && Date.now() - cachedAt > CACHE_TTL_MS) {
      return null;
    }

    try {
      return JSON.parse(String(row.payload)) as WordDefinition;
    } catch {
      return null;
    }
  }

  private async writeCache(word: string, definition: WordDefinition): Promise<void> {
    await this.db.execute(
      `INSERT OR REPLACE INTO word_cache (word, payload, cached_at)
       VALUES (?, ?, ?)`,
      [word, JSON.stringify(definition), Date.now()],
    );
  }
}
