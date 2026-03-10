import { describe, expect, it } from 'vitest';

import { getCharts } from '../../src/lib/content/get-charts';
import { getColors } from '../../src/lib/content/get-colors';
import { getProducts } from '../../src/lib/content/get-products';
import { getStyles } from '../../src/lib/content/get-styles';
import { getTypography } from '../../src/lib/content/get-typography';
import { getUiReasoning, getUxGuidelines, getWebInterfaceRules } from '../../src/lib/content/get-rules';

describe('content loaders', () => {
  it('會載入主要資料集', async () => {
    const [styles, colors, typography, charts, products, ux, reasoning, web] = await Promise.all([
      getStyles(),
      getColors(),
      getTypography(),
      getCharts(),
      getProducts(),
      getUxGuidelines(),
      getUiReasoning(),
      getWebInterfaceRules()
    ]);

    expect(styles).toHaveLength(67);
    expect(colors).toHaveLength(96);
    expect(typography).toHaveLength(57);
    expect(charts).toHaveLength(25);
    expect(products).toHaveLength(96);
    expect(ux).toHaveLength(99);
    expect(reasoning).toHaveLength(100);
    expect(web).toHaveLength(30);
  });
});
