import express from 'express';
import { setupTutorialsTable, populateTutorials } from '../services/setup.service.js';

const router = express.Router();

/**
 * Initialize tutorials table and data
 */
router.post('/initialize-tutorials', async (req, res) => {
  try {
    // Step 1: Check/setup table
    const tableSetup = await setupTutorialsTable();
    
    if (!tableSetup.success && tableSetup.action) {
      return res.status(400).json({
        success: false,
        message: tableSetup.message,
        action: tableSetup.action,
        instructions: `
          1. Go to https://app.supabase.com
          2. Select project: ncsejvzgencnobkkwaph
          3. Click SQL Editor → New Query
          4. Copy content from supabase/setup.sql
          5. Paste and click Run
        `
      });
    }

    // Step 2: Populate tutorials
    const populateResult = await populateTutorials();

    res.json({
      success: populateResult.success,
      message: populateResult.message,
      error: populateResult.error
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * Check tutorials status
 */
router.get('/tutorials-status', async (req, res) => {
  try {
    const setupResult = await setupTutorialsTable();
    res.json(setupResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
