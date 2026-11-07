import Link from 'next/link';
import { AdminProductActions } from '@/components/admin/AdminProductActions';
import { listProducts } from '@/lib/data/products';
import { formatPrice } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const products = await listProducts();

  return (
    <>
      <div className="admin-title-row">
        <h1>Productos</h1>
        <div className="admin-bar__actions">
          <Link href="/admin/settings" className="btn btn--ghost">
            WhatsApp
          </Link>
          <Link href="/admin/products/new" className="btn btn--primary">
            Nuevo producto
          </Link>
        </div>
      </div>
      {products.length === 0 ? (
        <div className="empty-state">
          <p>No hay productos todavía. Crea el primero.</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.title}</strong>
                  <div className="text-link">{product.category}</div>
                </td>
                <td>{formatPrice(product.price)}</td>
                <td>
                  {product.status === 'available' ? 'Disponible' : 'Vendido'}
                </td>
                <td>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="btn btn--ghost"
                  >
                    Editar
                  </Link>
                  <AdminProductActions product={product} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
