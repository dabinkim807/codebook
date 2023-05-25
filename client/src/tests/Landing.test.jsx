import Landing from '../components/Landing';
import {expect, test} from 'vitest';
import {render, screen} from '@testing-library/react';

test('Landing renders correctly', () => {
  const { getByTestId } = render(<Landing />);
  const landingElement = getByTestId('landing');
  expect(landingElement).toBeDefined();
});