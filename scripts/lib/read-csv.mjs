import { readFile } from 'node:fs/promises';
import { parse } from 'csv-parse/sync';

export async function readCsv(filePath) {
  const raw = await readFile(filePath, 'utf8');
  const records = parse(raw, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true
  });

  return records.map((record, index) => ({
    __row: index + 2,
    ...record
  }));
}
