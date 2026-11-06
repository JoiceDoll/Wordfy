import type { DB } from '@op-engineering/op-sqlite';

import type { IHistoryRepository } from '@/domain';

export class HistoryRepository implements IHistoryRepository {
  constructor(private readonly db: DB) {}

  async addHistory(userId: string, word: string): Promise<void> {
    await this.db.execute(
      `INSERT OR REPLACE INTO history (user_id, word, visited_at)
       VALUES (?, ?, ?)`,
      [userId, word.toLowerCase(), new Date().toISOString()],
    );
  }
}
