import Link from 'next/link';
import { LogoutButton } from '@/components/admin/LogoutButton';
import { getStoreName, isSupabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userEmail = user?.email ?? null;
    } catch {
      userEmail = null;
    }
  }

  return (
    <>
      <div className="admin-bar">
        <div>
          <Link href="/admin" className="brand">
            {getStoreName()} Admin
          </Link>
          {userEmail ? (
            <p className="text-link" style={{ margin: '0.2rem 0 0' }}>
              {userEmail}
            </p>
          ) : null}
        </div>
        <div className="admin-bar__actions">
          <Link href="/" className="text-link">
            Ver tienda
          </Link>
          {userEmail ? <LogoutButton /> : null}
        </div>
      </div>
      <div className="admin-shell">{children}</div>
    </>
  );
}
