-- ============================================
-- AI MENTOR DATABASE SETUP
-- ============================================

-- Create USERS table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create MESSAGES table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create PROJECTS table (optional, for future use)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CHAT_THREADS table (optional, for chat history)
CREATE TABLE IF NOT EXISTS chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CHAT_MESSAGES table (optional, for chat history)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create TUTORIALS table (for educational videos)
CREATE TABLE IF NOT EXISTS tutorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  youtube_url VARCHAR(500) NOT NULL,
  youtube_video_id VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  difficulty VARCHAR(20) DEFAULT 'beginner',
  duration_minutes INT,
  tags TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Index for faster user lookups by email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index for faster message queries by user
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);

-- Index for faster project queries by user
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);

-- Index for chat thread queries
CREATE INDEX IF NOT EXISTS idx_chat_threads_user_id ON chat_threads(user_id);

-- Index for chat message queries by thread
CREATE INDEX IF NOT EXISTS idx_chat_messages_thread_id ON chat_messages(thread_id);

-- Index for tutorial lookups by category
CREATE INDEX IF NOT EXISTS idx_tutorials_category ON tutorials(category);

-- Index for tutorial lookups by tags
CREATE INDEX IF NOT EXISTS idx_tutorials_tags ON tutorials(tags);

-- Index for tutorial difficulty
CREATE INDEX IF NOT EXISTS idx_tutorials_difficulty ON tutorials(difficulty);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Enable RLS on chat_threads table
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;

-- Enable RLS on chat_messages table
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Enable RLS on tutorials table
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Users can read all tutorials (public learning resources)
CREATE POLICY "Everyone can read tutorials"
  ON tutorials FOR SELECT
  USING (true);

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can read their own messages
CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own messages
CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can read their own projects
CREATE POLICY "Users can read own projects"
  ON projects FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own projects
CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- VERIFICATION QUERIES (RUN THESE TO CHECK)
-- ============================================

-- Check if tables were created
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Count records
-- SELECT 'users' as table_name, COUNT(*) as count FROM users
-- UNION ALL
-- SELECT 'messages', COUNT(*) FROM messages;
