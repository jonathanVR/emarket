import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

type ProductCardProps = {
  product: Product;
  whatsappNumber: string;
};

export function ProductCard({ product, whatsappNumber }: ProductCardProps) {
  const isSold = product.status === 'sold';
  const whatsappUrl = buildWhatsAppUrl(product, whatsappNumber);
  const coverUrl = product.imageUrls[0] ?? null;
  const extraCount = Math.max(product.imageUrls.length - 1, 0);

  return (
    <article className={`product-card ${isSold ? 'is-sold' : ''}`}>
      <Link href={`/product/${product.id}`} className="product-card__media">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="product-card__image"
          />
        ) : (
          <div className="product-card__placeholder">Sin foto</div>
        )}
        <span className={`status-badge status-badge--${product.status}`}>
          {isSold ? 'Vendida' : 'Disponible'}
        </span>
        {extraCount > 0 ? (
          <span className="product-card__photo-count">+{extraCount}</span>
        ) : null}
      </Link>
      <div className="product-card__body">
        <h2 className="product-card__title">
          <Link href={`/product/${product.id}`}>{product.title}</Link>
        </h2>
        <div className="product-card__prices">
          <span className="price">{formatPrice(product.price)}</span>
          {product.compareAtPrice !== null &&
          product.compareAtPrice > product.price ? (
            <span className="price price--compare">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
        {product.size || product.measurements ? (
          <p className="product-card__meta">
            {[product.size && `Talla: ${product.size}`, product.measurements]
              .filter(Boolean)
              .join(' · ')}
          </p>
        ) : null}
        {!isSold && whatsappUrl ? (
          <a
            className="btn btn--whatsapp"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            Me interesa
          </a>
        ) : null}
      </div>
    </article>
  );
}
