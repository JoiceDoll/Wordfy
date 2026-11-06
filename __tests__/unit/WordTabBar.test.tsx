import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { WordTabBar } from '@/features/words/components';
import { ThemeProvider } from '@/theme';

describe('WordTabBar', () => {
  it('notifies tab changes', async () => {
    const onChange = jest.fn();
    await render(
      <ThemeProvider storage={null}>
        <WordTabBar activeTab="list" onChange={onChange} />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByText('Favoritos'));
    expect(onChange).toHaveBeenCalledWith('favorites');
  });
});
