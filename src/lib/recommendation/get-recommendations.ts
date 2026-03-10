import { getColors, type ColorRecord } from '../content/get-colors';
import { getLandingPatterns, type LandingRecord } from '../content/get-landing';
import { getProducts, type ProductRecord } from '../content/get-products';
import { getStyles, type StyleRecord } from '../content/get-styles';
import { getTypography, type TypographyRecord } from '../content/get-typography';
import { getUiReasoning } from '../content/get-rules';
import type { GeneratedRecord } from '../content/load-generated';
import { buildRecommendationBundles, type RecommendationBundle } from './build-bundles';
import { scorePhraseMatch, tokenizeText } from './score-product-fit';

function splitHints(value: string) {
  return String(value || '')
    .split(/,|\+|\||;/g)
    .map((part) => part.trim())
    .filter(Boolean);
}

function rankRecords<T extends { title: string; summary?: string; category: string; tags: string[]; raw: Record<string, string> }>(
  records: T[],
  hints: string[],
  extraFields: string[] = [],
  limit = 6
) {
  return records
    .map((record) => {
      const corpus = [record.title, record.summary || '', record.category, ...record.tags, ...extraFields.map((field) => record.raw[field] || '')]
        .join(' ')
        .trim();

      const score = hints.reduce((max, hint) => Math.max(max, scorePhraseMatch(hint, corpus)), 0);
      return { record, score };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

function findDirectStyleMatches(styles: StyleRecord[], hints: string[]) {
  const explodedHints = uniqueNonEmpty(hints.flatMap((hint) => splitHints(hint).concat(hint)));

  return styles
    .map((record) => ({
      record,
      score: explodedHints.reduce((max, hint) => Math.max(max, scorePhraseMatch(hint, record.title)), 0)
    }))
    .filter((item) => item.score >= 1.2)
    .sort((left, right) => right.score - left.score);
}

function uniqueById<T extends { record: { id: string }; score: number }>(items: T[]) {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    if (seen.has(item.record.id)) {
      continue;
    }
    seen.add(item.record.id);
    result.push(item);
  }

  return result;
}

function pickLanding(product: ProductRecord, landingPatterns: LandingRecord[]) {
  const hint = product.raw['Landing Page Pattern'];
  if (!hint || /^N\/A/i.test(hint)) {
    return null;
  }

  const ranked = rankRecords(landingPatterns, [hint, product.title], ['Keywords', 'Section Order', 'Conversion Optimization'], 1);
  return ranked[0]?.record ?? null;
}

function pickReasoning(product: ProductRecord, reasoningRecords: GeneratedRecord[]) {
  return reasoningRecords.find((record) => record.title === product.title) ?? null;
}

function buildStyleHints(product: ProductRecord, reasoning: GeneratedRecord | null) {
  return uniqueNonEmpty([
    product.raw['Primary Style Recommendation'],
    ...splitHints(product.raw['Secondary Styles']),
    reasoning?.raw?.['Style_Priority'],
    product.raw['Dashboard Style (if applicable)']
  ]);
}

function buildColorHints(product: ProductRecord, reasoning: GeneratedRecord | null) {
  return uniqueNonEmpty([
    product.title,
    product.raw['Color Palette Focus'],
    reasoning?.raw?.['Color_Mood'],
    product.summary,
    ...tokenizeText(product.raw['Keywords'] || '').slice(0, 4)
  ]);
}

function buildTypographyHints(product: ProductRecord, reasoning: GeneratedRecord | null, styles: StyleRecord[]) {
  return uniqueNonEmpty([
    reasoning?.raw?.['Typography_Mood'],
    ...styles.slice(0, 3).map((style) => style.title),
    product.summary,
    product.raw['Key Considerations']
  ]);
}

function uniqueNonEmpty(values: Array<string | undefined | null>) {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))];
}

export async function getRecommendationBundlesForProduct(product: ProductRecord) {
  const [styles, colors, typography, landingPatterns, reasoningRecords] = await Promise.all([
    getStyles(),
    getColors(),
    getTypography(),
    getLandingPatterns(),
    getUiReasoning()
  ]);

  const reasoning = pickReasoning(product, reasoningRecords);
  const styleHints = buildStyleHints(product, reasoning);
  const styleCandidates = uniqueById([
    ...findDirectStyleMatches(styles, styleHints),
    ...rankRecords(styles, styleHints, ['Keywords', 'Best For', 'AI Prompt Keywords', 'Type'], 8)
  ]).slice(0, 8);
  const colorCandidates = uniqueById(
    rankRecords(colors, buildColorHints(product, reasoning), ['Notes', 'Product Type'], 6)
  );
  const typographyCandidates = uniqueById(
    rankRecords(typography, buildTypographyHints(product, reasoning, styleCandidates.map((item) => item.record)), ['Mood/Style Keywords', 'Best For', 'Heading Font', 'Body Font'], 6)
  );
  const landingCandidate = pickLanding(product, landingPatterns);

  const bundles = buildRecommendationBundles({
    product,
    styleCandidates,
    colorCandidates,
    typographyCandidates,
    landingCandidate,
    reasoning
  }).sort((left, right) => right.score - left.score);

  return bundles;
}


export async function getRecommendationPageData(productSlug: string) {
  const products = await getProducts();
  const product = products.find((item) => item.slug === productSlug);
  if (!product) {
    return null;
  }

  const bundles = await getRecommendationBundlesForProduct(product);
  return {
    product,
    bundles
  };
}
