import { createClient } from '@supabase/supabase-js';

// Get env variables from Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ Supabase configuration is missing. Please check your environment variables:',
    {
      hasUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseAnonKey
    }
  );
}

/**
 * Supabase client instance
 * This client is used for all Supabase operations
 * including authentication, database queries, and file uploads
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
});

export default supabase;
