import { describe, expect, it } from 'vitest';

import { getProducts } from '../../src/lib/content/get-products';
import { buildProductTaxonomy } from '../../src/lib/product-taxonomy';

describe('product taxonomy', () => {
  it('把所有產品分配到大類且無遺漏', async () => {
    const products = await getProducts();
    const groups = buildProductTaxonomy(products);
    const total = groups.reduce((sum, group) => sum + group.products.length, 0);

    expect(groups).toHaveLength(10);
    expect(total).toBe(96);
    expect(groups.every((group) => group.products.length > 0)).toBe(true);
  });
});
