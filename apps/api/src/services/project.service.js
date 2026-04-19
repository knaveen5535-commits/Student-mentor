import { getSupabaseAdmin } from './supabase.service.js';

// In-memory fallbacks
const inMemoryProjects = [];
const inMemorySearchHistory = [];

export async function createProject({ userEmail, title, information }) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('projects')
      .insert({ user_email: userEmail, title, information })
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase projects insert failed, using fallback:', err.message);
    const newProject = {
      id: `proj_${Date.now()}`,
      user_email: userEmail,
      title,
      information: information || '',
      created_at: new Date().toISOString()
    };
    inMemoryProjects.unshift(newProject);
    return newProject;
  }
}

export async function searchProjects({ userEmail, query }) {
  try {
    const supabase = getSupabaseAdmin();

    if (query && query.trim()) {
      const { error: historyError } = await supabase
        .from('search_history')
        .insert({ user_email: userEmail, query: query.trim() });
      if (historyError) throw historyError;
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
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase searchProjects failed, using fallback:', err.message);
    
    if (query && query.trim()) {
      inMemorySearchHistory.unshift({
        id: `hist_${Date.now()}`,
        user_email: userEmail,
        query: query.trim(),
        created_at: new Date().toISOString()
      });
    }

    let results = inMemoryProjects.filter(p => p.user_email === userEmail);
    if (query && query.trim()) {
      results = results.filter(p => p.title.toLowerCase().includes(query.trim().toLowerCase()));
    }
    return results;
  }
}

export async function getSearchHistory({ userEmail }) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase getSearchHistory failed, using fallback:', err.message);
    return inMemorySearchHistory
      .filter(h => h.user_email === userEmail)
      .slice(0, 20);
  }
}

export async function countProjects({ userEmail }) {
  try {
    const supabase = getSupabaseAdmin();
    const { count, error } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_email', userEmail);
    
    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.warn('Supabase countProjects failed, using fallback:', err.message);
    return inMemoryProjects.filter(p => p.user_email === userEmail).length;
  }
}
