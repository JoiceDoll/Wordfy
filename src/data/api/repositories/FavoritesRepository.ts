import type { DB } from '@op-engineering/op-sqlite';

import type { IFavoritesRepository } from '@/domain';

export class FavoritesRepository implements IFavoritesRepository {
  constructor(private readonly db: DB) {}

  async addFavorite(userId: string, word: string): Promise<void> {
    await this.db.execute(
      `INSERT OR REPLACE INTO favorites (user_id, word, created_at)
       VALUES (?, ?, ?)`,
      [userId, word.toLowerCase(), new Date().toISOString()],
    );
  }

  async removeFavorite(userId: string, word: string): Promise<void> {
    await this.db.execute(
      'DELETE FROM favorites WHERE user_id = ? AND word = ?',
      [userId, word.toLowerCase()],
    );
  }

  async isFavorite(userId: string, word: string): Promise<boolean> {
    const result = await this.db.execute(
      'SELECT 1 AS found FROM favorites WHERE user_id = ? AND word = ? LIMIT 1',
      [userId, word.toLowerCase()],
    );
    return Boolean(result.rows?.[0]);
  }
}
