import * as Keychain from 'react-native-keychain';

import type { AuthSession, IKeychainService } from '@/domain';

const SERVICE = 'com.wordfy.auth';

export class KeychainService implements IKeychainService {
  async saveSession(session: AuthSession): Promise<void> {
    await Keychain.setGenericPassword(
      session.userId,
      JSON.stringify(session),
      {
        service: SERVICE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      },
    );
  }

  async getSession(): Promise<AuthSession | null> {
    const credentials = await Keychain.getGenericPassword({ service: SERVICE });
    if (!credentials) {
      return null;
    }

    try {
      const parsed = JSON.parse(credentials.password) as AuthSession;
      if (!parsed?.userId || !parsed?.token) {
        return null;
      }
      return {
        ...parsed,
        name: parsed.name ?? '',
        email: parsed.email ?? '',
      };
    } catch {
      return null;
    }
  }

  async clearSession(): Promise<void> {
    await Keychain.resetGenericPassword({ service: SERVICE });
  }
}
