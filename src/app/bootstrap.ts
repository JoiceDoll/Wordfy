import { initDatabase, seedWordsIfNeeded } from '@/data';
import { createContainer, getContainer } from '@/di';
import { setBootstrapped, setSession, type AppDispatch } from '@/store';

export async function bootstrapApp(dispatch: AppDispatch): Promise<void> {
  try {
    const db = await initDatabase();
    createContainer(db);

    seedWordsIfNeeded(db).catch(() => undefined);

    const { authRepository } = getContainer();
    const session = await authRepository.restoreSession();
    dispatch(setSession(session));
  } finally {
    dispatch(setBootstrapped(true));
  }
}
