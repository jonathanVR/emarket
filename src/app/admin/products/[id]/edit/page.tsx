import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { getProduct } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <div className="admin-title-row">
        <h1>Editar producto</h1>
        <Link href="/admin" className="text-link">
          ← Volver
        </Link>
      </div>
      <ProductForm product={product} />
    </>
  );
}
