import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AuthSession } from '@/domain';

type AuthState = {
  session: AuthSession | null;
  bootstrapped: boolean;
};

const initialState: AuthState = {
  session: null,
  bootstrapped: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<AuthSession | null>) {
      state.session = action.payload;
    },
    setBootstrapped(state, action: PayloadAction<boolean>) {
      state.bootstrapped = action.payload;
    },
    clearSession(state) {
      state.session = null;
    },
  },
});

export const { setSession, setBootstrapped, clearSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
