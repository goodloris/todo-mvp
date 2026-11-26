import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

beforeEach(() => {
  localStorage.clear();
  history.replaceState(null, '', '#/all');
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
