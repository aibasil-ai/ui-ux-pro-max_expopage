export interface SearchItem {
  id: string;
  dataset: string;
  title: string;
  summary?: string;
  href: string;
  category: string;
  keywords?: string[];
}

export async function loadSearchIndex() {
  const response = await fetch('/data/search-index.json');
  if (!response.ok) {
    throw new Error('無法載入搜尋索引');
  }
  return (await response.json()) as SearchItem[];
}

export function filterSearchIndex(items: SearchItem[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  return items
    .filter((item) =>
      [item.title, item.summary || '', item.category, item.dataset, ...(item.keywords || [])]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    )
    .slice(0, 12);
}
