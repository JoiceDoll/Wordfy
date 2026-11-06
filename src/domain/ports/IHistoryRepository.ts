export interface IHistoryRepository {
  addHistory(userId: string, word: string): Promise<void>;
}
