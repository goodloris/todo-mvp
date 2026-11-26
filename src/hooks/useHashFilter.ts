import { useEffect, useState } from 'react';
import type { Filter } from '../types';

function parse(): Filter {
  const h = window.location.hash;
  if (h === '#/active') return 'active';
  if (h === '#/completed') return 'completed';
  return 'all';
}

export function useHashFilter(): Filter {
  const [filter, setFilter] = useState<Filter>(parse);
  useEffect(() => {
    const f = parse();
    if (window.location.hash !== `#/${f}`) {
      history.replaceState(null, '', `#/${f}`);
    }
    const onChange = () => setFilter(parse());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return filter;
}
