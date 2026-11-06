import type { DB } from '@op-engineering/op-sqlite';

import type {
  IWordsRepository,
  WordListItem,
  WordListTab,
} from '@/domain';
import { rankWordsBySimilarity } from '@/shared';
import { isWordsSeeded, seedWordsIfNeeded } from '../../database/seedWords';

export class WordsRepository implements IWordsRepository {
  constructor(private readonly db: DB) {}

  async ensureSeeded(): Promise<void> {
    await seedWordsIfNeeded(this.db);
  }

  async isSeeded(): Promise<boolean> {
    return isWordsSeeded(this.db);
  }

  async getWordsPage(
    tab: WordListTab,
    userId: string,
    limit: number,
    offset: number,
    search = '',
  ): Promise<WordListItem[]> {
    const normalizedSearch = search.trim();
    const hasSearch = normalizedSearch.length > 0;

    if (tab === 'list') {
      if (!hasSearch) {
        const result = await this.db.execute(
          `SELECT word FROM words
           ORDER BY word COLLATE NOCASE ASC
           LIMIT ? OFFSET ?`,
          [limit, offset],
        );
        return (result.rows ?? []).map(row => ({ word: String(row.word) }));
      }

      const result = await this.db.execute(`SELECT word FROM words`);
      const words = (result.rows ?? []).map(row => String(row.word));
      return this.paginateRanked(words, normalizedSearch, limit, offset);
    }

    if (tab === 'favorites') {
      if (!hasSearch) {
        const result = await this.db.execute(
          `SELECT word FROM favorites
           WHERE user_id = ?
           ORDER BY created_at DESC
           LIMIT ? OFFSET ?`,
          [userId, limit, offset],
        );
        return (result.rows ?? []).map(row => ({ word: String(row.word) }));
      }

      const result = await this.db.execute(
        `SELECT word FROM favorites WHERE user_id = ?`,
        [userId],
      );
      const words = (result.rows ?? []).map(row => String(row.word));
      return this.paginateRanked(words, normalizedSearch, limit, offset);
    }

    const result = await this.db.execute(
      `SELECT word FROM history
       WHERE user_id = ?
       ORDER BY visited_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset],
    );
    return (result.rows ?? []).map(row => ({ word: String(row.word) }));
  }

  private paginateRanked(
    words: string[],
    search: string,
    limit: number,
    offset: number,
  ): WordListItem[] {
    return rankWordsBySimilarity(words, search)
      .slice(offset, offset + limit)
      .map(word => ({ word }));
  }
}
