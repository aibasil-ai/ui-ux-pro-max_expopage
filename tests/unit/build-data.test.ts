import { describe, expect, it } from 'vitest';

import { buildDatasets } from '../../scripts/build-data.mjs';

describe('build-data', () => {
  it('會輸出目前資料源的正確筆數', async () => {
    const summary = await buildDatasets();

    expect(summary).toEqual({
      styles: 67,
      colors: 96,
      typography: 57,
      charts: 25,
      products: 96,
      landing: 27,
      uxGuidelines: 99,
      uiReasoning: 100,
      webInterface: 30
    });
  });
});
