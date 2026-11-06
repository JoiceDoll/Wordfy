export const SCHEMA_VERSION = 2;

/** Baseline schema for fresh installs (latest shape). */
export const MIGRATION_STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL DEFAULT '',
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS words (
    word TEXT PRIMARY KEY NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS word_cache (
    word TEXT PRIMARY KEY NOT NULL,
    payload TEXT NOT NULL,
    cached_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS favorites (
    user_id TEXT NOT NULL,
    word TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, word)
  )`,
  `CREATE TABLE IF NOT EXISTS history (
    user_id TEXT NOT NULL,
    word TEXT NOT NULL,
    visited_at TEXT NOT NULL,
    PRIMARY KEY (user_id, word)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_words_word ON words(word)`,
  `CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_history_user ON history(user_id, visited_at DESC)`,
];

/** Incremental upgrades keyed by target schema version. */
export const VERSION_MIGRATIONS: Record<number, string[]> = {
  2: [`ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT ''`],
};
