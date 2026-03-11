import { describe, expect, it } from 'vitest';

import { buildStyleShowcaseTheme } from '../../src/lib/style-showcase-theme';

function createStyleRecord(overrides: Record<string, string> = {}) {
  return {
    slug: 'test-style',
    title: 'Test Style',
    summary: 'Test summary',
    category: 'Experimental',
    raw: {
      'Primary Colors': '#4F46E5, #22D3EE',
      'Secondary Colors': '#A78BFA, #F472B6',
      'Keywords': 'clean, modern',
      'Effects & Animation': 'subtle hover',
      ...overrides
    }
  };
}

describe('buildStyleShowcaseTheme', () => {
  it('會根據風格資料輸出可用的主題變數', () => {
    const theme = buildStyleShowcaseTheme(createStyleRecord(), { accentMode: 'indigo' });

    expect(theme.rootStyle).toContain('--ss-bg-from');
    expect(theme.rootStyle).toContain('--ss-accent');
    expect(theme.fontClass.length).toBeGreaterThan(0);
    expect(theme.motionClass.length).toBeGreaterThan(0);
  });

  it('不同風格應該產生不同主題 token', () => {
    const neo = buildStyleShowcaseTheme(
      createStyleRecord({
        'Primary Colors': '#00F0FF, #8B5CF6',
        'Keywords': 'cyberpunk, neon, terminal'
      }),
      { accentMode: 'cyan' }
    );
    const organic = buildStyleShowcaseTheme(
      createStyleRecord({
        'Primary Colors': '#2E7D32, #B2FF59',
        'Keywords': 'organic, nature, calm'
      }),
      { accentMode: 'emerald' }
    );

    expect(neo.rootStyle).not.toEqual(organic.rootStyle);
    expect(neo.fontClass).not.toEqual(organic.fontClass);
  });

  it('遇到 dark 相關關鍵字時，應標記為深色主題', () => {
    const theme = buildStyleShowcaseTheme(
      createStyleRecord({
        'Primary Colors': '#05070F, #1E293B',
        'Keywords': 'dark mode, oled, cyberpunk'
      }),
      { accentMode: 'crimson' }
    );

    expect(theme.isDark).toBe(true);
    expect(theme.rootStyle).toContain('--ss-text:#E2E8F0');
  });

  it('缺少顏色欄位時，仍應有安全 fallback', () => {
    const theme = buildStyleShowcaseTheme(
      createStyleRecord({
        'Primary Colors': '',
        'Secondary Colors': ''
      }),
      { accentMode: 'amber' }
    );

    expect(theme.rootStyle).toContain('--ss-accent:#');
    expect(theme.rootStyle).toContain('--ss-bg-to:#');
  });
});
