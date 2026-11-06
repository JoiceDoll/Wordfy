export interface IFavoritesRepository {
  addFavorite(userId: string, word: string): Promise<void>;
  removeFavorite(userId: string, word: string): Promise<void>;
  isFavorite(userId: string, word: string): Promise<boolean>;
}
