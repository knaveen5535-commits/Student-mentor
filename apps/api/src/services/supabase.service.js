import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

let client;

export function getSupabaseAdmin() {
  if (!client) {
    if (!env.supabaseUrl || !env.supabaseKey) {
      throw Object.assign(new Error('Supabase env missing (SUPABASE_URL / SUPABASE_KEY)'), { status: 500 });
    }
    client = createClient(env.supabaseUrl, env.supabaseKey, {
      auth: { persistSession: false }
    });
  }
  return client;
}
