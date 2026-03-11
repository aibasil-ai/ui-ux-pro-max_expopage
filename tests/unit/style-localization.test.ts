import { describe, expect, it } from 'vitest';

import { getStyles } from '../../src/lib/content/get-styles';
import {
  allStyleTraditionalChineseNames,
  getStyleBilingualTitle,
  getStyleTraditionalChineseName
} from '../../src/lib/style-localization';

describe('style localization', () => {
  it('所有 style slug 都應有繁中名稱', async () => {
    const styles = await getStyles();
    const missing = styles
      .map((style) => style.slug)
      .filter((slug) => !allStyleTraditionalChineseNames[slug]);

    expect(missing, `Missing zh-TW style names: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('雙語標題應包含英文與繁中', () => {
    const title = getStyleBilingualTitle('glassmorphism', 'Glassmorphism');
    expect(title).toContain('Glassmorphism');
    expect(title).toContain('玻璃擬態');
  });

  it('查不到翻譯時，應回傳英文原文', () => {
    expect(getStyleTraditionalChineseName('unknown-style')).toBeUndefined();
    expect(getStyleBilingualTitle('unknown-style', 'Unknown Style')).toBe('Unknown Style');
  });
});
