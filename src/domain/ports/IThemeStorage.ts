import type { ThemeMode } from '../models';

export interface IThemeStorage {
  getTheme(): Promise<ThemeMode | null>;
  setTheme(mode: ThemeMode): Promise<void>;
}
