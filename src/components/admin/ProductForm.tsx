'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { MAX_PRODUCT_IMAGES } from '@/lib/constants';
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

type PendingImage = {
  id: string;
  file: File;
  previewUrl: string;
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
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.imageUrls ?? [],
  );
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const totalImages = imageUrls.length + pendingImages.length;
  const remainingSlots = MAX_PRODUCT_IMAGES - totalImages;

  function updateField<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (files.length === 0) {
      return;
    }

    if (remainingSlots <= 0) {
      setError(`Máximo ${MAX_PRODUCT_IMAGES} fotos por artículo`);
      return;
    }

    const accepted = files.slice(0, remainingSlots).map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setPendingImages((current) => [...current, ...accepted]);
    setError(null);
  }

  function removeSavedImage(url: string) {
    setImageUrls((current) => current.filter((item) => item !== url));
  }

  function removePendingImage(id: string) {
    setPendingImages((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((item) => item.id !== id);
    });
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

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(path);

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

      const uploadedUrls: string[] = [];
      for (const pending of pendingImages) {
        uploadedUrls.push(await uploadImage(pending.file));
      }

      const nextImageUrls = [...imageUrls, ...uploadedUrls].slice(
        0,
        MAX_PRODUCT_IMAGES,
      );

      const compareAt =
        form.compareAtPrice.trim() === ''
          ? null
          : Number(form.compareAtPrice);

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
        image_urls: nextImageUrls,
        image_url: nextImageUrls[0] ?? null,
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

      pendingImages.forEach((item) => {
        URL.revokeObjectURL(item.previewUrl);
      });

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
        <span>
          Fotos ({totalImages}/{MAX_PRODUCT_IMAGES})
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={remainingSlots <= 0}
          onChange={handleFileSelect}
        />
      </label>
      {totalImages > 0 ? (
        <div className="form-preview-grid">
          {imageUrls.map((url) => (
            <div key={url} className="form-preview-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Vista previa" className="form-preview" />
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => removeSavedImage(url)}
              >
                Quitar
              </button>
            </div>
          ))}
          {pendingImages.map((item) => (
            <div key={item.id} className="form-preview-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.previewUrl}
                alt="Vista previa"
                className="form-preview"
              />
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => removePendingImage(item.id)}
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
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
