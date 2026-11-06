import type { WordListItem, WordListTab } from '../models';

export interface IWordsRepository {
  getWordsPage(
    tab: WordListTab,
    userId: string,
    limit: number,
    offset: number,
    search?: string,
  ): Promise<WordListItem[]>;
  ensureSeeded(): Promise<void>;
  isSeeded(): Promise<boolean>;
}
