import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const cache = new Map<string, unknown[]>();
const generatedDir = resolve(process.cwd(), 'src/data/generated');

export type DatasetName =
  | 'styles'
  | 'colors'
  | 'typography'
  | 'charts'
  | 'products'
  | 'landing'
  | 'uxGuidelines'
  | 'uiReasoning'
  | 'webInterface';

export interface GeneratedRecord {
  id: string;
  slug: string;
  dataset: string;
  title: string;
  category: string;
  tags: string[];
  sourceFile: string;
  sourceRow: number;
  raw: Record<string, string>;
  summary?: string;
}

export async function loadGeneratedDataset<T extends GeneratedRecord = GeneratedRecord>(name: DatasetName) {
  if (cache.has(name)) {
    return cache.get(name) as T[];
  }

  const parsed = JSON.parse(await readFile(resolve(generatedDir, `${name}.json`), 'utf8')) as T[];
  cache.set(name, parsed);
  return parsed;
}

export async function getGeneratedBySlug<T extends GeneratedRecord = GeneratedRecord>(
  name: DatasetName,
  slug: string
) {
  const records = await loadGeneratedDataset<T>(name);
  return records.find((record) => record.slug === slug) ?? null;
}
