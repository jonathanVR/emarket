function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * WhatsApp number from server env only (Vercel / .env.local).
 * Prefer WHATSAPP_NUMBER (not NEXT_PUBLIC_): it stays off the
 * client bundle. The number still appears in wa.me links on the
 * page — that is intentional and public.
 */
export async function getWhatsAppNumber(): Promise<string> {
  const fromEnv =
    process.env.WHATSAPP_NUMBER ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    '';
  return digitsOnly(fromEnv.trim());
}
