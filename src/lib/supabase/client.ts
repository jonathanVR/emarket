import { createBrowserClient } from '@supabase/ssr';
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from '@/lib/env';

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY',
    );
  }

  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}
