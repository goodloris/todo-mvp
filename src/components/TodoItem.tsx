import { useRef, useState, type KeyboardEvent } from 'react';
import type { Todo } from '../types';
import { MAX_TITLE } from '../todos';

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onRemove: (id: string) => void;
};

export function TodoItem({ todo, onToggle, onEdit, onRemove }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const done = useRef(false);

  const start = () => {
    done.current = false;
    setDraft(todo.title);
    setEditing(true);
  };
  const save = () => {
    if (done.current) return;
    done.current = true;
    setEditing(false);
    onEdit(todo.id, draft);
  };
  const cancel = () => {
    done.current = true;
    setEditing(false);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') save();
    else if (e.key === 'Escape') cancel();
  };
  const onTitleKey = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === 'F2') start();
  };

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        aria-label={`${todo.completed ? '标记未完成' : '标记完成'}：${todo.title}`}
        onChange={() => onToggle(todo.id)}
      />
      {editing ? (
        <input
          className="edit"
          aria-label="编辑待办"
          value={draft}
          maxLength={MAX_TITLE}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={save}
        />
      ) : (
        <>
          <span
            className="title"
            tabIndex={0}
            onDoubleClick={start}
            onKeyDown={onTitleKey}
          >
            {todo.title}
          </span>
          <button type="button" aria-label={`编辑：${todo.title}`} onClick={start}>
            编辑
          </button>
          <button type="button" aria-label={`删除：${todo.title}`} onClick={() => onRemove(todo.id)}>
            删除
          </button>
        </>
      )}
    </li>
  );
}
