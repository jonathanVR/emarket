import { Suspense } from 'react';
import { CatalogControls } from '@/components/CatalogControls';
import { ProductCard } from '@/components/ProductCard';
import { SetupBanner } from '@/components/SetupBanner';
import { SiteHeader } from '@/components/SiteHeader';
import { listProducts } from '@/lib/data/products';
import { getStoreName } from '@/lib/env';
import { filterAndSortProducts, uniqueCategories } from '@/lib/products';
import type { SortOption, StatusFilter } from '@/lib/types';

export const dynamic = 'force-dynamic';

type HomeProps = {
  searchParams: Promise<{
    status?: string;
    category?: string;
    sort?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const products = await listProducts();
  const categories = uniqueCategories(products);

  const status = (params.status as StatusFilter) || 'all';
  const category = params.category || 'all';
  const sort = (params.sort as SortOption) || 'newest';

  const visible = filterAndSortProducts(products, status, category, sort);
  const storeName = getStoreName();

  return (
    <>
      <SiteHeader showAdminLink />
      <main className="page-shell">
        <section className="hero">
          <h1>{storeName}</h1>
          <p>
            Catálogo simple. Elige un artículo y escríbenos por WhatsApp para
            coordinar la compra.
          </p>
        </section>
        <SetupBanner />
        <Suspense fallback={null}>
          <CatalogControls categories={categories} />
        </Suspense>
        {visible.length === 0 ? (
          <div className="empty-state">
            <p>
              Aún no hay productos para mostrar. Entra a{' '}
              <a href="/admin">/admin</a> para publicar el primero.
            </p>
          </div>
        ) : (
          <section className="product-grid">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        )}
      </main>
    </>
  );
}
