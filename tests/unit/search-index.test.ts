import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { filterSearchIndex, type SearchItem } from '../../src/components/search/search-index';

const searchIndexPath = resolve(process.cwd(), 'public/data/search-index.json');

function readSearchIndex() {
  return JSON.parse(readFileSync(searchIndexPath, 'utf8')) as SearchItem[];
}

describe('search index', () => {
  it('包含主要內容類型', () => {
    const items = readSearchIndex();
    const datasets = new Set(items.map((item) => item.dataset));

    expect(items.length).toBeGreaterThan(500);
    expect(datasets.has('風格')).toBe(true);
    expect(datasets.has('產品')).toBe(true);
    expect(datasets.has('配色')).toBe(true);
    expect(datasets.has('字體')).toBe(true);
    expect(datasets.has('圖表')).toBe(true);
    expect(datasets.has('UX 指南')).toBe(true);
    expect(datasets.has('推理規則')).toBe(true);
    expect(datasets.has('專門規則')).toBe(true);
  });

  it('可用關鍵字搜尋到風格與規則', () => {
    const items = readSearchIndex();

    expect(filterSearchIndex(items, 'glass')).toEqual(
      expect.arrayContaining([expect.objectContaining({ href: '/styles/glassmorphism' })])
    );
    expect(filterSearchIndex(items, 'smooth')).toEqual(
      expect.arrayContaining([expect.objectContaining({ href: '/rules/ux/smooth-scroll' })])
    );
  });
});
