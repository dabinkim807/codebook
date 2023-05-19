import LogoutButton from './LogoutButton';
import {expect, test} from 'vitest';
import {render, screen} from '@testing-library/react';

test('LogoutButton renders correctly', () => {
  const { getByTestId } = render(<LogoutButton />);
  const logoutElement = getByTestId('logout');
  expect(logoutElement).toBeDefined();
});