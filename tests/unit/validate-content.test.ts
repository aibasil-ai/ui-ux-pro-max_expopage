import { describe, expect, it } from 'vitest';

import { validateDatasets } from '../../scripts/validate-content.mjs';
import { validateUniqueSlugs } from '../../scripts/check-slugs.mjs';
import { validateProductReferences } from '../../scripts/check-links.mjs';

describe('content validation scripts', () => {
  it('驗證所有 generated dataset 的必要欄位', async () => {
    const results = await validateDatasets();
    expect(results).toHaveLength(9);
  });

  it('驗證所有 dataset 的 slug 唯一', async () => {
    const results = await validateUniqueSlugs();
    expect(results.every((item) => item.unique > 0)).toBe(true);
  });

  it('驗證產品對 style 與 landing 的關聯存在', async () => {
    const results = await validateProductReferences();
    expect(results).toHaveLength(96);
  });
});
