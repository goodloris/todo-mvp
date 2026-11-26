import type { Filter, Todo } from './types';

export const MAX_TITLE = 200;

export function normalizeTitle(title: string): string {
  return title.trim().slice(0, MAX_TITLE);
}

let counter = 0;
export function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  counter += 1;
  return Date.now().toString(36) + Math.random().toString(36).slice(2) + counter;
}

export function addTodo(todos: Todo[], title: string): Todo[] {
  const t = normalizeTitle(title);
  if (!t) return todos;
  return [...todos, { id: newId(), title: t, completed: false }];
}

export function toggleTodo(todos: Todo[], id: string): Todo[] {
  return todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
}

export function editTodo(todos: Todo[], id: string, title: string): Todo[] {
  const t = normalizeTitle(title);
  if (!t) return removeTodo(todos, id);
  return todos.map((x) => (x.id === id ? { ...x, title: t } : x));
}

export function removeTodo(todos: Todo[], id: string): Todo[] {
  return todos.filter((t) => t.id !== id);
}

export function toggleAll(todos: Todo[]): Todo[] {
  const target = todos.some((t) => !t.completed);
  return todos.map((t) => ({ ...t, completed: target }));
}

export function clearCompleted(todos: Todo[]): Todo[] {
  return todos.filter((t) => !t.completed);
}

export function filterTodos(todos: Todo[], filter: Filter): Todo[] {
  if (filter === 'active') return todos.filter((t) => !t.completed);
  if (filter === 'completed') return todos.filter((t) => t.completed);
  return todos;
}

export function remaining(todos: Todo[]): number {
  return todos.filter((t) => !t.completed).length;
}
