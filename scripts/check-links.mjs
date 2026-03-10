import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const generatedDir = resolve(rootDir, 'src/data/generated');

async function readJson(name) {
  return JSON.parse(await readFile(resolve(generatedDir, `${name}.json`), 'utf8'));
}

function normalizeTokens(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function findStyleMatches(text, styleTitles) {
  const value = String(text || '').trim();
  if (!value || /^N\/A/i.test(value)) {
    return [];
  }

  const valueTokens = new Set(normalizeTokens(value));
  return styleTitles.filter((title) => {
    if (value.includes(title) || title.includes(value)) {
      return true;
    }

    const shared = normalizeTokens(title).filter((token) => valueTokens.has(token));
    return shared.length >= 1;
  });
}

function findLandingMatches(text, landingTitles) {
  const value = String(text || '').trim();
  if (!value) {
    return [];
  }

  const valueTokens = new Set(normalizeTokens(value));
  return landingTitles.filter((title) => {
    if (value.includes(title) || title.includes(value)) {
      return true;
    }

    const shared = normalizeTokens(title).filter((token) => valueTokens.has(token));
    return shared.length >= 1;
  });
}

export async function validateProductReferences() {
  const [products, styles] = await Promise.all([
    readJson('products'),
    readJson('styles')
  ]);

  const styleTitles = styles.map((item) => item.title);
  const results = [];

  for (const product of products) {
    const raw = product.raw;
    const primaryStyleMatches = findStyleMatches(raw['Primary Style Recommendation'], styleTitles);
    if (primaryStyleMatches.length === 0) {
      throw new Error(`產品 ${product.title} 找不到對應主要風格：${raw['Primary Style Recommendation']}`);
    }

    const landingPattern = raw['Landing Page Pattern'];
    if (!landingPattern) {
      throw new Error(`產品 ${product.title} 缺少 landing pattern 建議`);
    }

    const dashboardStyle = raw['Dashboard Style (if applicable)'];
    if (dashboardStyle && !/^N\/A/i.test(dashboardStyle) && String(dashboardStyle).trim().length === 0) {
      throw new Error(`產品 ${product.title} 缺少 dashboard style 建議`);
    }

    results.push({
      product: product.title,
      primaryStyleMatches: primaryStyleMatches.length,
      landingPattern
    });
  }

  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const results = await validateProductReferences();
  console.table(results.slice(0, 10));
  console.log(`已驗證 ${results.length} 筆產品關聯`);
}
