-- Supabase Dummy Data for AI Mentor
-- Insert realistic test data for users and messages tables

-- ============================================
-- USERS TABLE
-- ============================================

INSERT INTO users (id, name, email, avatar_url, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'John Smith', 'john.smith@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', NOW() - INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', 'sarah.johnson@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', NOW() - INTERVAL '28 days'),
('550e8400-e29b-41d4-a716-446655440003', 'Michael Brown', 'michael.brown@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', NOW() - INTERVAL '25 days'),
('550e8400-e29b-41d4-a716-446655440004', 'Emily Davis', 'emily.davis@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', NOW() - INTERVAL '22 days'),
('550e8400-e29b-41d4-a716-446655440005', 'Robert Wilson', 'robert.wilson@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert', NOW() - INTERVAL '20 days'),
('550e8400-e29b-41d4-a716-446655440006', 'Jessica Garcia', 'jessica.garcia@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica', NOW() - INTERVAL '18 days'),
('550e8400-e29b-41d4-a716-446655440007', 'Daniel Martinez', 'daniel.martinez@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel', NOW() - INTERVAL '15 days'),
('550e8400-e29b-41d4-a716-446655440008', 'Amanda Lee', 'amanda.lee@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda', NOW() - INTERVAL '12 days'),
('550e8400-e29b-41d4-a716-446655440009', 'Christopher Anderson', 'christopher.anderson@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher', NOW() - INTERVAL '10 days'),
('550e8400-e29b-41d4-a716-446655440010', 'Olivia Taylor', 'olivia.taylor@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia', NOW() - INTERVAL '8 days'),
('550e8400-e29b-41d4-a716-446655440011', 'James Thomas', 'james.thomas@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440012', 'Sophia Jackson', 'sophia.jackson@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia', NOW() - INTERVAL '3 days');

-- ============================================
-- MESSAGES TABLE
-- ============================================

INSERT INTO messages (id, user_id, content, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Can someone help me understand machine learning concepts?', NOW() - INTERVAL '25 days'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'I just completed my first Python project! Check it out on GitHub.', NOW() - INTERVAL '24 days'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'What are the best practices for code documentation?', NOW() - INTERVAL '23 days'),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'I recommend checking out the official documentation and Stack Overflow.', NOW() - INTERVAL '23 days'),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 'How do I debug this React component issue?', NOW() - INTERVAL '22 days'),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', 'Try using React DevTools browser extension. It saved my life!', NOW() - INTERVAL '22 days'),
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440006', 'Learning web development has been challenging but rewarding.', NOW() - INTERVAL '21 days'),
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'I found a great tutorial on TypeScript for beginners.', NOW() - INTERVAL '20 days'),
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440007', 'Does anyone have experience with database optimization?', NOW() - INTERVAL '19 days'),
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Database indexing is crucial for performance. Start there!', NOW() - INTERVAL '19 days'),
('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440008', 'Just deployed my first production app. Feeling nervous!', NOW() - INTERVAL '18 days'),
('650e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', 'Congratulations! Production deployments get easier over time.', NOW() - INTERVAL '18 days'),
('650e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440009', 'Anyone interested in collaborating on an open-source project?', NOW() - INTERVAL '17 days'),
('650e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440010', 'I am! What are you working on?', NOW() - INTERVAL '17 days'),
('650e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440004', 'Struggling with REST API design. Best practices?', NOW() - INTERVAL '16 days'),
('650e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440006', 'Follow RESTful conventions: use proper HTTP methods, status codes, and resource naming.', NOW() - INTERVAL '16 days'),
('650e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440011', 'What is the best framework for building mobile apps?', NOW() - INTERVAL '15 days'),
('650e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440005', 'React Native and Flutter are both excellent choices.', NOW() - INTERVAL '15 days'),
('650e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440003', 'Tips for writing clean and maintainable code?', NOW() - INTERVAL '14 days'),
('650e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440007', 'Use meaningful variable names, keep functions small, write tests, and refactor regularly.', NOW() - INTERVAL '14 days'),
('650e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440012', 'Just learned about design patterns. Mind-blowing!', NOW() - INTERVAL '13 days'),
('650e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440002', 'Design patterns are essential for scalable architecture.', NOW() - INTERVAL '13 days'),
('650e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440008', 'How do I improve my problem-solving skills?', NOW() - INTERVAL '12 days'),
('650e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440001', 'Practice coding challenges on LeetCode and HackerRank daily.', NOW() - INTERVAL '12 days'),
('650e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440009', 'My code got reviewed and I received some valuable feedback!', NOW() - INTERVAL '11 days'),
('650e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440004', 'Code reviews are invaluable for growth as a developer.', NOW() - INTERVAL '11 days'),
('650e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440006', 'What are the differences between SQL and NoSQL databases?', NOW() - INTERVAL '10 days'),
('650e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440010', 'SQL is relational and structured, NoSQL is flexible and scalable. Choice depends on use case.', NOW() - INTERVAL '10 days'),
('650e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440005', 'Starting to learn cloud computing with AWS. Recommendations?', NOW() - INTERVAL '9 days'),
('650e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440003', 'Start with EC2, S3, and RDS. Great foundation for AWS knowledge.', NOW() - INTERVAL '9 days'),
('650e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440007', 'Debugging is more like detective work than coding!', NOW() - INTERVAL '8 days'),
('650e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440011', 'Absolutely! Good debugging skills are a superpower.', NOW() - INTERVAL '8 days'),
('650e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440002', 'How important is version control in team projects?', NOW() - INTERVAL '7 days'),
('650e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440001', 'Version control with Git is absolutely essential for collaboration.', NOW() - INTERVAL '7 days'),
('650e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440012', 'Just refactored a massive codebase. Feels so much cleaner!', NOW() - INTERVAL '6 days'),
('650e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440008', 'Refactoring is an art form. Great work!', NOW() - INTERVAL '6 days'),
('650e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440004', 'Security best practices for web applications?', NOW() - INTERVAL '5 days'),
('650e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440009', 'Always validate input, use HTTPS, implement rate limiting, and keep dependencies updated.', NOW() - INTERVAL '5 days'),
('650e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440006', 'Performance optimization tips for large-scale applications?', NOW() - INTERVAL '4 days'),
('650e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440010', 'Caching, database indexing, and lazy loading are game-changers.', NOW() - INTERVAL '4 days'),
('650e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440003', 'Successfully migrated from monolithic to microservices architecture!', NOW() - INTERVAL '3 days'),
('650e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440005', 'That is a significant achievement! Congratulations!', NOW() - INTERVAL '3 days'),
('650e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440007', 'Learning GraphQL has opened new possibilities for API design.', NOW() - INTERVAL '2 days'),
('650e8400-e29b-41d4-a716-446655440044', '550e8400-e29b-41d4-a716-446655440001', 'GraphQL is powerful but requires careful implementation and optimization.', NOW() - INTERVAL '2 days'),
('650e8400-e29b-41d4-a716-446655440045', '550e8400-e29b-41d4-a716-446655440011', 'Any recommendations for CI/CD pipeline tools?', NOW() - INTERVAL '1 day'),
('650e8400-e29b-41d4-a716-446655440046', '550e8400-e29b-41d4-a716-446655440002', 'GitHub Actions, GitLab CI, and Jenkins are excellent options.', NOW() - INTERVAL '1 day'),
('650e8400-e29b-41d4-a716-446655440047', '550e8400-e29b-41d4-a716-446655440012', 'Containerization with Docker has simplified our deployment process tremendously!', NOW()),
('650e8400-e29b-41d4-a716-446655440048', '550e8400-e29b-41d4-a716-446655440004', 'Docker and Kubernetes are industry standards for orchestration.', NOW());

-- ============================================
-- VERIFICATION QUERIES (Run these to verify data)
-- ============================================

-- Check total users
-- SELECT COUNT(*) as total_users FROM users;

-- Check total messages
-- SELECT COUNT(*) as total_messages FROM messages;

-- Check messages per user
-- SELECT u.name, COUNT(m.id) as message_count 
-- FROM users u 
-- LEFT JOIN messages m ON u.id = m.user_id 
-- GROUP BY u.id, u.name 
-- ORDER BY message_count DESC;

-- View recent messages with user info
-- SELECT u.name, m.content, m.created_at 
-- FROM messages m 
-- JOIN users u ON m.user_id = u.id 
-- ORDER BY m.created_at DESC 
-- LIMIT 10;
