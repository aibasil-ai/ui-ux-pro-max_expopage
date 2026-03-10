import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const generatedDir = resolve(rootDir, 'src/data/generated');
const datasets = ['styles', 'colors', 'typography', 'charts', 'products', 'landing', 'uxGuidelines', 'uiReasoning', 'webInterface'];
const requiredFields = ['id', 'slug', 'dataset', 'title', 'category', 'tags', 'sourceFile', 'sourceRow', 'raw'];

async function readJson(name) {
  return JSON.parse(await readFile(resolve(generatedDir, `${name}.json`), 'utf8'));
}

export async function validateDatasets() {
  const results = [];

  for (const dataset of datasets) {
    const records = await readJson(dataset);

    records.forEach((record, index) => {
      for (const field of requiredFields) {
        if (!(field in record)) {
          throw new Error(`${dataset}[${index}] 缺少欄位 ${field}`);
        }
      }

      if (!Array.isArray(record.tags)) {
        throw new Error(`${dataset}[${index}] 的 tags 不是陣列`);
      }

      if (!record.slug || !record.title) {
        throw new Error(`${dataset}[${index}] 缺少 slug 或 title`);
      }
    });

    results.push({ dataset, count: records.length });
  }

  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.table(await validateDatasets());
}
