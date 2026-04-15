# Student-mentor
# AI Workspace (AI-MENTOR)

## Features

- Login + signup (localStorage)
- Workspace (ChatGPT-like)
- Create project (title + information)
- Search project by title
- Search history for project titles
- Upload file/image/document in chat input
- Camera access + capture in chat input
- AI chat via OpenRouter API (backend)
- Tutorial lookup via YouTube search
- Profile page (name, email, project count)

## Storage

Frontend authentication/theme data is stored in browser `localStorage`:

- `ai_workspace_user_profile`
- `ai_workspace_logged_in`
- `theme`

Project data and search history are stored in Supabase (via backend):

- `projects`
- `search_history`

## Environment

Create `apps/api/.env` based on `apps/api/.env.example`:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL` (optional - defaults to meta-llama/llama-2-7b-chat)
- `PORT` (optional, default `5001`)

## Supabase setup

Run the SQL in [apps/api/supabase/setup.sql](apps/api/supabase/setup.sql) in the Supabase SQL editor.

## Run

```bash
npm install
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:5001
