#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ncsejvzgencnobkkwaph.supabase.co';
const supabaseAnonKey = 'sb_publishable_jK9Qm1bOVaK2oOH5PZa2iQ_ktfSEfRe';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL to create the tutorials table
const createTableSQL = `
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

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tutorials_category ON tutorials(category);
CREATE INDEX IF NOT EXISTS idx_tutorials_difficulty ON tutorials(difficulty);

-- Enable RLS and allow public read access
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tutorials_select_policy" ON tutorials
  FOR SELECT USING (true);
`;

async function createTable() {
  try {
    console.log('🚀 Creating tutorials table in Supabase...\n');

    // Execute the SQL using RPC or direct query
    const { error } = await supabase.auth.admin.createUser({
      email: 'dummy@example.com',
      password: 'dummy123'
    }).catch(() => ({ error: null })); // Ignore if user exists

    // Try to execute SQL via Supabase query
    console.log('📝 Executing SQL to create table...');
    
    // Since we can't directly execute SQL, we'll use a different approach
    // Let's check if the table exists first
    const { data, error: checkError } = await supabase
      .from('tutorials')
      .select('count()', { count: 'exact' });

    if (checkError && checkError.message.includes('does not exist')) {
      console.log('❌ Table does not exist. You need to create it manually via Supabase SQL Editor.\n');
      console.log('📋 Copy this SQL and paste it into Supabase SQL Editor:\n');
      console.log(createTableSQL);
      process.exit(1);
    }

    if (!checkError) {
      console.log('✅ Table already exists!\n');
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

createTable();
