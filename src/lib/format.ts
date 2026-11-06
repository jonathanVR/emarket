import { getCurrency } from '@/lib/env';

export function formatPrice(value: number): string {
  const currency = getCurrency();
  try {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function toNumber(value: number | string | null | undefined): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return Number(value);
  }
  return 0;
}
