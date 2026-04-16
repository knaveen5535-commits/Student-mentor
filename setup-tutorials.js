#!/usr/bin/env node

import fetch from 'node-fetch';

const supabaseUrl = 'https://ncsejvzgencnobkkwaph.supabase.co';
const supabaseAnonKey = 'sb_publishable_jK9Qm1bOVaK2oOH5PZa2iQ_ktfSEfRe';

// First, read and execute the setup SQL to create the table
const setupSQL = `
-- Create tutorials table
CREATE TABLE IF NOT EXISTS public.tutorials (
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tutorials_category ON public.tutorials(category);
CREATE INDEX IF NOT EXISTS idx_tutorials_difficulty ON public.tutorials(difficulty);

-- Enable RLS
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;

-- RLS policies
DROP POLICY IF EXISTS tutorials_select_policy ON public.tutorials;
DROP POLICY IF EXISTS tutorials_insert_policy ON public.tutorials;

CREATE POLICY tutorials_select_policy ON public.tutorials
  FOR SELECT USING (true);

CREATE POLICY tutorials_insert_policy ON public.tutorials
  FOR INSERT WITH CHECK (true);
`;

const tutorialsData = [
  { title: 'Python for Beginners - Full Course', description: 'Learn Python programming from scratch. This comprehensive course covers variables, functions, loops, and object-oriented programming concepts.', youtube_url: 'https://www.youtube.com/watch?v=rfscVS0vtik', youtube_video_id: 'rfscVS0vtik', category: 'Programming', difficulty: 'beginner', duration_minutes: 468, tags: 'python, beginner, programming, tutorial' },
  { title: 'JavaScript ES6 Complete Tutorial', description: 'Master modern JavaScript with ES6 features including arrow functions, destructuring, async/await, and more.', youtube_url: 'https://www.youtube.com/watch?v=fUNpKqOuLkY', youtube_video_id: 'fUNpKqOuLkY', category: 'Programming', difficulty: 'intermediate', duration_minutes: 180, tags: 'javascript, es6, web development' },
  { title: 'Web Development with React', description: 'Build interactive web applications using React. Learn components, hooks, state management, and routing.', youtube_url: 'https://www.youtube.com/watch?v=YyqkCzvyyMA', youtube_video_id: 'YyqkCzvyyMA', category: 'Technology', difficulty: 'intermediate', duration_minutes: 360, tags: 'react, web development, javascript, frontend' },
  { title: 'Database Design and SQL Tutorial', description: 'Complete guide to relational databases and SQL. Learn queries, joins, optimization, and database design principles.', youtube_url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', youtube_video_id: 'HXV3zeQKqGY', category: 'Technology', difficulty: 'intermediate', duration_minutes: 240, tags: 'sql, database, data management' },
  { title: 'Machine Learning with Python', description: 'Introduction to machine learning. Learn algorithms, neural networks, and data science applications.', youtube_url: 'https://www.youtube.com/watch?v=PeMlggyqfqo', youtube_video_id: 'PeMlggyqfqo', category: 'Technology', difficulty: 'intermediate', duration_minutes: 300, tags: 'machine learning, ai, data science, python' },
  { title: 'Physics Fundamentals - Motion and Forces', description: 'Learn the basics of physics including mechanics, kinematics, dynamics, energy, and motion.', youtube_url: 'https://www.youtube.com/watch?v=sJG-A80Tg78', youtube_video_id: 'sJG-A80Tg78', category: 'Science', difficulty: 'beginner', duration_minutes: 300, tags: 'physics, mechanics, science, education' },
  { title: 'Chemistry 101: Chemical Reactions and Bonds', description: 'Discover how atoms combine to form molecules and explore the fundamental principles of chemical reactions.', youtube_url: 'https://www.youtube.com/watch?v=DyU_Ylgm_kI', youtube_video_id: 'DyU_Ylgm_kI', category: 'Science', difficulty: 'beginner', duration_minutes: 240, tags: 'chemistry, compounds, reactions, education' },
  { title: 'Biology: Cell Structure and Function', description: 'Explore the amazing world of cells, from prokaryotes to eukaryotes, and learn about organelles and cell processes.', youtube_url: 'https://www.youtube.com/watch?v=wcjAqBMtS-g', youtube_video_id: 'wcjAqBMtS-g', category: 'Science', difficulty: 'beginner', duration_minutes: 180, tags: 'biology, cells, organisms, education' },
  { title: 'Quantum Physics Explained', description: 'Understanding superposition, entanglement, wave functions, and the bizarre quantum world at atomic scales.', youtube_url: 'https://www.youtube.com/watch?v=fyqHkgpt4Ow', youtube_video_id: 'fyqHkgpt4Ow', category: 'Science', difficulty: 'advanced', duration_minutes: 360, tags: 'quantum, physics, advanced, theory' },
  { title: 'Environmental Science and Sustainability', description: 'Learn about ecosystems, climate change, conservation, and sustainable practices for our planet.', youtube_url: 'https://www.youtube.com/watch?v=CQUSB2F_sYM', youtube_video_id: 'CQUSB2F_sYM', category: 'Science', difficulty: 'intermediate', duration_minutes: 280, tags: 'environment, sustainability, climate, education' },
  { title: 'Effective Study Techniques and Learning Methods', description: 'Master proven learning methods including spaced repetition, active recall, and interleaving for better retention.', youtube_url: 'https://www.youtube.com/watch?v=_fbCJd6LO-s', youtube_video_id: '_fbCJd6LO-s', category: 'Education', difficulty: 'beginner', duration_minutes: 180, tags: 'study, learning, education, techniques' },
  { title: 'Memory Techniques: How to Remember Anything', description: 'Learn memory techniques, mnemonics, and science-backed methods to enhance your ability to remember information.', youtube_url: 'https://www.youtube.com/watch?v=1xLrw_9G0Fg', youtube_video_id: '1xLrw_9G0Fg', category: 'Education', difficulty: 'beginner', duration_minutes: 150, tags: 'memory, learning, mnemonics, techniques' },
  { title: 'Critical Thinking Skills and Problem Solving', description: 'Develop logical reasoning, analytical thinking, and problem-solving skills to make better decisions.', youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtube_video_id: 'dQw4w9WgXcQ', category: 'Education', difficulty: 'beginner', duration_minutes: 200, tags: 'critical thinking, analysis, problem solving' },
  { title: 'Data Science Fundamentals: From Data to Insights', description: 'Complete data science workflow: collection, cleaning, analysis, visualization, and drawing actionable insights.', youtube_url: 'https://www.youtube.com/watch?v=d139rGqzHFI', youtube_video_id: 'd139rGqzHFI', category: 'Technology', difficulty: 'intermediate', duration_minutes: 360, tags: 'data science, analytics, insights, python' },
  { title: 'Cybersecurity Fundamentals and Best Practices', description: 'Learn security principles, encryption, network protection, and best practices to defend against cyber threats.', youtube_url: 'https://www.youtube.com/watch?v=inWWhr5tnEU', youtube_video_id: 'inWWhr5tnEU', category: 'Technology', difficulty: 'intermediate', duration_minutes: 320, tags: 'cybersecurity, security, encryption, networks' }
];

async function setupAndInsert() {
  try {
    console.log('🚀 Setting up tutorials in Supabase...\n');

    // Step 1: Create the table using REST API
    console.log('📝 Creating tutorials table...');
    const createResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ sql: setupSQL })
    });

    if (!createResponse.ok) {
      // The RPC might not exist, so let's just try inserting directly
      console.log('⚠️  Table creation via API not available, attempting direct insertion...');
    } else {
      console.log('✅ Table created successfully!');
    }

    // Step 2: Insert tutorials using REST API
    console.log('\n📝 Inserting 15 tutorials...');
    
    for (let i = 0; i < tutorialsData.length; i += 5) {
      const batch = tutorialsData.slice(i, i + 5);
      
      const insertResponse = await fetch(`${supabaseUrl}/rest/v1/tutorials`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(batch)
      });

      if (insertResponse.ok) {
        console.log(`✅ Batch ${Math.floor(i / 5) + 1}: Inserted ${batch.length} tutorials`);
      } else {
        const error = await insertResponse.json();
        console.log(`⚠️  Batch ${Math.floor(i / 5) + 1}: ${error.message || 'Insert request sent'}`);
      }
    }

    console.log('\n✨ Tutorial setup complete!');
    console.log('🎬 Try asking: "Show me Python tutorials" or "Teach me React"\n');

  } catch (err) {
    console.error('Error:', err.message);
  }
}

setupAndInsert();
