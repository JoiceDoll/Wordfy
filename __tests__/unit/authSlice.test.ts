import {
  authReducer,
  clearSession,
  setBootstrapped,
  setSession,
} from '@/store';

describe('authSlice', () => {
  it('stores session and bootstrapped flags', () => {
    let state = authReducer(undefined, { type: 'unknown' });
    expect(state.session).toBeNull();
    expect(state.bootstrapped).toBe(false);

    state = authReducer(
      state,
      setSession({
        userId: 'u1',
        email: 'a@b.com',
        name: 'Ana',
        token: 't1',
      }),
    );
    expect(state.session?.email).toBe('a@b.com');
    expect(state.session?.name).toBe('Ana');

    state = authReducer(state, setBootstrapped(true));
    expect(state.bootstrapped).toBe(true);

    state = authReducer(state, clearSession());
    expect(state.session).toBeNull();
  });
});
