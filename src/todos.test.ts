import { addTodo, clearCompleted, editTodo, filterTodos, remaining, toggleAll } from './todos';
import { loadTodos, saveTodos, STORAGE_KEY } from './storage';

describe('todos', () => {
  it('trims, ignores blank, truncates to 200', () => {
    expect(addTodo([], '  a  ')[0].title).toBe('a');
    expect(addTodo([], ' \t\u3000 ')).toEqual([]);
    expect(addTodo([], 'x'.repeat(300))[0].title).toHaveLength(200);
  });
  it('edit to blank removes', () => {
    const l = addTodo([], 'a');
    expect(editTodo(l, l[0].id, '  ')).toEqual([]);
  });
  it('toggleAll / clearCompleted / filter / remaining', () => {
    let l = addTodo(addTodo([], 'a'), 'b');
    l = toggleAll(l);
    expect(l.every((t) => t.completed)).toBe(true);
    expect(toggleAll(l).every((t) => !t.completed)).toBe(true);
    expect(remaining(l)).toBe(0);
    expect(filterTodos(l, 'completed')).toHaveLength(2);
    expect(filterTodos(l, 'active')).toHaveLength(0);
    expect(clearCompleted(l)).toEqual([]);
  });
});

describe('storage', () => {
  it('round trips', () => {
    const l = addTodo([], 'a');
    saveTodos(l);
    expect(loadTodos()).toEqual(l);
  });
  it('invalid JSON / non-array -> []', () => {
    localStorage.setItem(STORAGE_KEY, '{bad');
    expect(loadTodos()).toEqual([]);
    localStorage.setItem(STORAGE_KEY, '{"a":1}');
    expect(loadTodos()).toEqual([]);
  });
  it('filters invalid elements', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: '1', title: 'ok', completed: false }, { id: 2 }, null, 'x']),
    );
    expect(loadTodos()).toHaveLength(1);
  });
  it('does not throw when storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('x');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('x');
    });
    expect(loadTodos()).toEqual([]);
    expect(() => saveTodos([])).not.toThrow();
  });
});
