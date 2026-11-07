import { isSupabaseConfigured } from '@/lib/env';

type SetupBannerProps = {
  whatsappNumber?: string;
};

export function SetupBanner({ whatsappNumber = '' }: SetupBannerProps) {
  const missingSupabase = !isSupabaseConfigured();
  const missingWhatsApp = !whatsappNumber;

  if (!missingSupabase && !missingWhatsApp) {
    return null;
  }

  return (
    <div className="setup-banner">
      <p>
        Configura tu archivo <code>.env.local</code> (mira{' '}
        <code>.env.example</code>) y ejecuta{' '}
        <code>supabase/schema.sql</code> en Supabase. El número de WhatsApp
        también se puede guardar en <code>/admin/settings</code>.
      </p>
      <ul>
        {missingSupabase ? <li>Faltan credenciales de Supabase</li> : null}
        {missingWhatsApp ? <li>Falta el número de WhatsApp</li> : null}
      </ul>
    </div>
  );
}
