const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase credentials (use service role key for admin operations)
const supabaseUrl = 'https://ncsejvzgencnobkkwaph.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

// For now, we'll use the anon key with the SQL provided
const supabaseAnonKey = 'sb_publishable_jK9Qm1bOVaK2oOH5PZa2iQ_ktfSEfRe';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database tables...\n');

    // Create users table
    console.log('📝 Creating users table...');
    const { error: usersTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }).catch(() => ({ error: null })); // Ignore if RPC doesn't exist

    // Alternative: Create tables without RPC
    console.log('📝 Creating users table (direct method)...');
    try {
      // Try to select from users table to see if it exists
      const { error: selectError } = await supabase.from('users').select('id').limit(1);
      if (selectError && selectError.code === 'PGRST116') {
        console.log('   Users table does not exist, attempting to create via schema...');
      } else if (!selectError) {
        console.log('   ✅ Users table already exists');
      }
    } catch (e) {
      console.log('   Info:', e);
    }

    // Create messages table
    console.log('📝 Creating messages table...');
    try {
      const { error: selectError } = await supabase.from('messages').select('id').limit(1);
      if (selectError && selectError.code === 'PGRST116') {
        console.log('   Messages table does not exist');
      } else if (!selectError) {
        console.log('   ✅ Messages table already exists');
      }
    } catch (e) {
      console.log('   Info:', e);
    }

    console.log('\n⚠️  Note: To create tables, you need to:');
    console.log('   1. Go to Supabase Dashboard → SQL Editor');
    console.log('   2. Copy the content from supabase/setup.sql');
    console.log('   3. Paste and execute it in the SQL editor');
    console.log('   4. Then run this script again to insert data\n');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setupDatabase();
