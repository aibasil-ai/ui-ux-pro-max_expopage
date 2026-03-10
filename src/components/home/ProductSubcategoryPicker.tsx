import { useMemo, useState } from 'react';

interface ProductOption {
  slug: string;
  title: string;
}

interface CategoryOption {
  id: string;
  name: string;
  description: string;
  products: ProductOption[];
}

interface Props {
  categories: CategoryOption[];
}

export default function ProductSubcategoryPicker({ categories }: Props) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [productSlug, setProductSlug] = useState(categories[0]?.products[0]?.slug ?? '');

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === categoryId) ?? categories[0],
    [categories, categoryId]
  );

  const href = activeCategory && productSlug ? `/products/${activeCategory.id}/${productSlug}` : '#';

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-950/5 md:p-8">
      <div className="grid gap-5 md:grid-cols-[1.1fr_1fr_auto] md:items-end">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          1. 選擇產品大類
          <select
            aria-label="選擇產品大類"
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900"
            value={categoryId}
            onChange={(event) => {
              const nextCategoryId = event.target.value;
              const nextCategory = categories.find((category) => category.id === nextCategoryId) ?? categories[0];
              setCategoryId(nextCategoryId);
              setProductSlug(nextCategory?.products[0]?.slug ?? '');
            }}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          2. 選擇產品細類
          <select
            aria-label="選擇產品細類"
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900"
            value={productSlug}
            onChange={(event) => setProductSlug(event.target.value)}
          >
            {activeCategory?.products.map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.title}
              </option>
            ))}
          </select>
        </label>

        <a
          className="inline-flex h-[52px] items-center justify-center rounded-2xl bg-slate-950 px-6 text-sm font-semibold text-white hover:-translate-y-0.5"
          href={href}
        >
          查看推薦方向
        </a>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-500">{activeCategory?.description}</p>
    </div>
  );
}
