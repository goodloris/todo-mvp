import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { STORAGE_KEY } from './storage';

async function add(user: ReturnType<typeof userEvent.setup>, title: string) {
  await user.type(screen.getByLabelText('新增待办'), `${title}{Enter}`);
}

describe('F1 add', () => {
  it('Enter adds, trims and clears input', async () => {
    const user = userEvent.setup();
    render(<App />);
    await add(user, '  买牛奶  ');
    expect(screen.getByText('买牛奶')).toBeInTheDocument();
    expect(screen.getByLabelText('新增待办')).toHaveValue('');
  });
  it('button adds', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('新增待办'), 'a');
    await user.click(screen.getByRole('button', { name: '添加' }));
    expect(screen.getByText('a')).toBeInTheDocument();
  });
  it('blank is ignored; maxLength 200', async () => {
    const user = userEvent.setup();
    render(<App />);
    await add(user, '   ');
    expect(screen.queryByRole('listitem')).toBeNull();
    expect(screen.getByLabelText('新增待办')).toHaveAttribute('maxLength', '200');
  });
});

describe('F2 toggle', () => {
  it('toggles and marks completed', async () => {
    const user = userEvent.setup();
    render(<App />);
    await add(user, 'a');
    await user.click(screen.getByRole('checkbox', { name: '标记完成：a' }));
    expect(screen.getByRole('checkbox', { name: '标记未完成：a' })).toBeChecked();
    expect(screen.getByRole('listitem')).toHaveClass('completed');
    await user.click(screen.getByRole('checkbox', { name: '标记未完成：a' }));
    expect(screen.getByRole('listitem')).not.toHaveClass('completed');
  });
});

describe('F3 edit', () => {
  async function setup() {
    const user = userEvent.setup();
    render(<App />);
    await add(user, 'old');
    await user.dblClick(screen.getByText('old'));
    return user;
  }
  it('double click shows original, Enter saves', async () => {
    const user = await setup();
    const input = screen.getByLabelText('编辑待办');
    expect(input).toHaveValue('old');
    await user.clear(input);
    await user.type(input, 'new{Enter}');
    expect(screen.getByText('new')).toBeInTheDocument();
  });
  it('blur saves', async () => {
    const user = await setup();
    const input = screen.getByLabelText('编辑待办');
    await user.clear(input);
    await user.type(input, 'blurred');
    await user.tab();
    expect(screen.getByText('blurred')).toBeInTheDocument();
  });
  it('Esc cancels and does not save', async () => {
    const user = await setup();
    await user.type(screen.getByLabelText('编辑待办'), 'zzz{Escape}');
    expect(screen.getByText('old')).toBeInTheDocument();
    expect(screen.queryByText('oldzzz')).toBeNull();
  });
  it('blank deletes', async () => {
    const user = await setup();
    await user.clear(screen.getByLabelText('编辑待办'));
    await user.keyboard('{Enter}');
    expect(screen.queryByRole('listitem')).toBeNull();
  });
  it('edit button is a keyboard entry', async () => {
    const user = userEvent.setup();
    render(<App />);
    await add(user, 'k');
    await user.click(screen.getByRole('button', { name: '编辑：k' }));
    expect(screen.getByLabelText('编辑待办')).toHaveFocus();
  });
});

describe('F4 delete', () => {
  it('removes item', async () => {
    const user = userEvent.setup();
    render(<App />);
    await add(user, 'a');
    await user.click(screen.getByRole('button', { name: '删除：a' }));
    expect(screen.queryByText('a')).toBeNull();
  });
});

describe('F5 filter', () => {
  async function seed() {
    const user = userEvent.setup();
    render(<App />);
    await add(user, 'a');
    await add(user, 'b');
    await user.click(screen.getByRole('checkbox', { name: '标记完成：b' }));
    return user;
  }
  it('filters, highlights and updates hash', async () => {
    const user = await seed();
    await user.click(screen.getByRole('link', { name: '未完成' }));
    await act(async () => {});
    expect(window.location.hash).toBe('#/active');
    expect(screen.getByRole('link', { name: '未完成' })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByText('b')).toBeNull();
    expect(screen.getByText('a')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: '已完成' }));
    expect(screen.queryByText('a')).toBeNull();
    expect(screen.getByText('b')).toBeInTheDocument();
  });
  it('keeps hash on mount', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: '1', title: 'x', completed: true },
        { id: '2', title: 'y', completed: false },
      ]),
    );
    history.replaceState(null, '', '#/completed');
    render(<App />);
    expect(screen.getByRole('link', { name: '已完成' })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByText('y')).toBeNull();
  });
  it('unknown hash falls back to #/all', () => {
    history.replaceState(null, '', '#/bogus');
    render(<App />);
    expect(window.location.hash).toBe('#/all');
  });
  it('follows hashchange', async () => {
    await seed();
    act(() => {
      history.replaceState(null, '', '#/completed');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.queryByText('a')).toBeNull();
  });
  it('filtered-empty shows distinct text', async () => {
    const user = userEvent.setup();
    render(<App />);
    await add(user, 'a');
    await user.click(screen.getByRole('link', { name: '已完成' }));
    expect(screen.getByText('没有已完成的事项')).toBeInTheDocument();
  });
});

describe('F6 bulk', () => {
  it('toggle all and clear completed', async () => {
    const user = userEvent.setup();
    render(<App />);
    await add(user, 'a');
    await add(user, 'b');
    expect(screen.queryByRole('button', { name: '清除已完成' })).toBeNull();
    await user.click(screen.getByRole('button', { name: '全部标记完成' }));
    expect(screen.getAllByRole('checkbox').every((c) => (c as HTMLInputElement).checked)).toBe(true);
    await user.click(screen.getByRole('button', { name: '全部标记未完成' }));
    expect(screen.getAllByRole('checkbox').some((c) => (c as HTMLInputElement).checked)).toBe(false);
    await user.click(screen.getByRole('checkbox', { name: '标记完成：a' }));
    await user.click(screen.getByRole('button', { name: '清除已完成' }));
    expect(screen.queryByText('a')).toBeNull();
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '清除已完成' })).toBeNull();
  });
  it('toggle all applies to all items under a filter', async () => {
    const user = userEvent.setup();
    render(<App />);
    await add(user, 'a');
    await user.click(screen.getByRole('link', { name: '未完成' }));
    await user.click(screen.getByRole('button', { name: '全部标记完成' }));
    await user.click(screen.getByRole('link', { name: '全部' }));
    expect(screen.getByRole('checkbox', { name: '标记未完成：a' })).toBeChecked();
  });
});

describe('F7 count', () => {
  it('shows remaining', async () => {
    const user = userEvent.setup();
    render(<App />);
    await add(user, 'a');
    await add(user, 'b');
    expect(screen.getByRole('status')).toHaveTextContent('剩余 2 项');
    await user.click(screen.getByRole('checkbox', { name: '标记完成：a' }));
    expect(screen.getByRole('status')).toHaveTextContent('剩余 1 项');
    await user.click(screen.getByRole('button', { name: '全部标记完成' }));
    expect(screen.getByRole('status')).toHaveTextContent('剩余 0 项');
  });
});

describe('F8 persistence', () => {
  it('persists and restores', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await add(user, 'keep');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)[0].title).toBe('keep');
    unmount();
    render(<App />);
    expect(screen.getByText('keep')).toBeInTheDocument();
  });
  it('corrupt data starts empty without error', () => {
    localStorage.setItem(STORAGE_KEY, '{{{not json');
    render(<App />);
    expect(screen.getByText('还没有待办事项，添加一条吧')).toBeInTheDocument();
  });
});

describe('F9 empty state', () => {
  it('shows hint with no items and hides footer', () => {
    render(<App />);
    expect(screen.getByText('还没有待办事项，添加一条吧')).toBeInTheDocument();
    expect(within(document.body).queryByRole('navigation')).toBeNull();
  });
});
