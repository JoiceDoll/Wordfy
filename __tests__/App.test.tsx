import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('@/app', () => {
  const ReactLocal = require('react');
  const { Text } = require('react-native');
  return {
    AppProviders: () => ReactLocal.createElement(Text, null, 'WordfyApp'),
  };
});

import App from '../App';

test('renders AppProviders root', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<App />);
  });
  expect(tree!.toJSON()).toBeTruthy();
});
