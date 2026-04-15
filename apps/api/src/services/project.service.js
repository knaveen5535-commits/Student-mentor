import { getSupabaseAdmin } from './supabase.service.js';

export async function createProject({ userEmail, title, information }) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('projects')
    .insert({ user_email: userEmail, title, information })
    .select('*')
    .single();
  if (error) throw Object.assign(new Error(error.message), { status: 400 });
  return data;
}

export async function searchProjects({ userEmail, query }) {
  const supabase = getSupabaseAdmin();

  if (query && query.trim()) {
    const { error: historyError } = await supabase
      .from('search_history')
      .insert({ user_email: userEmail, query: query.trim() });
    if (historyError) {
      // Non-fatal; don't block search.
    }
  }

  let q = supabase
    .from('projects')
    .select('*')
    .eq('user_email', userEmail)
    .order('created_at', { ascending: false })
    .limit(50);

  if (query && query.trim()) {
    q = q.ilike('title', `%${query.trim()}%`);
  }

  const { data, error } = await q;
  if (error) throw Object.assign(new Error(error.message), { status: 400 });
  return data || [];
}

export async function getSearchHistory({ userEmail }) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('search_history')
    .select('*')
    .eq('user_email', userEmail)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw Object.assign(new Error(error.message), { status: 400 });
  return data || [];
}

export async function countProjects({ userEmail }) {
  const supabase = getSupabaseAdmin();
  const { count, error } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_email', userEmail);
  if (error) throw Object.assign(new Error(error.message), { status: 400 });
  return count || 0;
}
