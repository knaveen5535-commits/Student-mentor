const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://ncsejvzgencnobkkwaph.supabase.co';
const supabaseAnonKey = 'sb_publishable_jK9Qm1bOVaK2oOH5PZa2iQ_ktfSEfRe';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Users data
const users = [
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'John Smith', email: 'john.smith@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Sarah Johnson', email: 'sarah.johnson@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
  { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Michael Brown', email: 'michael.brown@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
  { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Emily Davis', email: 'emily.davis@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', created_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000) },
  { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Robert Wilson', email: 'robert.wilson@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert', created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
  { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Jessica Garcia', email: 'jessica.garcia@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica', created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000) },
  { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Daniel Martinez', email: 'daniel.martinez@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel', created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
  { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Amanda Lee', email: 'amanda.lee@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda', created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
  { id: '550e8400-e29b-41d4-a716-446655440009', name: 'Christopher Anderson', email: 'christopher.anderson@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
  { id: '550e8400-e29b-41d4-a716-446655440010', name: 'Olivia Taylor', email: 'olivia.taylor@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia', created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
  { id: '550e8400-e29b-41d4-a716-446655440011', name: 'James Thomas', email: 'james.thomas@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  { id: '550e8400-e29b-41d4-a716-446655440012', name: 'Sophia Jackson', email: 'sophia.jackson@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
];

// Messages data
const messages = [
  { id: '650e8400-e29b-41d4-a716-446655440001', user_id: '550e8400-e29b-41d4-a716-446655440001', content: 'Can someone help me understand machine learning concepts?', created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
  { id: '650e8400-e29b-41d4-a716-446655440002', user_id: '550e8400-e29b-41d4-a716-446655440002', content: 'I just completed my first Python project! Check it out on GitHub.', created_at: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000) },
  { id: '650e8400-e29b-41d4-a716-446655440003', user_id: '550e8400-e29b-41d4-a716-446655440003', content: 'What are the best practices for code documentation?', created_at: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000) },
  { id: '650e8400-e29b-41d4-a716-446655440004', user_id: '550e8400-e29b-41d4-a716-446655440001', content: 'I recommend checking out the official documentation and Stack Overflow.', created_at: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000) },
  { id: '650e8400-e29b-41d4-a716-446655440005', user_id: '550e8400-e29b-41d4-a716-446655440004', content: 'How do I debug this React component issue?', created_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000) },
  { id: '650e8400-e29b-41d4-a716-446655440006', user_id: '550e8400-e29b-41d4-a716-446655440005', content: 'Try using React DevTools browser extension. It saved my life!', created_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000) },
  { id: '650e8400-e29b-41d4-a716-446655440007', user_id: '550e8400-e29b-41d4-a716-446655440006', content: 'Learning web development has been challenging but rewarding.', created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) },
  { id: '650e8400-e29b-41d4-a716-446655440008', user_id: '550e8400-e29b-41d4-a716-446655440003', content: 'I found a great tutorial on TypeScript for beginners.', created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
  { id: '650e8400-e29b-41d4-a716-446655440009', user_id: '550e8400-e29b-41d4-a716-446655440007', content: 'Does anyone have experience with database optimization?', created_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000) },
  { id: '650e8400-e29b-41d4-a716-446655440010', user_id: '550e8400-e29b-41d4-a716-446655440002', content: 'Database indexing is crucial for performance. Start there!', created_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000) },
];

async function insertData() {
  try {
    console.log('🚀 Starting data insertion...\n');

    // Insert users
    console.log('📝 Inserting users...');
    const { error: usersError } = await supabase.from('users').insert(users);
    if (usersError) {
      console.error('❌ Error inserting users:', usersError);
      return;
    }
    console.log('✅ Successfully inserted', users.length, 'users\n');

    // Insert messages
    console.log('📝 Inserting messages...');
    const { error: messagesError } = await supabase.from('messages').insert(messages);
    if (messagesError) {
      console.error('❌ Error inserting messages:', messagesError);
      return;
    }
    console.log('✅ Successfully inserted', messages.length, 'messages\n');

    // Verify the data
    console.log('📊 Verifying inserted data...');
    const { data: usersData, error: usersCountError } = await supabase.from('users').select('count', { count: 'exact', head: true });
    const { data: messagesData, error: messagesCountError } = await supabase.from('messages').select('count', { count: 'exact', head: true });

    if (!usersCountError) console.log(`✓ Total users: ${usersData?.length || 0}`);
    if (!messagesCountError) console.log(`✓ Total messages: ${messagesData?.length || 0}`);

    console.log('\n✨ All data inserted successfully!');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

insertData();
