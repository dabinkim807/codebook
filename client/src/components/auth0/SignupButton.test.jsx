import SignupButton from './SignupButton';
import {expect, test} from 'vitest';
import {render, screen} from '@testing-library/react';

test('SignupButton renders correctly', () => {
  const { getByTestId } = render(<SignupButton />);
  const signupElement = getByTestId('signup');
  expect(signupElement).toBeDefined();
});