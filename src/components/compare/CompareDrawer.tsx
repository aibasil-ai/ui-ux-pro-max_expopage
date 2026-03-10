import { useEffect, useState } from 'react';

import { clearCompare, getCompareItems, subscribeCompare, type CompareItem } from './CompareStore';

export default function CompareDrawer() {
  const [items, setItems] = useState<CompareItem[]>([]);

  useEffect(() => {
    setItems(getCompareItems());
    return subscribeCompare(() => setItems(getCompareItems()));
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="fixed bottom-4 right-4 z-30 w-[340px] rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/15">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">比較清單</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">已選 {items.length} 個項目</h2>
        </div>
        <button type="button" className="text-sm text-slate-500" onClick={() => clearCompare()}>
          清空
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <a key={item.id} href={item.href} className="block rounded-[1.25rem] bg-slate-50 p-4 hover:bg-slate-100">
            <p className="text-xs text-slate-500">{item.dataset}</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{item.title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{item.summary}</p>
          </a>
        ))}
      </div>
    </aside>
  );
}
