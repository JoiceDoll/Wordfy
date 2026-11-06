import type { DB } from '@op-engineering/op-sqlite';

import wordsSeed from './seed/words.json';

/** Bump when words.json changes so existing installs re-seed. */
export const WORDS_SEED_VERSION = '2';

const SEED_META_KEY = 'words_seed_version';
const LEGACY_SEED_META_KEY = 'words_seeded';
const BATCH_SIZE = 500;

export async function isWordsSeeded(db: DB): Promise<boolean> {
  const result = await db.execute('SELECT value FROM meta WHERE key = ?', [
    SEED_META_KEY,
  ]);
  return result.rows?.[0]?.value === WORDS_SEED_VERSION;
}

export async function seedWordsIfNeeded(db: DB): Promise<void> {
  if (await isWordsSeeded(db)) {
    return;
  }

  const words = wordsSeed as string[];

  await db.transaction(async tx => {
    await tx.execute('DELETE FROM words');

    for (let i = 0; i < words.length; i += BATCH_SIZE) {
      const chunk = words.slice(i, i + BATCH_SIZE);
      const placeholders = chunk.map(() => '(?)').join(',');
      await tx.execute(
        `INSERT OR IGNORE INTO words (word) VALUES ${placeholders}`,
        chunk,
      );
    }

    await tx.execute(
      'INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)',
      [SEED_META_KEY, WORDS_SEED_VERSION],
    );
    await tx.execute('DELETE FROM meta WHERE key = ?', [LEGACY_SEED_META_KEY]);
  });
}
