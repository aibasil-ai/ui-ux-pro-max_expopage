import { describe, expect, it } from 'vitest';

import { getProducts } from '../../src/lib/content/get-products';
import { getRecommendationBundlesForProduct } from '../../src/lib/recommendation/get-recommendations';
import { applyRecommendationMode } from '../../src/lib/recommendation/build-bundles';

describe('recommendation engine', () => {
  it('會為產品產出排序後的完整組合', async () => {
    const products = await getProducts();
    const product = products.find((item) => item.slug === 'saas-general');

    expect(product).toBeTruthy();

    const bundles = await getRecommendationBundlesForProduct(product!);
    expect(bundles.length).toBeGreaterThanOrEqual(3);
    expect(bundles[0].score).toBeGreaterThanOrEqual(bundles[1].score);
    expect(bundles.some((bundle) => bundle.style.title === 'Glassmorphism')).toBe(true);
  });

  it('會依模式回傳對應數量的組合', async () => {
    const products = await getProducts();
    const product = products.find((item) => item.slug === 'saas-general');
    const bundles = await getRecommendationBundlesForProduct(product!);

    expect(applyRecommendationMode(bundles, 'best')).toHaveLength(1);
    expect(applyRecommendationMode(bundles, 'curated').length).toBeLessThanOrEqual(3);
    expect(applyRecommendationMode(bundles, 'all').length).toBe(bundles.length);
  });
});
