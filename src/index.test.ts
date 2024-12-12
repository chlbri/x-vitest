import { expect, test } from 'vitest';
import todo from './index';

test('todo', () => {
  expect(todo()).toBe('todo');
});
