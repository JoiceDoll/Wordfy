import type { DB } from '@op-engineering/op-sqlite';

import type { IThemeStorage, ThemeMode } from '@/domain';

const THEME_KEY = 'theme_mode';

export class ThemeStorageService implements IThemeStorage {
  constructor(private readonly db: DB) {}

  async getTheme(): Promise<ThemeMode | null> {
    const result = await this.db.execute(
      'SELECT value FROM meta WHERE key = ?',
      [THEME_KEY],
    );
    const value = result.rows?.[0]?.value;
    if (value === 'light' || value === 'dark') {
      return value;
    }
    return null;
  }

  async setTheme(mode: ThemeMode): Promise<void> {
    await this.db.execute(
      'INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)',
      [THEME_KEY, mode],
    );
  }
}