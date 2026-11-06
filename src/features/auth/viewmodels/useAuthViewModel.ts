import { useCallback } from 'react';

import { getContainer } from '@/di';
import { useAsyncAction } from '@/shared';
import {
  clearSession,
  setSession,
  useAppDispatch,
  useAppSelector,
} from '@/store';

export function useAuthViewModel() {
  const dispatch = useAppDispatch();
  const session = useAppSelector(state => state.auth.session);
  const bootstrapped = useAppSelector(state => state.auth.bootstrapped);
  const { authRepository } = getContainer();

  const loginAction = useCallback(
    async (email: string, password: string) => {
      const next = await authRepository.login(email, password);
      dispatch(setSession(next));
    },
    [authRepository, dispatch],
  );

  const registerAction = useCallback(
    async (email: string, password: string, name: string) => {
      await authRepository.register(email, password, name);
      const next = await authRepository.login(email, password);
      dispatch(setSession(next));
    },
    [authRepository, dispatch],
  );

  const logoutAction = useCallback(async () => {
    await authRepository.logout();
    dispatch(clearSession());
  }, [authRepository, dispatch]);

  const login = useAsyncAction(loginAction);
  const register = useAsyncAction(registerAction);
  const logout = useAsyncAction(logoutAction);

  return {
    session,
    bootstrapped,
    isAuthenticated: Boolean(session),
    login,
    register,
    logout,
  };
}
