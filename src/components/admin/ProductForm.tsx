'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Product, ProductStatus } from '@/lib/types';

type ProductFormProps = {
  product?: Product;
};

type FormState = {
  title: string;
  description: string;
  price: string;
  compareAtPrice: string;
  size: string;
  measurements: string;
  category: string;
  status: ProductStatus;
  sortOrder: string;
};

function toFormState(product?: Product): FormState {
  return {
    title: product?.title ?? '',
    description: product?.description ?? '',
    price: product ? String(product.price) : '',
    compareAtPrice:
      product?.compareAtPrice !== null && product?.compareAtPrice !== undefined
        ? String(product.compareAtPrice)
        : '',
    size: product?.size ?? '',
    measurements: product?.measurements ?? '',
    category: product?.category ?? 'General',
    status: product?.status ?? 'available',
    sortOrder: product ? String(product.sortOrder) : '0',
  };
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(toFormState(product));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    product?.imageUrl ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function uploadImage(file: File): Promise<string> {
    const supabase = createClient();
    const extension = file.name.split('.').pop() || 'jpg';
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: false });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(path);

    return data.publicUrl;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const price = Number(form.price);
      if (!form.title.trim()) {
        throw new Error('El título es obligatorio');
      }
      if (Number.isNaN(price) || price < 0) {
        throw new Error('Precio inválido');
      }

      let nextImageUrl = imageUrl;
      if (imageFile) {
        nextImageUrl = await uploadImage(imageFile);
        setImageUrl(nextImageUrl);
      }

      const compareAt =
        form.compareAtPrice.trim() === '' ? null : Number(form.compareAtPrice);

      if (compareAt !== null && Number.isNaN(compareAt)) {
        throw new Error('Precio anterior inválido');
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price,
        compare_at_price: compareAt,
        size: form.size.trim(),
        measurements: form.measurements.trim(),
        category: form.category.trim() || 'General',
        status: form.status,
        image_url: nextImageUrl,
        sort_order: Number(form.sortOrder) || 0,
      };

      const supabase = createClient();

      if (product) {
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', product.id);

        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert(payload);

        if (insertError) {
          throw new Error(insertError.message);
        }
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Título</span>
        <input
          value={form.title}
          onChange={(event) => updateField('title', event.target.value)}
          required
        />
      </label>
      <label className="field">
        <span>Descripción</span>
        <textarea
          rows={4}
          value={form.description}
          onChange={(event) => updateField('description', event.target.value)}
        />
      </label>
      <div className="form-row">
        <label className="field">
          <span>Precio</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) => updateField('price', event.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Precio anterior (opcional)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.compareAtPrice}
            onChange={(event) =>
              updateField('compareAtPrice', event.target.value)
            }
          />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span>Talla</span>
          <input
            value={form.size}
            onChange={(event) => updateField('size', event.target.value)}
          />
        </label>
        <label className="field">
          <span>Medidas</span>
          <input
            value={form.measurements}
            onChange={(event) =>
              updateField('measurements', event.target.value)
            }
          />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span>Categoría</span>
          <input
            value={form.category}
            onChange={(event) => updateField('category', event.target.value)}
          />
        </label>
        <label className="field">
          <span>Estado</span>
          <select
            value={form.status}
            onChange={(event) =>
              updateField('status', event.target.value as ProductStatus)
            }
          >
            <option value="available">Disponible</option>
            <option value="sold">Vendido</option>
          </select>
        </label>
        <label className="field">
          <span>Orden</span>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(event) => updateField('sortOrder', event.target.value)}
          />
        </label>
      </div>
      <label className="field">
        <span>Foto</span>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            setImageFile(file);
          }}
        />
      </label>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="Vista previa" className="form-preview" />
      ) : null}
      {error ? <p className="form-error">{error}</p> : null}
      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar producto'}
        </button>
      </div>
    </form>
  );
}
