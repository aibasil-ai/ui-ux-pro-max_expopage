import type { RecommendationMode } from '../../lib/recommendation/build-bundles';

interface Props {
  value: RecommendationMode;
  onChange: (mode: RecommendationMode) => void;
}

const modes: Array<{ value: RecommendationMode; label: string }> = [
  { value: 'best', label: '最佳推薦' },
  { value: 'curated', label: '精選 3 組' },
  { value: 'all', label: '全部瀏覽' }
];

export default function ModeSwitcher({ value, onChange }: Props) {
  return (
    <div className="inline-flex flex-wrap gap-2" role="tablist" aria-label="推薦模式切換">
      {modes.map((mode) => {
        const active = mode.value === value;
        return (
          <button
            key={mode.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active ? 'bg-slate-950 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-slate-950'
            }`}
            onClick={() => onChange(mode.value)}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
