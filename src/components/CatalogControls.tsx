'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { SortOption, StatusFilter } from '@/lib/types';

type CatalogControlsProps = {
  categories: string[];
};

export function CatalogControls({ categories }: CatalogControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = (searchParams.get('status') as StatusFilter) || 'all';
  const category = searchParams.get('category') || 'all';
  const sort = (searchParams.get('sort') as SortOption) || 'newest';

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || (key === 'sort' && value === 'newest')) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="catalog-controls">
      <label className="field">
        <span>Estado</span>
        <select
          value={status}
          onChange={(event) => updateParam('status', event.target.value)}
        >
          <option value="all">Todos</option>
          <option value="available">Disponible</option>
          <option value="sold">Vendido</option>
        </select>
      </label>
      <label className="field">
        <span>Categoría</span>
        <select
          value={category}
          onChange={(event) => updateParam('category', event.target.value)}
        >
          <option value="all">Todas</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Ordenar</span>
        <select
          value={sort}
          onChange={(event) => updateParam('sort', event.target.value)}
        >
          <option value="newest">Más recientes</option>
          <option value="priceAsc">Menor precio</option>
          <option value="priceDesc">Mayor precio</option>
          <option value="nameAsc">A-Z</option>
          <option value="nameDesc">Z-A</option>
        </select>
      </label>
    </div>
  );
}
