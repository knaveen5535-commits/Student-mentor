import './dotenv.js';

const port = Number(process.env.PORT || 5000);
const apiUrl = process.env.API_URL || `http://localhost:${port}`;

export const env = {
  port,
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  // Frontend URL for redirects
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  apiUrl,
  // JWT Secret
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  // Session
  sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production'
};
