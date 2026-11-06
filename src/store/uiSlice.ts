import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { WordListTab } from '@/domain';

type UiState = {
  activeTab: WordListTab;
};

const initialState: UiState = {
  activeTab: 'list',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<WordListTab>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
