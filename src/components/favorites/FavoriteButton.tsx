import { useEffect, useState } from 'react';

import { isFavorite, subscribeFavorites, toggleFavorite, type FavoriteItem } from './FavoritesStore';

interface Props {
  item: FavoriteItem;
}

export default function FavoriteButton({ item }: Props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isFavorite(item.id));
    return subscribeFavorites(() => setActive(isFavorite(item.id)));
  }, [item.id]);

  return (
    <button
      type="button"
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm font-semibold ${active ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}
      onClick={() => setActive(toggleFavorite(item))}
    >
      {active ? '已收藏' : '加入收藏'}
    </button>
  );
}
