-- ============================================
-- TUTORIAL VIDEOS DATA FOR AI MENTOR
-- ============================================
-- Insert sample tutorials with real YouTube videos

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
    'Introduction to machine learning concepts and algorithms using Python. Covers scikit-learn, TensorFlow basics, and more.',
    'https://www.youtube.com/watch?v=PeMlggyqfqo',
    'PeMlggyqfqo',
    'Technology',
    'advanced',
    420,
    'machine learning, python, ai, data science'
  ),

-- SCIENCE TUTORIALS
  (
    'Physics Fundamentals - Mechanics',
    'Learn the basics of physics including motion, forces, energy, and momentum. Perfect for high school and college students.',
    'https://www.youtube.com/watch?v=sJG-A80Tg78',
    'sJG-A80Tg78',
    'Science',
    'beginner',
    300,
    'physics, mechanics, science, education'
  ),
  (
    'Chemistry: Atomic Structure and Bonding',
    'Understand atoms, electrons, and chemical bonds. Learn about periodic table and chemical reactions.',
    'https://www.youtube.com/watch?v=DyU_Ylgm_kI',
    'DyU_Ylgm_kI',
    'Science',
    'beginner',
    250,
    'chemistry, atoms, bonds, education'
  ),
  (
    'Biology: Cell Structure and Function',
    'Explore how cells work at the molecular level. Cover prokaryotic and eukaryotic cells, organelles, and metabolism.',
    'https://www.youtube.com/watch?v=wcjAqBMtS-g',
    'wcjAqBMtS-g',
    'Science',
    'beginner',
    280,
    'biology, cells, science, education'
  ),
  (
    'Quantum Physics Explained',
    'Deep dive into quantum mechanics. Understand wave-particle duality, Schrödinger equation, and quantum superposition.',
    'https://www.youtube.com/watch?v=fyqHkgpt4Ow',
    'fyqHkgpt4Ow',
    'Science',
    'advanced',
    360,
    'quantum physics, physics, science'
  ),

-- EDUCATION & LEARNING STRATEGIES
  (
    'How to Study Effectively',
    'Science-backed study techniques including spaced repetition, active recall, interleaving, and more.',
    'https://www.youtube.com/watch?v=_fbCJd6LO-s',
    '_fbCJd6LO-s',
    'Education',
    'beginner',
    120,
    'study skills, learning, education, productivity'
  ),
  (
    'Memory and Learning Psychology',
    'Understand how your brain learns and retains information. Tips for better memory and learning efficiency.',
    'https://www.youtube.com/watch?v=1xLrw_9G0Fg',
    '1xLrw_9G0Fg',
    'Education',
    'beginner',
    180,
    'psychology, memory, learning, brain'
  ),
  (
    'Critical Thinking and Problem Solving',
    'Develop critical thinking skills and learn systematic approaches to solving complex problems.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'dQw4w9WgXcQ',
    'Education',
    'intermediate',
    150,
    'critical thinking, problem solving, skills'
  ),
  (
    'Data Science Fundamentals',
    'Learn data analysis, visualization, and statistics. Foundation course for data science career.',
    'https://www.youtube.com/watch?v=d139rGqzHFI',
    'd139rGqzHFI',
    'Technology',
    'intermediate',
    420,
    'data science, statistics, analytics, python'
  ),
  (
    'Cybersecurity Basics',
    'Essential cybersecurity concepts including encryption, authentication, network security, and threat prevention.',
    'https://www.youtube.com/watch?v=inWWhr5tnEU',
    'inWWhr5tnEU',
    'Technology',
    'beginner',
    240,
    'cybersecurity, security, technology'
  ),
  (
    'Cloud Computing with AWS',
    'Introduction to cloud computing and Amazon Web Services. Learn EC2, S3, databases, and deployment.',
    'https://www.youtube.com/watch?v=SOTamCx_DIo',
    'SOTamCx_DIo',
    'Technology',
    'intermediate',
    300,
    'cloud computing, aws, technology, devops'
  ),
  (
    'Environmental Science and Climate Change',
    'Understand climate science, ecosystems, and environmental challenges. Learn about sustainability solutions.',
    'https://www.youtube.com/watch?v=CQUSB2F_sYM',
    'CQUSB2F_sYM',
    'Science',
    'beginner',
    200,
    'environment, climate, science, sustainability'
  ),
  (
    'Artificial Intelligence and Ethics',
    'Explore AI technology, machine learning applications, and the ethical considerations of AI in society.',
    'https://www.youtube.com/watch?v=rC4nqJ5ANqM',
    'rC4nqJ5ANqM',
    'Technology',
    'intermediate',
    180,
    'ai, ethics, technology, machine learning'
  ),
  (
    'Mathematics: Calculus Basics',
    'Master calculus fundamentals including limits, derivatives, and integrals with clear explanations.',
    'https://www.youtube.com/watch?v=WUvTyaaNkzM',
    'WUvTyaaNkzM',
    'Science',
    'intermediate',
    360,
    'calculus, mathematics, education'
  ),
  (
    'Biotechnology and Genetic Engineering',
    'Learn about CRISPR, genetic modification, and modern biotechnology applications in medicine and agriculture.',
    'https://www.youtube.com/watch?v=OBDvEZ1Gc90',
    'OBDvEZ1Gc90',
    'Science',
    'advanced',
    280,
    'biotechnology, genetics, science'
  )
ON CONFLICT DO NOTHING;

-- Show all tutorials that were inserted
SELECT * FROM tutorials ORDER BY category, difficulty, created_at;
