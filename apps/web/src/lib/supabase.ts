import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';

export const supabaseEnvStatus = {
  hasUrl: Boolean(supabaseUrl),
  hasAnonKey: Boolean(supabaseAnonKey)
};

export const isSupabaseConfigured = supabaseEnvStatus.hasUrl && supabaseEnvStatus.hasAnonKey;

export function getSupabaseConfigErrorMessage(): string {
  return 'Supabase configuration is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.';
}

if (!isSupabaseConfigured) {
  console.error(getSupabaseConfigErrorMessage(), supabaseEnvStatus);
}

/**
 * Build-safe Supabase client.
 * Returns null when required env variables are missing.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
      }
    })
  : null;

export default supabase;
