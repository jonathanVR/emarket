'use client';

import Image from 'next/image';
import { useState } from 'react';

type ProductGalleryProps = {
  title: string;
  imageUrls: string[];
  statusLabel: string;
  statusClassName: string;
};

export function ProductGallery({
  title,
  imageUrls,
  statusLabel,
  statusClassName,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeUrl = imageUrls[activeIndex] ?? null;

  return (
    <div className="product-gallery">
      <div className="product-detail__media">
        {activeUrl ? (
          <Image
            src={activeUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="product-card__image"
            priority
          />
        ) : (
          <div className="product-card__placeholder">Sin foto</div>
        )}
        <span className={`status-badge ${statusClassName}`}>{statusLabel}</span>
      </div>
      {imageUrls.length > 1 ? (
        <div className="product-gallery__thumbs" role="list">
          {imageUrls.map((url, index) => (
            <button
              key={url}
              type="button"
              role="listitem"
              className={`product-gallery__thumb ${
                index === activeIndex ? 'is-active' : ''
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Foto ${index + 1}`}
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="72px"
                className="product-card__image"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
