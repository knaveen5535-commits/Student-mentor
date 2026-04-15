import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

let client;

export function getSupabaseAdmin() {
  if (!client) {
    if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
      throw Object.assign(new Error('Supabase env missing (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)'), { status: 500 });
    }
    client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false }
    });
  }
  return client;
}
