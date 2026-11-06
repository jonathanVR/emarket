import Link from 'next/link';
import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <>
      <div className="admin-title-row">
        <h1>Nuevo producto</h1>
        <Link href="/admin" className="text-link">
          ← Volver
        </Link>
      </div>
      <ProductForm />
    </>
  );
}
