import jwt from 'jsonwebtoken';
import { getSupabaseAdmin } from '../services/supabase.service.js';
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

    const supabase = getSupabaseAdmin();
    const { data: savedUser, error: upsertError } = await supabase
      .from('users')
      .upsert(
        {
          google_id: user.id,
          name: user.name,
          email: user.email,
          profile_pic: user.picture
        },
        { onConflict: 'google_id' }
      )
      .select('id, google_id, name, email, profile_pic')
      .single();

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError.message);
      return res.status(500).json({ error: 'Failed to save user' });
    }

    // Save user to in-memory store (replace with database in production)
    users.set(user.id, {
      googleId: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      provider: user.provider
    });

    res.json({
      message: 'Login successful and user saved',
      user: savedUser
    });
  } catch (error) {
    console.error('Google auth error:', error.message);
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

/**
 * Create or update user in Supabase (for demo/email-based auth)
 * Called by frontend after user logs in via demo mode
 */
export async function ensureUserExists(req, res, next) {
  try {
    const { email, name, picture } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'email is required' });
    }

    const supabase = getSupabaseAdmin();
    const trimmedEmail = email.trim();

    // Check if user exists
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', trimmedEmail)
      .maybeSingle();

    if (selectError) {
      // If table doesn't exist or other error, just return success
      // The user will be created when they first use a feature that needs the DB
      return res.json({
        user: {
          email: trimmedEmail,
          name: (name || trimmedEmail.split('@')[0]).trim(),
          picture
        }
      });
    }

    // If user exists, return their data
    if (existingUser) {
      return res.json({
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          picture
        }
      });
    }

    // If user doesn't exist, create them
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: trimmedEmail,
        name: (name || trimmedEmail.split('@')[0]).trim(),
        avatar_url: picture || null
      })
      .select('id, email, name')
      .single();

    if (insertError) {
      // If table doesn't exist or other error, just return success
      // The user will be created when they first use a feature that needs the DB
      return res.json({
        user: {
          email: trimmedEmail,
          name: (name || trimmedEmail.split('@')[0]).trim(),
          picture
        }
      });
    }

    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        picture
      }
    });
  } catch (error) {
    // Don't fail the login on Supabase errors - just log and continue
    console.error('ensure-user error:', error.message);
    const { email, name, picture } = (req.body || {});
    res.json({
      user: {
        email,
        name,
        picture
      }
    });
  }
}
