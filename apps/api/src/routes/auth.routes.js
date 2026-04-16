import express from 'express';
import passport from 'passport';
import {
  handleGoogleAuth,
  getCurrentUser,
  logout,
  verifyToken,
  ensureUserExists
} from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * Initiate Google OAuth flow
 * Frontend redirects to this endpoint to start login
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * Google OAuth callback
 * Google redirects here after user authenticates
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login/failed' }),
  handleGoogleAuth
);

/**
 * Get currently authenticated user
 * Requires JWT token in Authorization header
 */
router.get('/user', getCurrentUser);

/**
 * Verify if JWT token is valid
 * Requires JWT token in Authorization header
 */
router.get('/verify', verifyToken);

/**
 * Create or update user in Supabase (for demo/email-based auth)
 * POST body: { email, name?, picture? }
 */
router.post('/ensure-user', ensureUserExists);

/**
 * Logout endpoint
 */
router.post('/logout', logout);

/**
 * Login failed endpoint
 */
router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Authentication failed. Please try again.'
  });
});

export { router as authRoutes };
