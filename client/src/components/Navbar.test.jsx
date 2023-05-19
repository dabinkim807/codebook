import MyNavBar from './Navbar';
import {expect, test} from 'vitest';
import {render, screen} from '@testing-library/react';

test('Navbar renders correctly', () => {
  const { getByTestId } = render(<MyNavBar />);
  const navbarElement = getByTestId('navbar');
  expect(navbarElement).toBeDefined();
});