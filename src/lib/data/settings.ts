import { isSupabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function envWhatsAppFallback(): string {
  const fromEnv =
    process.env.WHATSAPP_NUMBER ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    '';
  return digitsOnly(fromEnv.trim());
}

export async function getWhatsAppNumber(): Promise<string> {
  if (!isSupabaseConfigured()) {
    return envWhatsAppFallback();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('store_settings')
      .select('whatsapp_number')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) {
      return envWhatsAppFallback();
    }

    const fromDb = digitsOnly(data.whatsapp_number ?? '');
    return fromDb || envWhatsAppFallback();
  } catch {
    return envWhatsAppFallback();
  }
}

export async function updateWhatsAppNumber(
  whatsappNumber: string,
): Promise<void> {
  const cleaned = digitsOnly(whatsappNumber.trim());
  const supabase = await createClient();
  const { error } = await supabase.from('store_settings').upsert({
    id: 1,
    whatsapp_number: cleaned,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }
}
