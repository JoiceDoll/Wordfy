import type { AuthSession } from '../models';

export interface IKeychainService {
  saveSession(session: AuthSession): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  clearSession(): Promise<void>;
}
