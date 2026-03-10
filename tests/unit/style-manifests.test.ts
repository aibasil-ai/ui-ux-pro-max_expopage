import { describe, expect, it } from 'vitest';

import { getStyles } from '../../src/lib/content/get-styles';
import { getStyleManifests } from '../../src/lib/style-manifests';

describe('style manifests', () => {
  it('每個 style 都能生成 manifest', async () => {
    const styles = await getStyles();
    const manifests = getStyleManifests(styles);

    expect(manifests).toHaveLength(67);
    expect(manifests.every((manifest) => manifest.sectionOrder.length === 5)).toBe(true);
    expect(new Set(manifests.map((manifest) => `${manifest.heroVariant}:${manifest.previewVariant}:${manifest.accentMode}`)).size).toBeGreaterThan(12);
  });
});
