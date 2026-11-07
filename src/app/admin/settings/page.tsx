import Link from 'next/link';
import { WhatsAppSettingsForm } from '@/components/admin/WhatsAppSettingsForm';
import { getWhatsAppNumber } from '@/lib/data/settings';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const whatsappNumber = await getWhatsAppNumber();

  return (
    <>
      <div className="admin-title-row">
        <h1>Configuración</h1>
        <Link href="/admin" className="text-link">
          ← Volver
        </Link>
      </div>
      <p className="text-link" style={{ marginTop: 0 }}>
        El número se guarda en Supabase. Al cambiarlo, la tienda pública lo
        usa de inmediato (sin redeploy en Vercel).
      </p>
      <WhatsAppSettingsForm initialNumber={whatsappNumber} />
    </>
  );
}
