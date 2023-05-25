import LoginButton from '../components/auth0/LoginButton';
import {expect, test} from 'vitest';
import {render, screen} from '@testing-library/react';

test('LoginButton renders correctly', () => {
  const { getByTestId } = render(<LoginButton />);
  const loginElement = getByTestId('login');
  expect(loginElement).toBeDefined();
});