-- ============================================
-- PASTE THIS INTO SUPABASE SQL EDITOR
-- ============================================
-- 
-- HOW TO USE:
-- 1. Go to https://app.supabase.com
-- 2. Select your project (ncsejvzgencnobkkwaph)
-- 3. Click "SQL Editor" on the left sidebar
-- 4. Click "New Query"
-- 5. Copy and paste THIS ENTIRE FILE into the query editor
-- 6. Click "Run"
--
-- ============================================

-- PROGRAMMING TUTORIALS
INSERT INTO tutorials (title, description, youtube_url, youtube_video_id, category, difficulty, duration_minutes, tags)
VALUES
  (
    'Python for Beginners - Full Course',
    'Learn Python programming from scratch. This comprehensive course covers variables, functions, loops, and object-oriented programming concepts.',
    'https://www.youtube.com/watch?v=rfscVS0vtik',
    'rfscVS0vtik',
    'Programming',
    'beginner',
    468,
    'python, beginner, programming, tutorial'
  ),
  (
    'JavaScript ES6 Complete Tutorial',
    'Master modern JavaScript with ES6 features including arrow functions, destructuring, async/await, and more.',
    'https://www.youtube.com/watch?v=fUNpKqOuLkY',
    'fUNpKqOuLkY',
    'Programming',
    'intermediate',
    180,
    'javascript, es6, web development'
  ),
  (
    'Web Development with React',
    'Build interactive web applications using React. Learn components, hooks, state management, and routing.',
    'https://www.youtube.com/watch?v=YyqkCzvyyMA',
    'YyqkCzvyyMA',
    'Technology',
    'intermediate',
    360,
    'react, web development, javascript, frontend'
  ),
  (
    'Database Design and SQL Tutorial',
    'Complete guide to relational databases and SQL. Learn queries, joins, optimization, and database design principles.',
    'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    'HXV3zeQKqGY',
    'Technology',
    'intermediate',
    240,
    'sql, database, data management'
  ),
  (
    'Machine Learning with Python',
    'Introduction to machine learning. Learn algorithms, neural networks, and data science applications.',
    'https://www.youtube.com/watch?v=PeMlggyqfqo',
    'PeMlggyqfqo',
    'Technology',
    'intermediate',
    300,
    'machine learning, ai, data science, python'
  ),

-- SCIENCE TUTORIALS
  (
    'Physics Fundamentals - Motion and Forces',
    'Learn the basics of physics including mechanics, kinematics, dynamics, energy, and motion.',
    'https://www.youtube.com/watch?v=sJG-A80Tg78',
    'sJG-A80Tg78',
    'Science',
    'beginner',
    300,
    'physics, mechanics, science, education'
  ),
  (
    'Chemistry 101: Chemical Reactions and Bonds',
    'Discover how atoms combine to form molecules and explore the fundamental principles of chemical reactions.',
    'https://www.youtube.com/watch?v=DyU_Ylgm_kI',
    'DyU_Ylgm_kI',
    'Science',
    'beginner',
    240,
    'chemistry, compounds, reactions, education'
  ),
  (
    'Biology: Cell Structure and Function',
    'Explore the amazing world of cells, from prokaryotes to eukaryotes, and learn about organelles and cell processes.',
    'https://www.youtube.com/watch?v=wcjAqBMtS-g',
    'wcjAqBMtS-g',
    'Science',
    'beginner',
    180,
    'biology, cells, organisms, education'
  ),
  (
    'Quantum Physics Explained',
    'Understanding superposition, entanglement, wave functions, and the bizarre quantum world at atomic scales.',
    'https://www.youtube.com/watch?v=fyqHkgpt4Ow',
    'fyqHkgpt4Ow',
    'Science',
    'advanced',
    360,
    'quantum, physics, advanced, theory'
  ),
  (
    'Environmental Science and Sustainability',
    'Learn about ecosystems, climate change, conservation, and sustainable practices for our planet.',
    'https://www.youtube.com/watch?v=CQUSB2F_sYM',
    'CQUSB2F_sYM',
    'Science',
    'intermediate',
    280,
    'environment, sustainability, climate, education'
  ),

-- EDUCATION & LEARNING TUTORIALS
  (
    'Effective Study Techniques and Learning Methods',
    'Master proven learning methods including spaced repetition, active recall, and interleaving for better retention.',
    'https://www.youtube.com/watch?v=_fbCJd6LO-s',
    '_fbCJd6LO-s',
    'Education',
    'beginner',
    180,
    'study, learning, education, techniques'
  ),
  (
    'Memory Techniques: How to Remember Anything',
    'Learn memory techniques, mnemonics, and science-backed methods to enhance your ability to remember information.',
    'https://www.youtube.com/watch?v=1xLrw_9G0Fg',
    '1xLrw_9G0Fg',
    'Education',
    'beginner',
    150,
    'memory, learning, mnemonics, techniques'
  ),
  (
    'Critical Thinking Skills and Problem Solving',
    'Develop logical reasoning, analytical thinking, and problem-solving skills to make better decisions.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'dQw4w9WgXcQ',
    'Education',
    'beginner',
    200,
    'critical thinking, analysis, problem solving'
  ),
  (
    'Data Science Fundamentals: From Data to Insights',
    'Complete data science workflow: collection, cleaning, analysis, visualization, and drawing actionable insights.',
    'https://www.youtube.com/watch?v=d139rGqzHFI',
    'd139rGqzHFI',
    'Technology',
    'intermediate',
    360,
    'data science, analytics, insights, python'
  ),
  (
    'Cybersecurity Fundamentals and Best Practices',
    'Learn security principles, encryption, network protection, and best practices to defend against cyber threats.',
    'https://www.youtube.com/watch?v=inWWhr5tnEU',
    'inWWhr5tnEU',
    'Technology',
    'intermediate',
    320,
    'cybersecurity, security, encryption, networks'
  );
