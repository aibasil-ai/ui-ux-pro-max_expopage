import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readCsv } from './lib/read-csv.mjs';
import {
  normalizeCharts,
  normalizeColors,
  normalizeLanding,
  normalizeProducts,
  normalizeReasoning,
  normalizeStyles,
  normalizeTypography,
  normalizeUx,
  normalizeWebRules
} from './lib/normalize-records.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const dataDir = resolve(rootDir, '.codex/skills/ui-ux-pro-max/data');
const outputDir = resolve(rootDir, 'src/data/generated');
const publicDataDir = resolve(rootDir, 'public/data');

function ensureUniqueSlugs(records) {
  const seen = new Map();

  return records.map((record) => {
    const currentCount = seen.get(record.slug) ?? 0;
    seen.set(record.slug, currentCount + 1);

    if (currentCount === 0) {
      return record;
    }

    return {
      ...record,
      slug: `${record.slug}-${record.sourceRow}`
    };
  });
}

const datasets = {
  styles: {
    file: 'styles.csv',
    normalize: normalizeStyles
  },
  colors: {
    file: 'colors.csv',
    normalize: normalizeColors
  },
  typography: {
    file: 'typography.csv',
    normalize: normalizeTypography
  },
  charts: {
    file: 'charts.csv',
    normalize: normalizeCharts
  },
  products: {
    file: 'products.csv',
    normalize: normalizeProducts
  },
  landing: {
    file: 'landing.csv',
    normalize: normalizeLanding
  },
  uxGuidelines: {
    file: 'ux-guidelines.csv',
    normalize: normalizeUx
  },
  uiReasoning: {
    file: 'ui-reasoning.csv',
    normalize: normalizeReasoning
  },
  webInterface: {
    file: 'web-interface.csv',
    normalize: normalizeWebRules
  }
};

const datasetLabels = {
  styles: '風格',
  colors: '配色',
  typography: '字體',
  charts: '圖表',
  products: '產品',
  uxGuidelines: 'UX 指南',
  uiReasoning: '推理規則',
  webInterface: '專門規則'
};

async function loadProductCategoryMap() {
  const source = await readFile(resolve(rootDir, 'src/lib/product-taxonomy.ts'), 'utf8');
  const match = source.match(/export const EXACT_CATEGORY_MAP:[^=]+= (\{[\s\S]*?\n\});/);

  if (!match) {
    throw new Error('無法從 src/lib/product-taxonomy.ts 讀取產品分類映射');
  }

  return Function(`return (${match[1]})`)();
}

function extractKeywords(record) {
  const rawValues = Object.values(record.raw || {})
    .filter((value) => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 120)
    .flatMap((value) => String(value).split(/[;,|]/))
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 16);

  return [...new Set([...(record.tags || []), ...rawValues])];
}

function createSearchItem(record, dataset, href) {
  return {
    id: `${dataset}:${record.slug}`,
    dataset: datasetLabels[dataset],
    title: record.title,
    summary: record.summary || '',
    href,
    category: record.category,
    keywords: extractKeywords(record)
  };
}

async function buildSearchIndex(dataMap) {
  const productCategoryMap = await loadProductCategoryMap();

  return [
    ...dataMap.styles.map((record) => createSearchItem(record, 'styles', `/styles/${record.slug}`)),
    ...dataMap.colors.map((record) => createSearchItem(record, 'colors', `/colors/${record.slug}`)),
    ...dataMap.typography.map((record) => createSearchItem(record, 'typography', `/typography/${record.slug}`)),
    ...dataMap.charts.map((record) => createSearchItem(record, 'charts', `/charts/${record.slug}`)),
    ...dataMap.products.map((record) => {
      const categoryId = productCategoryMap[record.title] ?? 'software-saas';
      return createSearchItem(record, 'products', `/products/${categoryId}/${record.slug}`);
    }),
    ...dataMap.uxGuidelines.map((record) => createSearchItem(record, 'uxGuidelines', `/rules/ux/${record.slug}`)),
    ...dataMap.uiReasoning.map((record) => createSearchItem(record, 'uiReasoning', `/rules/reasoning/${record.slug}`)),
    ...dataMap.webInterface.map((record) => createSearchItem(record, 'webInterface', `/rules/special/${record.slug}`))
  ];
}

export async function buildDatasets() {
  await mkdir(outputDir, { recursive: true });
  await mkdir(publicDataDir, { recursive: true });

  const summary = {};
  const dataMap = {};

  for (const [name, config] of Object.entries(datasets)) {
    const rows = await readCsv(resolve(dataDir, config.file));
    const normalized = ensureUniqueSlugs(config.normalize(rows));

    summary[name] = normalized.length;
    dataMap[name] = normalized;

    await writeFile(
      resolve(outputDir, `${name}.json`),
      JSON.stringify(normalized, null, 2),
      'utf8'
    );
  }

  const searchIndex = await buildSearchIndex(dataMap);

  await writeFile(resolve(outputDir, 'summary.json'), JSON.stringify(summary, null, 2), 'utf8');
  await writeFile(resolve(publicDataDir, 'search-index.json'), JSON.stringify(searchIndex, null, 2), 'utf8');

  return summary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = await buildDatasets();

  console.table(summary);
}
