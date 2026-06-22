-- Schéma Supabase pour la synchronisation de la progression Hafiz.
-- À exécuter dans l'éditeur SQL de ton projet Supabase.

create table if not exists public.user_progress (
  user_id uuid references auth.users(id) on delete cascade primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

create policy "Users manage own progress" on public.user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
