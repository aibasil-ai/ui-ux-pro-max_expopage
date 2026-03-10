import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const generatedDir = resolve(rootDir, 'src/data/generated');
const datasets = ['styles', 'colors', 'typography', 'charts', 'products', 'landing', 'uxGuidelines', 'uiReasoning', 'webInterface'];

async function readJson(name) {
  return JSON.parse(await readFile(resolve(generatedDir, `${name}.json`), 'utf8'));
}

export async function validateUniqueSlugs() {
  const results = [];

  for (const dataset of datasets) {
    const records = await readJson(dataset);
    const seen = new Set();

    for (const record of records) {
      const key = `${dataset}:${record.slug}`;
      if (seen.has(key)) {
        throw new Error(`重複 slug：${key}`);
      }
      seen.add(key);
    }

    results.push({ dataset, unique: seen.size });
  }

  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.table(await validateUniqueSlugs());
}
