import { getSupabaseAdmin } from './supabase.service.js';

/**
 * Create a new learning session
 */
export async function createSession(userId, topic) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('learning_sessions')
      .insert({ user_id: userId, topic })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Service error creating session:', err);
    throw err;
  }
}

/**
 * Log an interaction specific to a session
 */
export async function logInteraction(sessionId, userId, objectClicked) {
  try {
    const supabase = getSupabaseAdmin();

    // Verify ownership of the session to prevent scraping
    const { data: sessionData } = await supabase
      .from('learning_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (!sessionData) {
      throw new Error('Unauthorized or missing session');
    }

    const { data, error } = await supabase
      .from('interactions')
      .insert({ session_id: sessionId, object_clicked: objectClicked })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Service error logging interaction:', err);
    throw err;
  }
}
