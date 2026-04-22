import express from 'express';
import { searchTutorials, getTutorialsByCategory, getTutorialCategories } from '../services/tutorials.service.js';
import { searchYouTubeVideos } from '../services/youtube.service.js';

const router = express.Router();

/**
 * Search tutorials by keyword
 * GET /api/tutorials/search?q=python
 */
router.get('/search', async (req, res) => {
  try {
    const { q, category, difficulty } = req.query;
    
    let tutorials = [];
    
    if (q) {
      // Search by keyword
      tutorials = await searchTutorials(q);
    } else if (category) {
      // Search by category
      tutorials = await getTutorialsByCategory(category);
    } else {
      // Get all tutorials (random selection)
      tutorials = await searchTutorials('');
    }
    
    // Filter by difficulty if specified
    if (difficulty && tutorials.length > 0) {
      tutorials = tutorials.filter(t => t.difficulty === difficulty);
    }

    res.json({
      success: true,
      count: tutorials.length,
      tutorials
    });
  } catch (err) {
    console.error('Tutorial search error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to search tutorials'
    });
  }
});

/**
 * Get tutorials by category
 * GET /api/tutorials/category/programming
 */
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const tutorials = await getTutorialsByCategory(category);

    res.json({
      success: true,
      category,
      count: tutorials.length,
      tutorials
    });
  } catch (err) {
    console.error('Get tutorials by category error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to get tutorials by category'
    });
  }
});

/**
 * Get all available categories
 * GET /api/tutorials/categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await getTutorialCategories();

    res.json({
      success: true,
      categories
    });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to get tutorial categories'
    });
  }
});

/**
 * Search YouTube educational videos natively
 * GET /api/tutorials/youtube/search?q=physics
 */
router.get('/youtube/search', async (req, res) => {
  try {
    const { q, limit } = req.query;
    const maxResults = limit ? parseInt(limit, 10) : 5;
    
    const videos = await searchYouTubeVideos({ query: q || '', maxResults });
    
    res.json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (err) {
    console.error('YouTube search route error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to search YouTube videos'
    });
  }
});

export default router;
