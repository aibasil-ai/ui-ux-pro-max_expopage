import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { getStyles } from '../../src/lib/content/get-styles';
import { styleShowcaseRegistry } from '../../src/components/style/StyleShowcaseRegistry';

describe('style showcase registry', () => {
  it('所有風格 slug 都應有對應 showcase', async () => {
    const styles = await getStyles();
    const missing = styles
      .map((style) => style.slug)
      .filter((slug) => !(slug in styleShowcaseRegistry));

    expect(missing, `Missing showcases: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('每個 showcase 的 recipe 組合都應唯一', async () => {
    const styles = await getStyles();
    const entries = await Promise.all(
      styles.map(async (style) => {
        const filePath = resolve(process.cwd(), 'src/components/style/showcases', `${style.slug}.astro`);
        const content = await readFile(filePath, 'utf8');
        const recipeMatch = content.match(/const recipe = (\[[^;]+\]);/);
        return {
          slug: style.slug,
          recipe: recipeMatch?.[1] ?? ''
        };
      })
    );

    const missingRecipe = entries.filter((entry) => entry.recipe.length === 0).map((entry) => entry.slug);
    expect(missingRecipe, `Missing recipe declaration in: ${missingRecipe.join(', ')}`).toHaveLength(0);

    const seen = new Map<string, string>();
    const duplicatedPairs: string[] = [];
    for (const entry of entries) {
      const previous = seen.get(entry.recipe);
      if (previous) {
        duplicatedPairs.push(`${previous} & ${entry.slug}`);
      } else {
        seen.set(entry.recipe, entry.slug);
      }
    }

    expect(duplicatedPairs, `Duplicated recipes found: ${duplicatedPairs.join(', ')}`).toHaveLength(0);
  });
});
