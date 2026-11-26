import type { Filter } from '../types';

const LINKS: { f: Filter; label: string }[] = [
  { f: 'all', label: '全部' },
  { f: 'active', label: '未完成' },
  { f: 'completed', label: '已完成' },
];

type Props = {
  remaining: number;
  filter: Filter;
  hasCompleted: boolean;
  onClearCompleted: () => void;
};

export function Footer({ remaining, filter, hasCompleted, onClearCompleted }: Props) {
  return (
    <footer className="footer">
      <span role="status" aria-live="polite">
        剩余 {remaining} 项
      </span>
      <nav aria-label="筛选">
        {LINKS.map(({ f, label }) => (
          <a
            key={f}
            href={`#/${f}`}
            className={filter === f ? 'selected' : undefined}
            aria-current={filter === f ? 'page' : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
      {hasCompleted && (
        <button type="button" onClick={onClearCompleted}>
          清除已完成
        </button>
      )}
    </footer>
  );
}
