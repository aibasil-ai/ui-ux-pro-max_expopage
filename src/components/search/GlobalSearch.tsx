import { useEffect, useMemo, useState } from 'react';

import { filterSearchIndex, loadSearchIndex, type SearchItem } from './search-index';

export default function GlobalSearch() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    function onKeydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, []);

  useEffect(() => {
    if (!open || loaded) {
      return;
    }
    loadSearchIndex()
      .then((data) => {
        setItems(data);
        setLoaded(true);
      })
      .catch(() => {
        setItems([]);
        setLoaded(true);
      });
  }, [open, loaded]);

  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  const results = useMemo(() => filterSearchIndex(items, query), [items, query]);
  const emptyMessage = query.trim() ? '找不到符合的結果，試試產品類型、風格名稱或規則關鍵字。' : '輸入關鍵字開始搜尋。';

  return (
    <div data-testid="global-search" data-ready={ready ? 'true' : 'false'}>
      <button
        type="button"
        aria-label="開啟全站搜尋"
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-950"
        onClick={() => setOpen(true)}
      >
        搜尋 ⌘K
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="container-shell pt-24" onClick={(event) => event.stopPropagation()}>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/20">
              <div className="flex items-center justify-between gap-4">
                <input
                  aria-label="全站搜尋"
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜尋風格、產品、配色、字體、圖表、規則…"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base text-slate-900"
                />
                <button type="button" className="text-sm text-slate-500" onClick={() => setOpen(false)}>
                  關閉
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {results.length === 0 ? (
                  <div className="rounded-[1.5rem] bg-slate-50 p-5 text-sm leading-7 text-slate-500">{emptyMessage}</div>
                ) : (
                  results.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      className="block rounded-[1.5rem] border border-slate-200 bg-white p-4 hover:border-slate-950"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1">{item.dataset}</span>
                        <span>{item.category}</span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-slate-950">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
