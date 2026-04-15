-- Tables for AI-MENTOR

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
