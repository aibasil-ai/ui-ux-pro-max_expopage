export interface FavoriteItem {
  id: string;
  title: string;
  href: string;
  dataset: string;
}

const KEY = 'ui-ux-pro-max:favorites';
const EVENT = 'ui-ux-pro-max:favorites-changed';

function readItems(): FavoriteItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function writeItems(items: FavoriteItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function getFavorites() {
  return readItems();
}

export function isFavorite(id: string) {
  return readItems().some((item) => item.id === id);
}

export function toggleFavorite(item: FavoriteItem) {
  const items = readItems();
  if (items.some((current) => current.id === item.id)) {
    writeItems(items.filter((current) => current.id !== item.id));
    return false;
  }
  writeItems([item, ...items]);
  return true;
}

export function subscribeFavorites(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}
