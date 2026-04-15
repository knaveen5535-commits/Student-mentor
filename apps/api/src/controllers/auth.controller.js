import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Store users in memory (In production, use database)
const users = new Map();

/**
 * Handle successful Google authentication
 * This is called after the user authenticates with Google
 */
export async function handleGoogleAuth(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Save user to in-memory store (replace with database in production)
    users.set(user.id, {
      googleId: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      provider: user.provider
    });

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name
      },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    const redirectUrl = `${env.frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      })
    )}`;

    res.redirect(redirectUrl);
  } catch (error) {
    res.status(500).json({
      error: 'Authentication failed',
      message: error.message
    });
  }
}

/**
 * Get current logged-in user
 */
export function getCurrentUser(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = users.get(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      picture: user.picture,
      provider: user.provider
    });
  } catch (error) {
    res.status(401).json({
      error: 'Invalid or expired token',
      message: error.message
    });
  }
}

/**
 * Logout user (frontend-side, token invalidation)
 */
export function logout(req, res) {
  try {
    // In production with JWT, you might want to blacklist the token
    // For now, just return success - frontend will clear localStorage
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({
      error: 'Logout failed',
      message: error.message
    });
  }
}

/**
 * Verify JWT token
 */
export function verifyToken(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ valid: false, error: 'No token provided' });
    }

    jwt.verify(token, env.jwtSecret);
    res.json({ valid: true });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: 'Invalid or expired token'
    });
  }
}
