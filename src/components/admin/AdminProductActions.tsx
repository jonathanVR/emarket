'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/lib/types';

type AdminProductActionsProps = {
  product: Product;
};

export function AdminProductActions({ product }: AdminProductActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleStatus() {
    setBusy(true);
    setError(null);
    const nextStatus = product.status === 'available' ? 'sold' : 'available';

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('products')
        .update({ status: nextStatus })
        .eq('id', product.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setBusy(false);
    }
  }

  async function removeProduct() {
    const confirmed = window.confirm(
      `¿Eliminar "${product.title}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-actions">
      <button
        type="button"
        className="btn btn--ghost"
        disabled={busy}
        onClick={toggleStatus}
      >
        {product.status === 'available'
          ? 'Marcar vendido'
          : 'Marcar disponible'}
      </button>
      <button
        type="button"
        className="btn btn--danger"
        disabled={busy}
        onClick={removeProduct}
      >
        Eliminar
      </button>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
