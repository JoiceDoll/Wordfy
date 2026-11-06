import type { DB } from '@op-engineering/op-sqlite';

import type {
  AuthSession,
  IAuthRepository,
  IKeychainService,
  User,
} from '@/domain';
import {
  createId,
  createSalt,
  hashPassword,
  normalizeEmail,
} from '@/shared/utils';

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export class AuthRepository implements IAuthRepository {
  constructor(
    private readonly db: DB,
    private readonly keychain: IKeychainService,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<User> {
    const normalized = normalizeEmail(email);
    const displayName = normalizeName(name);
    if (!normalized || !password || password.length < 6) {
      throw new Error(
        'Informe um e-mail válido e senha com pelo menos 6 caracteres.',
      );
    }
    if (!displayName) {
      throw new Error('Informe o seu nome.');
    }

    const existing = await this.db.execute(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [normalized],
    );
    if (existing.rows?.[0]) {
      throw new Error('Já existe uma conta com este e-mail.');
    }

    const id = createId();
    const salt = createSalt();
    const passwordHash = hashPassword(password, salt);
    const createdAt = new Date().toISOString();

    await this.db.execute(
      `INSERT INTO users (id, email, name, password_hash, salt, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, normalized, displayName, passwordHash, salt, createdAt],
    );

    return { id, email: normalized, name: displayName, createdAt };
  }

  async login(email: string, password: string): Promise<AuthSession> {
    const normalized = normalizeEmail(email);
    const result = await this.db.execute(
      'SELECT id, email, name, password_hash, salt FROM users WHERE email = ? LIMIT 1',
      [normalized],
    );
    const row = result.rows?.[0];
    if (!row) {
      throw new Error('E-mail ou senha inválidos.');
    }

    const expected = String(row.password_hash);
    const salt = String(row.salt);
    const actual = hashPassword(password, salt);
    if (actual !== expected) {
      throw new Error('E-mail ou senha inválidos.');
    }

    const session: AuthSession = {
      userId: String(row.id),
      email: String(row.email),
      name: String(row.name ?? ''),
      token: createId(),
    };
    await this.keychain.saveSession(session);
    return session;
  }

  async logout(): Promise<void> {
    await this.keychain.clearSession();
  }

  async restoreSession(): Promise<AuthSession | null> {
    const session = await this.keychain.getSession();
    if (!session) {
      return null;
    }

    const user = await this.getUserById(session.userId);
    if (!user) {
      await this.keychain.clearSession();
      return null;
    }

    return {
      ...session,
      email: user.email,
      name: user.name,
    };
  }

  async getUserById(userId: string): Promise<User | null> {
    const result = await this.db.execute(
      'SELECT id, email, name, created_at FROM users WHERE id = ? LIMIT 1',
      [userId],
    );
    const row = result.rows?.[0];
    if (!row) {
      return null;
    }

    return {
      id: String(row.id),
      email: String(row.email),
      name: String(row.name ?? ''),
      createdAt: String(row.created_at),
    };
  }
}
