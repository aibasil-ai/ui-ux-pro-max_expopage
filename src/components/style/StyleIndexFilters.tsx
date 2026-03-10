import { useMemo, useState } from 'react';

interface StyleItem {
  slug: string;
  title: string;
  category: string;
  summary?: string;
  accentMode: string;
  heroVariant: string;
  previewVariant: string;
  performance: string;
}

interface Props {
  items: StyleItem[];
}

function accentClasses(accentMode: string) {
  const map: Record<string, string> = {
    indigo: 'from-indigo-500/20 to-indigo-100',
    cyan: 'from-cyan-500/20 to-cyan-100',
    emerald: 'from-emerald-500/20 to-emerald-100',
    fuchsia: 'from-fuchsia-500/20 to-fuchsia-100',
    amber: 'from-amber-500/20 to-amber-100',
    mono: 'from-slate-500/10 to-slate-100',
    crimson: 'from-rose-500/20 to-rose-100'
  };
  return map[accentMode] ?? map.indigo;
}

export default function StyleIndexFilters({ items }: Props) {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  const categories = useMemo(() => ['all', ...new Set(items.map((item) => item.category))], [items]);
  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const categoryMatch = category === 'all' || item.category === category;
      const queryMatch =
        normalizedQuery.length === 0 ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        String(item.summary || '').toLowerCase().includes(normalizedQuery);
      return categoryMatch && queryMatch;
    });
  }, [items, category, query]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-950/5 lg:grid-cols-[220px_1fr_auto] lg:items-end">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          類型
          <select
            aria-label="風格類型"
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((option) => (
              <option key={option} value={option}>
                {option === 'all' ? '全部' : option}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          搜尋
          <input
            aria-label="搜尋風格"
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900"
            placeholder="搜尋風格名稱或摘要"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">{visibleItems.length} 個結果</div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((item) => (
          <a
            key={item.slug}
            href={`/styles/${item.slug}`}
            className="group block rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-950/5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-950/10"
          >
            <div className={`rounded-[1.5rem] border border-slate-200 bg-gradient-to-br ${accentClasses(item.accentMode)} p-5`}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.category}</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{item.summary}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1">{item.heroVariant}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{item.previewVariant}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{item.performance}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
