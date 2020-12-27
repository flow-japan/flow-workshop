import * as React from 'react';
import { render } from 'react-dom';

import SendTransaction from '../src/components/SendTransaction';

let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  render(<SendTransaction />, container);
});

it('contain the word transaction.', () => {
  expect(container.textContent).toEqual(expect.stringContaining('transaction'));
});
