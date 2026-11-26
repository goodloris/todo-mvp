import { useEffect, useState } from 'react';
import type { Todo } from '../types';
import { loadTodos, saveTodos } from '../storage';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);
  return [todos, setTodos] as const;
}
