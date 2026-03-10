import { buildPrompt } from '../prompt-builder';
import type { ColorRecord } from '../content/get-colors';
import type { LandingRecord } from '../content/get-landing';
import type { ProductRecord } from '../content/get-products';
import type { StyleRecord } from '../content/get-styles';
import type { TypographyRecord } from '../content/get-typography';
import type { GeneratedRecord } from '../content/load-generated';

export type RecommendationMode = 'best' | 'curated' | 'all';

export interface RecommendationBundle {
  id: string;
  score: number;
  label: string;
  reasons: string[];
  product: ProductRecord;
  style: StyleRecord;
  color: ColorRecord;
  typography: TypographyRecord;
  landing: LandingRecord | null;
  dashboardLabel: string | null;
  reasoning: GeneratedRecord | null;
  prompt: string;
}

export function buildRecommendationBundles(args: {
  product: ProductRecord;
  styleCandidates: Array<{ record: StyleRecord; score: number }>;
  colorCandidates: Array<{ record: ColorRecord; score: number }>;
  typographyCandidates: Array<{ record: TypographyRecord; score: number }>;
  landingCandidate: LandingRecord | null;
  reasoning: GeneratedRecord | null;
}) {
  const { product, styleCandidates, colorCandidates, typographyCandidates, landingCandidate, reasoning } = args;
  const colors = colorCandidates.length > 0 ? colorCandidates : [];
  const typographies = typographyCandidates.length > 0 ? typographyCandidates : [];

  return styleCandidates.map(({ record: style, score: styleScore }, index) => {
    const colorPick = colors[index % colors.length] ?? colors[0];
    const typographyPick = typographies[index % typographies.length] ?? typographies[0];
    const bundleScore = Number((styleScore + (colorPick?.score ?? 0.2) * 0.6 + (typographyPick?.score ?? 0.2) * 0.35).toFixed(4));
    const reasons = [
      `風格命中產品推薦：${style.title}`,
      colorPick ? `配色符合產品調性：${colorPick.record.title}` : '配色以預設中性方案補齊',
      typographyPick ? `字體氣質相符：${typographyPick.record.title}` : '字體以可讀性優先',
      landingCandidate ? `結構對應：${landingCandidate.title}` : '結構以清楚層級為主'
    ];

    const prompt = buildPrompt({
      product,
      style,
      color: colorPick.record,
      typography: typographyPick.record,
      landing: landingCandidate,
      dashboardLabel: product.raw['Dashboard Style (if applicable)'] || null,
      reasoning
    });

    return {
      id: `${product.slug}-${style.slug}-${colorPick.record.slug}-${typographyPick.record.slug}`,
      score: bundleScore,
      label: `${style.title} × ${colorPick.record.title} × ${typographyPick.record.title}`,
      reasons,
      product,
      style,
      color: colorPick.record,
      typography: typographyPick.record,
      landing: landingCandidate,
      dashboardLabel: product.raw['Dashboard Style (if applicable)'] || null,
      reasoning,
      prompt
    } satisfies RecommendationBundle;
  });
}

export function applyRecommendationMode(bundles: RecommendationBundle[], mode: RecommendationMode) {
  if (mode === 'best') {
    return bundles.slice(0, 1);
  }

  if (mode === 'curated') {
    return bundles.slice(0, 3);
  }

  return bundles;
}
