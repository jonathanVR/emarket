import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell">
        <div className="empty-state">
          <h1>No encontrado</h1>
          <p>Ese producto no existe o ya no está disponible.</p>
          <Link href="/" className="btn btn--primary">
            Volver al catálogo
          </Link>
        </div>
      </main>
    </>
  );
}
