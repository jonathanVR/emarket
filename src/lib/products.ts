import type {
  Product,
  ProductInput,
  ProductRow,
  SortOption,
  StatusFilter,
} from '@/lib/types';
import { toNumber } from '@/lib/format';

export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    price: toNumber(row.price),
    compareAtPrice:
      row.compare_at_price === null || row.compare_at_price === undefined
        ? null
        : toNumber(row.compare_at_price),
    size: row.size ?? '',
    measurements: row.measurements ?? '',
    category: row.category || 'General',
    status: row.status,
    imageUrl: row.image_url,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
  };
}

export function toProductRow(input: ProductInput) {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    price: input.price,
    compare_at_price: input.compareAtPrice,
    size: input.size.trim(),
    measurements: input.measurements.trim(),
    category: input.category.trim() || 'General',
    status: input.status,
    image_url: input.imageUrl,
    sort_order: input.sortOrder,
  };
}

export function filterAndSortProducts(
  products: Product[],
  statusFilter: StatusFilter,
  category: string,
  sort: SortOption,
): Product[] {
  let result = [...products];

  if (statusFilter !== 'all') {
    result = result.filter((item) => item.status === statusFilter);
  }

  if (category !== 'all') {
    result = result.filter((item) => item.category === category);
  }

  result.sort((a, b) => {
    switch (sort) {
      case 'priceAsc':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'nameAsc':
        return a.title.localeCompare(b.title, 'es');
      case 'nameDesc':
        return b.title.localeCompare(a.title, 'es');
      case 'newest':
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  return result;
}

export function uniqueCategories(products: Product[]): string[] {
  return [...new Set(products.map((item) => item.category))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
}
