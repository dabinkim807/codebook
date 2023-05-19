import Profile from './Profile';
import {expect, test} from 'vitest';
import {render, screen} from '@testing-library/react';

test('Profile renders correctly', () => {
  const { getByTestId } = render(<Profile />);
  const profileElement = getByTestId('profile');
  expect(profileElement).toBeDefined();
});