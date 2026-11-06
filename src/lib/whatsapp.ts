import { getWhatsAppNumber } from '@/lib/env';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';

export function buildWhatsAppUrl(product: Product): string | null {
  const phone = getWhatsAppNumber();
  if (!phone) {
    return null;
  }

  const lines = [
    `Hola! Me interesa: ${product.title}`,
    `Precio: ${formatPrice(product.price)}`,
  ];

  if (product.size) {
    lines.push(`Talla: ${product.size}`);
  }

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${phone}?text=${text}`;
}
