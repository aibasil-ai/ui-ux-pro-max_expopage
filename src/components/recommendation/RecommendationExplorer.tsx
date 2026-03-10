import { useEffect, useMemo, useState } from 'react';

import { applyRecommendationMode, type RecommendationBundle, type RecommendationMode } from '../../lib/recommendation/build-bundles';
import ModeSwitcher from './ModeSwitcher';
import RecommendationGrid from './RecommendationGrid';
import StyleFilter from './StyleFilter';

interface Props {
  bundles: RecommendationBundle[];
}

export default function RecommendationExplorer({ bundles }: Props) {
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<RecommendationMode>('curated');
  const [styleFilter, setStyleFilter] = useState('all');

  useEffect(() => {
    setReady(true);
  }, []);

  const styleOptions = useMemo(
    () => [...new Set(bundles.map((bundle) => bundle.style.title))],
    [bundles]
  );

  const visibleBundles = useMemo(() => {
    const modeBundles = applyRecommendationMode(bundles, mode);
    if (styleFilter === 'all') {
      return modeBundles;
    }
    return modeBundles.filter((bundle) => bundle.style.title === styleFilter);
  }, [bundles, mode, styleFilter]);

  return (
    <div className="space-y-6" data-testid="recommendation-explorer" data-ready={ready ? 'true' : 'false'}>
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-950/5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">推薦模式</p>
          <ModeSwitcher value={mode} onChange={setMode} />
        </div>
        <div className="lg:w-[280px]">
          <StyleFilter value={styleFilter} options={styleOptions} onChange={setStyleFilter} />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <p>
          目前顯示 <span className="font-semibold text-slate-900">{visibleBundles.length}</span> 組推薦
        </p>
        <p>預設依「最適合此產品」排序</p>
      </div>

      <RecommendationGrid bundles={visibleBundles} />
    </div>
  );
}
