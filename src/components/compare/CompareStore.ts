export interface CompareItem {
  id: string;
  title: string;
  href: string;
  dataset: string;
  summary?: string;
}

const KEY = 'ui-ux-pro-max:compare';
const EVENT = 'ui-ux-pro-max:compare-changed';

function readItems(): CompareItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function writeItems(items: CompareItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function getCompareItems() {
  return readItems();
}

export function isCompared(id: string) {
  return readItems().some((item) => item.id === id);
}

export function toggleCompare(item: CompareItem) {
  const items = readItems();
  if (items.some((current) => current.id === item.id)) {
    writeItems(items.filter((current) => current.id !== item.id));
    return false;
  }
  writeItems([item, ...items].slice(0, 3));
  return true;
}

export function clearCompare() {
  writeItems([]);
}

export function subscribeCompare(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}
