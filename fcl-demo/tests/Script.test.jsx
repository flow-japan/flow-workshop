import * as React from 'react';
import { render } from 'react-dom';
import Script from '../src/components/Script';

let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

it('renders with or without a name', () => {
  render(<Script />, container);
  expect(container.textContent).toEqual(expect.stringContaining('Run script'));
});
