import type { RecommendationBundle } from '../../lib/recommendation/build-bundles';
import RecommendationCard from './RecommendationCard';

interface Props {
  bundles: RecommendationBundle[];
}

export default function RecommendationGrid({ bundles }: Props) {
  if (bundles.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm leading-7 text-slate-500">
        目前這個篩選條件下沒有結果，請切換其他風格或改看全部瀏覽。
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {bundles.map((bundle) => (
        <RecommendationCard key={bundle.id} bundle={bundle} />
      ))}
    </div>
  );
}
