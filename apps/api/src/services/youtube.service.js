import { env } from '../config/env.js';

/**
 * Gets the configured Google API key
 */
function getApiKey() {
  const apiKey = (process.env.GOOGLE_API_KEY || '').trim();
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY is not configured in the environment.');
  }
  return apiKey;
}

/**
 * Perform a generic fetch wrapper to YouTube API
 */
async function fetchYouTube(endpoint, params = {}) {
  const apiKey = getApiKey();
  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  
  url.searchParams.append('key', apiKey);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('YouTube API Error:', data.error?.message || response.statusText);
    throw new Error(`YouTube API failed: ${data.error?.message || response.statusText}`);
  }

  return data;
}

/**
 * Search YouTube for educational, tech, and science content
 * Captures core data, statistics (views/likes), and top comments.
 */
export async function searchYouTubeVideos({ query = '', maxResults = 5 }) {
  try {
    // 1. Search for videos
    // Fallback query to ensure educational scope if user query is blank
    const searchQuery = query.trim() ? `${query} education science technology` : 'education science technology tutorials';
    
    const searchData = await fetchYouTube('search', {
      part: 'snippet',
      q: searchQuery,
      type: 'video',
      maxResults: maxResults,
      safeSearch: 'strict'
    });

    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    // Extract video IDs
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');

    // 2. Fetch video statistics (Views, Likes/"Good Reviews")
    const statsData = await fetchYouTube('videos', {
      part: 'snippet,statistics',
      id: videoIds
    });

    // Match up the fetched videos into our cleanly formatted array
    const videos = statsData.items.map(item => {
      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        stats: {
          views: parseInt(item.statistics.viewCount || 0, 10),
          likes: parseInt(item.statistics.likeCount || 0, 10), // Acts as "Good Reviews"
          commentCount: parseInt(item.statistics.commentCount || 0, 10)
        },
        comments: [], // Will populate below
        url: `https://www.youtube.com/watch?v=${item.id}`
      };
    });

    // 3. Fetch top comments (Top / Relevant / "Good comments") in parallel
    const commentPromises = videos.map(async (v) => {
      try {
        const commentData = await fetchYouTube('commentThreads', {
          part: 'snippet',
          videoId: v.id,
          order: 'relevance', // Orders by "Good/Top" comments natively via YouTube algorithm
          maxResults: 3
        });

        if (commentData.items) {
          v.comments = commentData.items.map(c => {
            const topComment = c.snippet.topLevelComment.snippet;
            return {
              author: topComment.authorDisplayName,
              text: topComment.textDisplay,
              likes: parseInt(topComment.likeCount || 0, 10)
            };
          });
        }
      } catch (err) {
        console.warn(`Could not fetch comments for video ${v.id}: ${err.message}`);
        // Comments might be disabled on the video
        v.comments = [];
      }
      return v;
    });

    await Promise.all(commentPromises);

    return videos;
  } catch (error) {
    console.error('Service error in searchYouTubeVideos:', error);
    throw error;
  }
}
