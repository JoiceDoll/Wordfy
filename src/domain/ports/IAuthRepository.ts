import type { AuthSession, User } from '../models';

export interface IAuthRepository {
  register(email: string, password: string, name: string): Promise<User>;
  login(email: string, password: string): Promise<AuthSession>;
  logout(): Promise<void>;
  restoreSession(): Promise<AuthSession | null>;
  getUserById(userId: string): Promise<User | null>;
}
