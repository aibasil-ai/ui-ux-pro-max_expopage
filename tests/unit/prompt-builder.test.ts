import { describe, expect, it } from 'vitest';

import { buildPrompt } from '../../src/lib/prompt-builder';
import { getColors } from '../../src/lib/content/get-colors';
import { getLandingPatterns } from '../../src/lib/content/get-landing';
import { getProducts } from '../../src/lib/content/get-products';
import { getStyles } from '../../src/lib/content/get-styles';
import { getTypography } from '../../src/lib/content/get-typography';
import { getUiReasoning } from '../../src/lib/content/get-rules';

describe('prompt builder', () => {
  it('會把產品、風格、配色與字體組成可複製 prompt', async () => {
    const [products, styles, colors, typography, landing, reasoning] = await Promise.all([
      getProducts(),
      getStyles(),
      getColors(),
      getTypography(),
      getLandingPatterns(),
      getUiReasoning()
    ]);

    const product = products.find((item) => item.slug === 'saas-general');
    const style = styles.find((item) => item.title === 'Glassmorphism');
    const color = colors.find((item) => item.slug === 'saas-general');
    const font = typography[0];
    const landingPattern = landing.find((item) => item.title === 'Hero + Features + CTA') ?? null;
    const reasoningRule = reasoning.find((item) => item.slug === 'saas-general') ?? null;

    expect(product).toBeTruthy();
    expect(style).toBeTruthy();
    expect(color).toBeTruthy();

    const prompt = buildPrompt({
      product: product!,
      style: style!,
      color: color!,
      typography: font,
      landing: landingPattern,
      dashboardLabel: product!.raw['Dashboard Style (if applicable)'],
      reasoning: reasoningRule
    });

    expect(prompt).toContain('SaaS (General)');
    expect(prompt).toContain('Glassmorphism');
    expect(prompt).toContain(color!.palette!.primary);
    expect(prompt).toContain(font.title);
  });
});
