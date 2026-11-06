function clean(value: string | undefined): string {
  return value?.trim() ?? '';
}

export function getSupabaseUrl(): string {
  return clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getSupabaseAnonKey(): string {
  return clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function getWhatsAppNumber(): string {
  return clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER).replace(
    /\D/g,
    '',
  );
}

export function getStoreName(): string {
  return clean(process.env.NEXT_PUBLIC_STORE_NAME) || 'eMarket';
}

export function getCurrency(): string {
  return clean(process.env.NEXT_PUBLIC_CURRENCY) || 'BOB';
}
