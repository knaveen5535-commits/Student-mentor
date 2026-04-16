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
import tutorialsRoutes from './routes/tutorials.routes.js';
import setupRoutes from './routes/setup.routes.js';
import { uploadDir } from './services/file.service.js';

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

// Routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
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
