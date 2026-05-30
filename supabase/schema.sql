-- =====================================================================
-- AI Academy — Supabase schema for cloud progress sync
-- ---------------------------------------------------------------------
-- One row per user holds their course progress. Row Level Security is ON
-- and the only policies allow a user to read/write THEIR OWN row
-- (auth.uid() = user_id). There is no public/anon read access, so progress
-- data is never exposed to other users.
--
-- How to apply:
--   Supabase Dashboard → SQL Editor → paste this file → Run.
--   (Idempotent: safe to run more than once.)
-- =====================================================================

-- 1. The progress table -------------------------------------------------
create table if not exists public.progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  onboarded  boolean      not null default false,
  completed  jsonb        not null default '{}'::jsonb,   -- { "<lessonId>": <stars 1..3> }
  streak     jsonb        not null default '{"current":0,"longest":0,"lastDay":null}'::jsonb,
  updated_at timestamptz  not null default now()
);

comment on table public.progress is
  'Per-user AI Academy course progress (completed lessons, stars, streak). RLS: owner-only.';

-- 2. Enable Row Level Security -----------------------------------------
alter table public.progress enable row level security;

-- 3. Owner-only policies ------------------------------------------------
-- Drop-then-create so the script is idempotent.
drop policy if exists "progress_select_own" on public.progress;
create policy "progress_select_own"
  on public.progress for select
  using (auth.uid() = user_id);

drop policy if exists "progress_insert_own" on public.progress;
create policy "progress_insert_own"
  on public.progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "progress_update_own" on public.progress;
create policy "progress_update_own"
  on public.progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- (No DELETE policy: clients never delete rows. The ON DELETE CASCADE above
--  removes a user's progress automatically if their auth account is deleted.)

-- 4. Keep updated_at fresh on every write ------------------------------
create or replace function public.touch_progress_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists progress_set_updated_at on public.progress;
create trigger progress_set_updated_at
  before update on public.progress
  for each row execute function public.touch_progress_updated_at();
