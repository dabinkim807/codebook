import Schedule from '../components/Schedule';
import {expect, test} from 'vitest';
import {render, screen} from '@testing-library/react';

test('Schedule renders correctly', () => {
  const { getByTestId } = render(<Schedule />);
  const scheduleElement = getByTestId('schedule');
  expect(scheduleElement).toBeDefined();
});