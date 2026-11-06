import { setActiveTab, uiReducer } from '@/store';

describe('uiSlice', () => {
  it('updates the active word list tab', () => {
    let state = uiReducer(undefined, { type: 'unknown' });
    expect(state.activeTab).toBe('list');

    state = uiReducer(state, setActiveTab('favorites'));
    expect(state.activeTab).toBe('favorites');

    state = uiReducer(state, setActiveTab('history'));
    expect(state.activeTab).toBe('history');
  });
});
