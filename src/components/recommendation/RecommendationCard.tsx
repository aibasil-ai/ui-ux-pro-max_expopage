import { getCategoryIdForProductTitle } from '../../lib/product-taxonomy';
import type { RecommendationBundle } from '../../lib/recommendation/build-bundles';
import CompareButton from '../compare/CompareButton';
import FavoriteButton from '../favorites/FavoriteButton';
import CopyPromptButton from './CopyPromptButton';

interface Props {
  bundle: RecommendationBundle;
}

export default function RecommendationCard({ bundle }: Props) {
  const palette = bundle.color.palette || {
    primary: bundle.color.raw['Primary (Hex)'],
    secondary: bundle.color.raw['Secondary (Hex)'],
    cta: bundle.color.raw['CTA (Hex)'],
    background: bundle.color.raw['Background (Hex)'],
    text: bundle.color.raw['Text (Hex)']
  };
  const categoryId = getCategoryIdForProductTitle(bundle.product.title) ?? 'software-saas';
  const productHref = `/products/${categoryId}/${bundle.product.slug}`;

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-950/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
            適配分數 {(bundle.score * 100).toFixed(0)}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{bundle.style.category}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FavoriteButton
            item={{
              id: `bundle:${bundle.id}`,
              title: bundle.label,
              href: productHref,
              dataset: '推薦組合'
            }}
          />
          <CompareButton
            item={{
              id: `bundle:${bundle.id}`,
              title: bundle.label,
              href: productHref,
              dataset: '推薦組合',
              summary: bundle.reasons.join(' / ')
            }}
          />
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-slate-200">
        <div
          className="grid min-h-[188px] grid-cols-[1.2fr_0.8fr]"
          style={{ background: `linear-gradient(135deg, ${palette.background} 0%, ${palette.secondary}22 100%)` }}
        >
          <div className="flex flex-col justify-between gap-5 p-5" style={{ color: palette.text }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-70">{bundle.product.title}</p>
              <h3 className="mt-3 text-2xl font-semibold">{bundle.style.title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 opacity-80">{bundle.style.summary}</p>
            </div>
            <div className="flex gap-2">
              <span className="h-3 w-12 rounded-full" style={{ backgroundColor: palette.primary }} />
              <span className="h-3 w-12 rounded-full" style={{ backgroundColor: palette.secondary }} />
              <span className="h-3 w-12 rounded-full" style={{ backgroundColor: palette.cta }} />
            </div>
          </div>
          <div className="flex flex-col justify-between border-l border-white/30 p-5" style={{ backgroundColor: `${palette.primary}12` }}>
            <div className="rounded-2xl border border-white/50 bg-white/60 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Typography</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{bundle.typography.title}</p>
              <p className="mt-1 text-sm text-slate-600">{bundle.typography.raw['Heading Font']} / {bundle.typography.raw['Body Font']}</p>
            </div>
            <div className="rounded-2xl p-4" style={{ backgroundColor: palette.cta, color: '#fff' }}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">CTA</p>
              <p className="mt-2 text-sm font-semibold">Start Free Trial</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h4 className="text-lg font-semibold text-slate-950">{bundle.label}</h4>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {bundle.reasons.map((reason) => (
              <li key={reason}>• {reason}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <a href={`/styles/${bundle.style.slug}`} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:border-slate-950 hover:text-slate-950">看風格頁</a>
            <a href={`/colors/${bundle.color.slug}`} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:border-slate-950 hover:text-slate-950">看配色頁</a>
            <a href={`/typography/${bundle.typography.slug}`} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:border-slate-950 hover:text-slate-950">看字體頁</a>
            {bundle.reasoning && (
              <a href={`/rules/reasoning/${bundle.reasoning.slug}`} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:border-slate-950 hover:text-slate-950">對應推理規則</a>
            )}
          </div>
        </div>
        <dl className="grid gap-3 rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-600">
          <div>
            <dt className="font-semibold text-slate-900">Landing Pattern</dt>
            <dd className="mt-1">{bundle.landing?.title ?? '以清楚 CTA 與段落節奏為主'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Dashboard Direction</dt>
            <dd className="mt-1">{bundle.dashboardLabel ?? '不強制加入儀表板區塊'}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-5 rounded-[1.5rem] bg-slate-950 p-5 text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-base font-semibold">Prompt 建議</h4>
          <CopyPromptButton prompt={bundle.prompt} />
        </div>
        <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">{bundle.prompt}</pre>
      </div>
    </article>
  );
}
