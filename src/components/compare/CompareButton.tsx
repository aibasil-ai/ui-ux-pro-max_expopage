import { useEffect, useState } from 'react';

import { isCompared, subscribeCompare, toggleCompare, type CompareItem } from './CompareStore';

interface Props {
  item: CompareItem;
}

export default function CompareButton({ item }: Props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isCompared(item.id));
    return subscribeCompare(() => setActive(isCompared(item.id)));
  }, [item.id]);

  return (
    <button
      type="button"
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm font-semibold ${active ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'}`}
      onClick={() => setActive(toggleCompare(item))}
    >
      {active ? '已加入比較' : '加入比較'}
    </button>
  );
}
