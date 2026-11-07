import { isSupabaseConfigured, getWhatsAppNumber } from '@/lib/env';

export function SetupBanner() {
  const missingSupabase = !isSupabaseConfigured();
  const missingWhatsApp = !getWhatsAppNumber();

  if (!missingSupabase && !missingWhatsApp) {
    return null;
  }

  return (
    <div className="setup-banner">
      <p>
        Configura tu archivo <code>.env.local</code> (mira{' '}
        <code>.env.example</code>) y ejecuta <code>supabase/schema.sql</code> en
        Supabase.
      </p>
      <ul>
        {missingSupabase ? <li>Faltan credenciales de Supabase</li> : null}
        {missingWhatsApp ? <li>Falta WHATSAPP_NUMBER</li> : null}
      </ul>
    </div>
  );
}
