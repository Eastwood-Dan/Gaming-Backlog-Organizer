-- Gaming Organizer: database schema for Supabase (see docs/adr/0002).
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Every row belongs to one logged-in user; row level security makes sure
-- nobody can read or change another user's rows.

create table public.games (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  status text not null check (status in ('Unplayed', 'Paused', 'Playing', 'Finished', 'Dropped')),
  started_at timestamptz,
  ended_at timestamptz,
  -- Manual order: the position of the Game in the Library, lowest first.
  -- For Games in the Backlog this is the Backlog order (top is next).
  position integer not null,
  created_at timestamptz not null default now()
);

create index games_user_id_idx on public.games (user_id);

create table public.settings (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  current_limit integer not null default 3 check (current_limit >= 1)
);

alter table public.games enable row level security;
alter table public.settings enable row level security;

create policy "own games" on public.games
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "own settings" on public.settings
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
