export type ProductStatus = 'available' | 'sold';

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  size: string;
  measurements: string;
  category: string;
  status: ProductStatus;
  imageUrl: string | null;
  sortOrder: number;
  createdAt: string;
};

export type ProductRow = {
  id: string;
  title: string;
  description: string;
  price: number | string;
  compare_at_price: number | string | null;
  size: string;
  measurements: string;
  category: string;
  status: ProductStatus;
  image_url: string | null;
  sort_order: number;
  created_at: string;
};

export type ProductInput = {
  title: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  size: string;
  measurements: string;
  category: string;
  status: ProductStatus;
  imageUrl: string | null;
  sortOrder: number;
};

export type SortOption =
  'newest' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc';

export type StatusFilter = 'all' | ProductStatus;
