import Signup from '../components/Signup';
import {expect, test} from 'vitest';
import {render, screen} from '@testing-library/react';

test('Signup renders correctly', () => {
  const { getByTestId } = render(<Signup />);
  const signupElement = getByTestId('signup');
  expect(signupElement).toBeDefined();
});