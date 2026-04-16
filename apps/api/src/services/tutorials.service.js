import { getSupabaseAdmin } from './supabase.service.js';

let supabaseClient = null;

function getSupabaseInstance() {
  try {
    if (!supabaseClient) {
      supabaseClient = getSupabaseAdmin();
    }
    return supabaseClient;
  } catch (err) {
    console.warn('⚠️ Supabase client not available for tutorials:', err.message);
    return null;
  }
}

/**
 * Search tutorials by keyword, category, or difficulty
 */
export async function searchTutorials(query) {
  try {
    // Try to get Supabase client - if it fails, return empty array
    const supabase = getSupabaseInstance();
    if (!supabase) {
      console.log('📚 Tutorials service: Supabase not configured');
      return [];
    }

    if (!query || query.trim().length === 0) {
      // Get random tutorials if no query
      const { data, error } = await supabase
        .from('tutorials')
        .select('id, title, description, youtube_url, youtube_video_id, category, difficulty, duration_minutes, tags')
        .limit(5);
      
      if (error) {
        console.warn('Tutorial fetch warning:', error.message);
        return [];
      }
      return data || [];
    }

    const searchTerm = query.toLowerCase().trim();

    // Search by title, description, category, or tags
    const { data, error } = await supabase
      .from('tutorials')
      .select('id, title, description, youtube_url, youtube_video_id, category, difficulty, duration_minutes, tags')
      .or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,tags.ilike.%${searchTerm}%`
      )
      .limit(10);

    if (error) {
      console.warn('Tutorial search warning:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Tutorial search error:', err.message);
    return [];
  }
}

/**
 * Get tutorials by category
 */
export async function getTutorialsByCategory(category) {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('tutorials')
      .select('id, title, description, youtube_url, youtube_video_id, category, difficulty, duration_minutes, tags')
      .eq('category', category)
      .limit(8);

    return error ? [] : (data || []);
  } catch (err) {
    console.error('Get tutorials by category error:', err);
    return [];
  }
}

/**
 * Get all available categories
 */
export async function getTutorialCategories() {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('tutorials')
      .select('category')
      .not('category', 'is', null);

    if (error || !data) return [];

    // Get unique categories
    const categories = [...new Set(data.map(t => t.category))];
    return categories;
  } catch (err) {
    console.error('Get categories error:', err);
    return [];
  }
}

/**
 * Format tutorial for display
 */
export function formatTutorialMessage(tutorials) {
  if (!tutorials || tutorials.length === 0) {
    return null;
  }

  let message = '📚 **Here are some great tutorials for you:**\n\n';

  tutorials.forEach((tutorial, index) => {
    message += `**${index + 1}. ${tutorial.title}**\n`;
    message += `📌 Category: ${tutorial.category} | Difficulty: ${tutorial.difficulty}\n`;
    message += `⏱️ Duration: ${tutorial.duration_minutes || 'N/A'} minutes\n`;
    message += `📝 ${tutorial.description}\n`;
    message += `🔗 **Watch Video**: ${tutorial.youtube_url}\n\n`;
  });

  return message;
}
