-- Supabase initialization SQL for StudentHub

-- profiles table (include password_hash for server-side auth)
create table if not exists public.profiles (
  id text primary key,
  email text not null unique,
  username text,
  profile_image text,
  password_hash text,
  created_at timestamptz default now()
);

-- user_history table
create table if not exists public.user_history (
  id text primary key,
  user_id text references public.profiles(id) on delete cascade,
  tool_id text,
  action text,
  payload jsonb,
  used_at timestamptz default now()
);

create index if not exists idx_user_history_user_id on public.user_history (user_id);

-- Optional RLS policies (enable if you plan to allow client-side anon writes)
-- alter table public.profiles enable row level security;
-- create policy "profiles_self" on public.profiles
--   for select using (auth.uid() = id);

-- alter table public.user_history enable row level security;
-- create policy "history_user_read" on public.user_history
--   for select using (auth.uid() = user_id);
