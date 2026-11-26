import { useState, type FormEvent } from 'react';
import { MAX_TITLE, normalizeTitle } from '../todos';

export function TodoForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [value, setValue] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!normalizeTitle(value)) return;
    onAdd(value);
    setValue('');
  };
  return (
    <form className="todo-form" onSubmit={submit}>
      <label htmlFor="new-todo" className="visually-hidden">
        新增待办
      </label>
      <input
        id="new-todo"
        type="text"
        value={value}
        maxLength={MAX_TITLE}
        placeholder="需要做什么？"
        autoComplete="off"
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">添加</button>
    </form>
  );
}
