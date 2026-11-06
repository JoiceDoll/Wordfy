import { DB_NAME } from '@env';
import { open, type DB } from '@op-engineering/op-sqlite';

import {
  MIGRATION_STATEMENTS,
  SCHEMA_VERSION,
  VERSION_MIGRATIONS,
} from './schema';

if (!DB_NAME) {
  throw new Error('DB_NAME is not set');
}

let database: DB | null = null;

export function getDatabase(): DB {
  if (!database) {
    throw new Error('Database has not been initialized. Call initDatabase() first.');
  }
  return database;
}

async function getSchemaVersion(db: DB): Promise<number> {
  const versionResult = await db.execute(
    'SELECT value FROM meta WHERE key = ?',
    ['schema_version'],
  );
  const raw = versionResult.rows?.[0]?.value;
  if (raw == null) {
    return 0;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function setSchemaVersion(db: DB, version: number): Promise<void> {
  await db.execute(
    `INSERT INTO meta (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    ['schema_version', String(version)],
  );
}

async function applyMigrations(db: DB): Promise<void> {
  await db.execute('PRAGMA journal_mode = WAL');
  for (const statement of MIGRATION_STATEMENTS) {
    await db.execute(statement);
  }

  const currentVersion = await getSchemaVersion(db);

  if (currentVersion === 0) {
    // Fresh install: baseline already matches latest schema.
    await setSchemaVersion(db, SCHEMA_VERSION);
    return;
  }

  for (let version = currentVersion + 1; version <= SCHEMA_VERSION; version++) {
    for (const statement of VERSION_MIGRATIONS[version] ?? []) {
      await db.execute(statement);
    }
  }

  if (currentVersion < SCHEMA_VERSION) {
    await setSchemaVersion(db, SCHEMA_VERSION);
  }
}

export async function initDatabase(): Promise<DB> {
  if (database) {
    return database;
  }

  database = open({ name: DB_NAME });
  await applyMigrations(database);
  return database;
}

export async function resetDatabaseForTests(db: DB): Promise<void> {
  database = db;
  await applyMigrations(database);
}
