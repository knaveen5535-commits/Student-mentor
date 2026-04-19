-- Tables for AI-MENTOR

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  email varchar(255) unique not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  title text not null,
  information text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists projects_user_email_idx on public.projects (user_email);
create index if not exists projects_title_idx on public.projects (title);

create table if not exists public.search_history (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  query text not null,
  created_at timestamptz not null default now()
);

create index if not exists search_history_user_email_idx on public.search_history (user_email);
create index if not exists search_history_query_idx on public.search_history (query);

create table if not exists public.chat_threads (
  id text primary key,
  user_id uuid references public.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chat_threads_user_id_idx on public.chat_threads (user_id);

create table if not exists public.chat_messages (
  id text primary key,
  thread_id text references public.chat_threads(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_thread_id_idx on public.chat_messages (thread_id);

create table if not exists public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  message text not null,
  response text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_history_user_id_idx on public.chat_history (user_id);

-- Force PostgREST schema cache to reload so the API instantly recognizes the new tables.
NOTIFY pgrst, 'reload schema';
