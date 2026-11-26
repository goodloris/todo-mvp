import type { Todo } from './types';
import { MAX_TITLE } from './todos';

export const STORAGE_KEY = 'todo-mvp:items';

export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const result: Todo[] = [];
    for (const item of data) {
      if (
        item &&
        typeof item === 'object' &&
        typeof (item as Todo).id === 'string' &&
        (item as Todo).id !== '' &&
        typeof (item as Todo).title === 'string' &&
        typeof (item as Todo).completed === 'boolean'
      ) {
        const { id, title, completed } = item as Todo;
        result.push({ id, title: title.slice(0, MAX_TITLE), completed });
      }
    }
    return result;
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // ignore quota / disabled storage
  }
}
