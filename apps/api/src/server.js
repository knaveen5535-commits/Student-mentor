import './config/dotenv.js';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

import { env } from './config/env.js';
import './config/passport.js'; // Initialize passport configuration
import { errorMiddleware } from './middleware/error.middleware.js';
import { chatRoutes } from './routes/chat.routes.js';
import { projectRoutes } from './routes/project.routes.js';
import { uploadRoutes } from './routes/upload.routes.js';
import { profileRoutes } from './routes/profile.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { aiRoutes } from './routes/ai.routes.js';
import tutorialsRoutes from './routes/tutorials.routes.js';
import setupRoutes from './routes/setup.routes.js';
import { uploadDir } from './services/file.service.js';
import { getSupabaseAdmin } from './services/supabase.service.js';

const app = express();


// Middleware
app.use(cors({ 
  origin: env.frontendUrl, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '2mb' }));

// Session configuration
app.use(
  session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Test Supabase connection
app.get('/test-db', async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      console.error('Supabase test-db error:', error.message);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    return res.json({ users: data });
  } catch (err) {
    console.error('Supabase test-db error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Save chat messages
app.post('/save-chat', async (req, res) => {
  try {
    const { user_id, message, response } = req.body || {};

    if (!user_id || !message || !response) {
      return res.status(400).json({ error: 'user_id, message, and response are required' });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('chat_history')
      .insert({ user_id, message, response })
      .select('id, user_id, message, response, created_at')
      .single();

    if (error) {
      console.error('Supabase save-chat error:', error.message);
      return res.status(500).json({ error: 'Failed to save chat message' });
    }

    return res.status(201).json({ chat: data });
  } catch (err) {
    console.error('Supabase save-chat error:', err.message);
    return res.status(500).json({ error: 'Failed to save chat message' });
  }
});

// Routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/api/ai', aiRoutes);
app.use('/projects', projectRoutes);
app.use('/uploads', uploadRoutes);
app.use('/profile', profileRoutes);
app.use('/tutorials', tutorialsRoutes);
app.use('/setup', setupRoutes);

app.use('/uploads', express.static(uploadDir));

// Error handling
app.use(errorMiddleware);

app.listen(env.port, '127.0.0.1', () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${env.port}`);
});
