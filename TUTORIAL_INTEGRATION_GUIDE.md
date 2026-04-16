# 📚 Tutorial Video Integration Guide

## Overview

Your AI Mentor application now has a complete tutorial video system integrated! When users ask about specific topics (Python, React, physics, etc.), the system will automatically recommend relevant YouTube tutorial videos.

## ✅ What's Been Completed

### 1. **Backend Services Created**

#### Tutorials Service (`apps/api/src/services/tutorials.service.js`)
- `searchTutorials(query)` - Search tutorials by keyword
- `getTutorialsByCategory(category)` - Get tutorials by category
- `getTutorialCategories()` - Get all available categories
- `formatTutorialMessage(tutorials)` - Format tutorials for display

#### Enhanced AI Service (`apps/api/src/services/ai.service.js`)
- Extended demo responses covering:
  - **Programming**: Python, JavaScript, React, SQL
  - **Science**: Physics, Chemistry, Biology, Quantum Physics
  - **Technology**: Data Science, Cybersecurity, AWS, ML
  - **Education**: Study techniques, Memory, Critical thinking
- Intelligent topic detection and keyword matching
- Automatic tutorial recommendations when relevant
- Fallback chain: Valid API key → OpenRouter → Demo responses

#### API Routes (`apps/api/src/routes/tutorials.routes.js`)
- `GET /tutorials/search?q=<query>` - Search tutorials
- `GET /tutorials/category/<category>` - Get tutorials by category
- `GET /tutorials/categories` - Get all categories

### 2. **Database Schema**

Created TUTORIALS table with:
- `id` (UUID Primary Key)
- `title` - Tutorial name
- `description` - Tutorial details
- `youtube_url` - Full YouTube link
- `youtube_video_id` - Just the ID (for embedding)
- `category` - Programming, Science, Technology, Education
- `difficulty` - beginner, intermediate, advanced
- `duration_minutes` - Video length
- `tags` - Search keywords

## 📋 Next Steps - Insert Tutorial Data

### Option 1: Using Supabase SQL Editor (Recommended - Easiest)

1. **Go to your Supabase Dashboard**
   - URL: https://app.supabase.com
   - Select project: `ncsejvzgencnobkkwaph`

2. **Open SQL Editor**
   - Click "SQL Editor" on the left sidebar
   - Click "New Query"

3. **Copy SQL from** `supabase/INSERT_TUTORIALS.sql`
   - Open this file: `/home/naveen/projects/AI-MENTOR/supabase/INSERT_TUTORIALS.sql`
   - Copy ALL the content

4. **Paste into SQL Editor**
   - Paste the SQL into the Supabase query editor
   - Click "Run"

5. **Verify Success**
   - You should see "15 rows inserted"
   - In the Table Editor, click "tutorials" to see all 15 videos

### Option 2: Using Node Script

Requirements:
- Update `.env` file with real `SUPABASE_SERVICE_ROLE_KEY`

Steps:
```bash
# 1. Get your real service role key from Supabase
#    Settings → API → service_role (secret)

# 2. Update apps/api/.env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...your-actual-key...

# 3. Run the population script
cd /home/naveen/projects/AI-MENTOR
node populate-tutorials.js
```

## 🎬 How It Works - User Experience

### Scenario 1: User Asks About Python
```
User: "How do I learn Python?"

AI Response:
"Python is a versatile, high-level programming language known for its simplicity and readability. [...]

📚 Related Video Tutorials:

1. Python for Beginners - Full Course
📌 Programming | beginner
⏱️ 468 min | 🔗 Watch on YouTube

2. Machine Learning with Python
📌 Technology | intermediate
⏱️ 300 min | 🔗 Watch on YouTube
"
```

### Scenario 2: User Asks About Physics
```
User: "Can you explain quantum physics?"

AI Response:
"Quantum mechanics describes the behavior of matter and energy at atomic scales: [...]

📚 Related Video Tutorials:

1. Physics Fundamentals - Motion and Forces
2. Quantum Physics Explained
3. Environmental Science and Sustainability
```

## 📊 Coverage

### 15 Total Videos

**Programming (5)**
- Python for Beginners
- JavaScript ES6 Tutorial
- React Web Development  
- SQL Database Tutorial
- Machine Learning with Python

**Science (5)**
- Physics Fundamentals
- Chemistry 101
- Biology: Cell Structure
- Quantum Physics
- Environmental Science

**Education & Learning (5)**
- Effective Study Techniques
- Memory Techniques
- Critical Thinking Skills
- Data Science Fundamentals
- Cybersecurity Fundamentals

### Keywords Detected
- Programming: python, javascript, react, sql, typescript, learn, database
- Science: physics, chemistry, biology, quantum, mechanics, relativity
- Education: study, memory, memorization, critical thinking, learning
- Technology: data, machine learning, ai, cybersecurity, aws, cloud

## 🚀 Testing the System

### After inserting tutorials, test with these prompts:

1. **"How do I learn Python?"** → Shows Python tutorials
2. **"Teach me about quantum physics"** → Shows quantum physics tutorial
3. **"Show me study techniques"** → Shows study method tutorials
4. **"I want to learn React"** → Shows React tutorial
5. **"How do I improve my memory?"** → Shows memory technique tutorials

## 🔗 API Endpoints

Once tutorials are in the database, use these endpoints:

```bash
# Search by keyword
curl http://localhost:5001/tutorials/search?q=python

# Get by category
curl http://localhost:5001/tutorials/category/Science

# Get all categories
curl http://localhost:5001/tutorials/categories
```

## 📝 Database Status Checklist

- [ ] Logged into Supabase dashboard
- [ ] Opened SQL Editor
- [ ] Copied SQL from `INSERT_TUTORIALS.sql`
- [ ] Pasted and ran the query
- [ ] Verified 15 rows were inserted
- [ ] Checked tutorials table in Table Editor
- [ ] Restarted API server
- [ ] Tested chat with tutorial-related question
- [ ] Saw YouTube video recommendations in reply

## 💡 Architecture Summary

```
User Message: "How do I learn Python?"
        ↓
AI Service (generateChatCompletion)
        ↓
1. Check if tutorial needed → Yes (keyword "learn" + "python")
2. Generate text response → Python description
3. Search tutorials → Find Python tutorials
4. Format with videos → Add YouTube links
        ↓
Display: Text + Related Videos
```

## 🎯 What Happens Next

When everything is integrated:

1. **Smart Detection**: System detects tutorial requests automatically
2. **Relevant Results**: Shows 3 most relevant videos
3. **Rich Formats**: Includes title, category, difficulty, duration
4. **Direct Links**: YouTube links for easy access
5. **Seamless UX**: Videos displayed inline in chat

## ⚠️ Troubleshooting

### No tutorials appearing?
- Verify SQL was executed successfully in Supabase
- Check tutorials table has 15 rows
- Restart API server: `npm run dev` in apps/api

### Search not working?
- Make sure `apps/api/src/services/tutorials.service.js` is imported in ai.service.js
- Verify server restarted with new code
- Check browser console for errors

### YouTube links not showing?
- Verify `youtube_video_id` is populated in database
- Check `youtube_url` format: must start with `https://www.youtube.com/`

## 📚 Files Modified/Created

- ✅ `apps/api/src/services/tutorials.service.js` - NEW
- ✅ `apps/api/src/routes/tutorials.routes.js` - NEW
- ✅ `apps/api/src/services/ai.service.js` - ENHANCED
- ✅ `apps/api/src/server.js` - UPDATED (added routes)
- ✅ `supabase/setup.sql` - ENHANCED (tutorials table added)
- ✅ `supabase/INSERT_TUTORIALS.sql` - NEW
- ✅ `populate-tutorials.js` - NEW

## 🎓 Next Phase (Optional Enhancements)

- [ ] Frontend component to display YouTube embed inline
- [ ] Tutorial filtering by difficulty level
- [ ] User tutorial favorites/bookmarks
- [ ] Progress tracking for watched videos
- [ ] Admin panel to add/edit tutorials
- [ ] Tutorial rating/recommendation system

---

**Status**: Backend + Database Schema ✅ Complete
**Next**: Insert tutorial data into Supabase (Choose Option 1 or 2 above)
**Estimated Time**: 5 minutes
