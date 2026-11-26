import { useTodos } from './hooks/useTodos';
import { useHashFilter } from './hooks/useHashFilter';
import {
  addTodo,
  clearCompleted,
  editTodo,
  filterTodos,
  remaining,
  removeTodo,
  toggleAll,
  toggleTodo,
} from './todos';
import { TodoForm } from './components/TodoForm';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';

export default function App() {
  const [todos, setTodos] = useTodos();
  const filter = useHashFilter();
  const visible = filterTodos(todos, filter);
  const allDone = todos.length > 0 && todos.every((t) => t.completed);
  const emptyText =
    filter === 'active' ? '没有未完成的事项' : filter === 'completed' ? '没有已完成的事项' : '';

  return (
    <main className="app">
      <h1>待办事项</h1>
      <TodoForm onAdd={(title) => setTodos((l) => addTodo(l, title))} />
      {todos.length === 0 ? (
        <p className="empty">还没有待办事项，添加一条吧</p>
      ) : (
        <>
          <button type="button" className="toggle-all" onClick={() => setTodos(toggleAll)}>
            {allDone ? '全部标记未完成' : '全部标记完成'}
          </button>
          {visible.length === 0 ? (
            <p className="empty">{emptyText}</p>
          ) : (
            <ul className="todo-list">
              {visible.map((t) => (
                <TodoItem
                  key={t.id}
                  todo={t}
                  onToggle={(id) => setTodos((l) => toggleTodo(l, id))}
                  onEdit={(id, title) => setTodos((l) => editTodo(l, id, title))}
                  onRemove={(id) => setTodos((l) => removeTodo(l, id))}
                />
              ))}
            </ul>
          )}
          <Footer
            remaining={remaining(todos)}
            filter={filter}
            hasCompleted={todos.some((t) => t.completed)}
            onClearCompleted={() => setTodos(clearCompleted)}
          />
        </>
      )}
    </main>
  );
}
