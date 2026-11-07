import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/ProductGallery';
import { SiteHeader } from '@/components/SiteHeader';
import { getProduct } from '@/lib/data/products';
import { getWhatsAppNumber } from '@/lib/data/settings';
import { formatPrice } from '@/lib/format';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [product, whatsappNumber] = await Promise.all([
    getProduct(id),
    getWhatsAppNumber(),
  ]);

  if (!product) {
    notFound();
  }

  const isSold = product.status === 'sold';
  const whatsappUrl = buildWhatsAppUrl(product, whatsappNumber);

  return (
    <>
      <SiteHeader whatsappNumber={whatsappNumber} />
      <main className="page-shell">
        <Link href="/" className="text-link">
          ← Volver al catálogo
        </Link>
        <article className="product-detail">
          <ProductGallery
            title={product.title}
            imageUrls={product.imageUrls}
            statusLabel={isSold ? 'Vendida' : 'Disponible'}
            statusClassName={`status-badge--${product.status}`}
          />
          <div className="product-detail__content">
            <h1>{product.title}</h1>
            <div className="product-card__prices">
              <span className="price">{formatPrice(product.price)}</span>
              {product.compareAtPrice !== null &&
              product.compareAtPrice > product.price ? (
                <span className="price price--compare">
                  {formatPrice(product.compareAtPrice)}
                </span>
              ) : null}
            </div>
            {product.description ? <p>{product.description}</p> : null}
            {product.size ? <p>Talla: {product.size}</p> : null}
            {product.measurements ? (
              <p>Medidas: {product.measurements}</p>
            ) : null}
            {product.category ? <p>Categoría: {product.category}</p> : null}
            <div className="product-detail__actions">
              {!isSold && whatsappUrl ? (
                <a
                  className="btn btn--whatsapp"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Pedir por WhatsApp
                </a>
              ) : null}
              <Link href="/" className="btn btn--ghost">
                Ver más artículos
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
