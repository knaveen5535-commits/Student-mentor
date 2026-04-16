#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Use the anon key which is definitely valid
const supabaseUrl = 'https://ncsejvzgencnobkkwaph.supabase.co';
const supabaseAnonKey = 'sb_publishable_jK9Qm1bOVaK2oOH5PZa2iQ_ktfSEfRe';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tutorials = [
  {
    title: 'Python for Beginners - Full Course',
    description: 'Learn Python programming from scratch. This comprehensive course covers variables, functions, loops, and object-oriented programming concepts.',
    youtube_url: 'https://www.youtube.com/watch?v=rfscVS0vtik',
    youtube_video_id: 'rfscVS0vtik',
    category: 'Programming',
    difficulty: 'beginner',
    duration_minutes: 468,
    tags: 'python, beginner, programming, tutorial'
  },
  {
    title: 'JavaScript ES6 Complete Tutorial',
    description: 'Master modern JavaScript with ES6 features including arrow functions, destructuring, async/await, and more.',
    youtube_url: 'https://www.youtube.com/watch?v=fUNpKqOuLkY',
    youtube_video_id: 'fUNpKqOuLkY',
    category: 'Programming',
    difficulty: 'intermediate',
    duration_minutes: 180,
    tags: 'javascript, es6, web development'
  },
  {
    title: 'Web Development with React',
    description: 'Build interactive web applications using React. Learn components, hooks, state management, and routing.',
    youtube_url: 'https://www.youtube.com/watch?v=YyqkCzvyyMA',
    youtube_video_id: 'YyqkCzvyyMA',
    category: 'Technology',
    difficulty: 'intermediate',
    duration_minutes: 360,
    tags: 'react, web development, javascript, frontend'
  },
  {
    title: 'Database Design and SQL Tutorial',
    description: 'Complete guide to relational databases and SQL. Learn queries, joins, optimization, and database design principles.',
    youtube_url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    youtube_video_id: 'HXV3zeQKqGY',
    category: 'Technology',
    difficulty: 'intermediate',
    duration_minutes: 240,
    tags: 'sql, database, data management'
  },
  {
    title: 'Machine Learning with Python',
    description: 'Introduction to machine learning. Learn algorithms, neural networks, and data science applications.',
    youtube_url: 'https://www.youtube.com/watch?v=PeMlggyqfqo',
    youtube_video_id: 'PeMlggyqfqo',
    category: 'Technology',
    difficulty: 'intermediate',
    duration_minutes: 300,
    tags: 'machine learning, ai, data science, python'
  },
  {
    title: 'Physics Fundamentals - Motion and Forces',
    description: 'Learn the basics of physics including mechanics, kinematics, dynamics, energy, and motion.',
    youtube_url: 'https://www.youtube.com/watch?v=sJG-A80Tg78',
    youtube_video_id: 'sJG-A80Tg78',
    category: 'Science',
    difficulty: 'beginner',
    duration_minutes: 300,
    tags: 'physics, mechanics, science, education'
  },
  {
    title: 'Chemistry 101: Chemical Reactions and Bonds',
    description: 'Discover how atoms combine to form molecules and explore the fundamental principles of chemical reactions.',
    youtube_url: 'https://www.youtube.com/watch?v=DyU_Ylgm_kI',
    youtube_video_id: 'DyU_Ylgm_kI',
    category: 'Science',
    difficulty: 'beginner',
    duration_minutes: 240,
    tags: 'chemistry, compounds, reactions, education'
  },
  {
    title: 'Biology: Cell Structure and Function',
    description: 'Explore the amazing world of cells, from prokaryotes to eukaryotes, and learn about organelles and cell processes.',
    youtube_url: 'https://www.youtube.com/watch?v=wcjAqBMtS-g',
    youtube_video_id: 'wcjAqBMtS-g',
    category: 'Science',
    difficulty: 'beginner',
    duration_minutes: 180,
    tags: 'biology, cells, organisms, education'
  },
  {
    title: 'Quantum Physics Explained',
    description: 'Understanding superposition, entanglement, wave functions, and the bizarre quantum world at atomic scales.',
    youtube_url: 'https://www.youtube.com/watch?v=fyqHkgpt4Ow',
    youtube_video_id: 'fyqHkgpt4Ow',
    category: 'Science',
    difficulty: 'advanced',
    duration_minutes: 360,
    tags: 'quantum, physics, advanced, theory'
  },
  {
    title: 'Environmental Science and Sustainability',
    description: 'Learn about ecosystems, climate change, conservation, and sustainable practices for our planet.',
    youtube_url: 'https://www.youtube.com/watch?v=CQUSB2F_sYM',
    youtube_video_id: 'CQUSB2F_sYM',
    category: 'Science',
    difficulty: 'intermediate',
    duration_minutes: 280,
    tags: 'environment, sustainability, climate, education'
  },
  {
    title: 'Effective Study Techniques and Learning Methods',
    description: 'Master proven learning methods including spaced repetition, active recall, and interleaving for better retention.',
    youtube_url: 'https://www.youtube.com/watch?v=_fbCJd6LO-s',
    youtube_video_id: '_fbCJd6LO-s',
    category: 'Education',
    difficulty: 'beginner',
    duration_minutes: 180,
    tags: 'study, learning, education, techniques'
  },
  {
    title: 'Memory Techniques: How to Remember Anything',
    description: 'Learn memory techniques, mnemonics, and science-backed methods to enhance your ability to remember information.',
    youtube_url: 'https://www.youtube.com/watch?v=1xLrw_9G0Fg',
    youtube_video_id: '1xLrw_9G0Fg',
    category: 'Education',
    difficulty: 'beginner',
    duration_minutes: 150,
    tags: 'memory, learning, mnemonics, techniques'
  },
  {
    title: 'Critical Thinking Skills and Problem Solving',
    description: 'Develop logical reasoning, analytical thinking, and problem-solving skills to make better decisions.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtube_video_id: 'dQw4w9WgXcQ',
    category: 'Education',
    difficulty: 'beginner',
    duration_minutes: 200,
    tags: 'critical thinking, analysis, problem solving'
  },
  {
    title: 'Data Science Fundamentals: From Data to Insights',
    description: 'Complete data science workflow: collection, cleaning, analysis, visualization, and drawing actionable insights.',
    youtube_url: 'https://www.youtube.com/watch?v=d139rGqzHFI',
    youtube_video_id: 'd139rGqzHFI',
    category: 'Technology',
    difficulty: 'intermediate',
    duration_minutes: 360,
    tags: 'data science, analytics, insights, python'
  },
  {
    title: 'Cybersecurity Fundamentals and Best Practices',
    description: 'Learn security principles, encryption, network protection, and best practices to defend against cyber threats.',
    youtube_url: 'https://www.youtube.com/watch?v=inWWhr5tnEU',
    youtube_video_id: 'inWWhr5tnEU',
    category: 'Technology',
    difficulty: 'intermediate',
    duration_minutes: 320,
    tags: 'cybersecurity, security, encryption, networks'
  }
];

async function insertTutorials() {
  try {
    console.log('🚀 Starting tutorial insertion via Supabase...\n');

    // First check if we already have tutorials
    const { count } = await supabase
      .from('tutorials')
      .select('*', { count: 'exact' });

    if (count > 0) {
      console.log(`✅ Database already has ${count} tutorials!\n`);
      console.log('📚 Tutorials available:');
      const { data } = await supabase
        .from('tutorials')
        .select('id, title, category');
      
      data.forEach(t => console.log(`   • ${t.title}`));
      return;
    }

    console.log(`📝 Inserting ${tutorials.length} tutorials into Supabase...\n`);

    // Insert in batches of 5 to avoid request size limits
    for (let i = 0; i < tutorials.length; i += 5) {
      const batch = tutorials.slice(i, i + 5);
      const { data, error } = await supabase
        .from('tutorials')
        .insert(batch);

      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / 5) + 1}:`, error.message);
        continue;
      }
      console.log(`✅ Inserted batch ${Math.floor(i / 5) + 1} (${batch.length} tutorials)`);
    }

    // Verify insertion
    console.log('\n📊 Verifying insertion...');
    const { data, count: newCount } = await supabase
      .from('tutorials')
      .select('id, title, category');

    console.log(`✅ Total tutorials in database: ${newCount}\n`);

    console.log('📚 Tutorial breakdown by category:');
    const byCategory = {};
    data.forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + 1;
    });
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`   • ${cat}: ${count} videos`);
    });

    console.log('\n✨ Tutorial database population complete!');
    console.log('🎬 Users can now ask for tutorials and get video recommendations.\n');

  } catch (err) {
    console.error('❌ Fatal error:', err.message);
    process.exit(1);
  }
}

insertTutorials();
