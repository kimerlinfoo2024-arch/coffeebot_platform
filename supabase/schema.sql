-- CoffeeBot Grounds Up · shared state
-- Run once in the Supabase SQL editor (Dashboard → SQL → New query).

create table if not exists public.shared_state (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- Prototype policy: the anon key may read and write every slice.
-- Replace with per-role policies before anything real goes live.
alter table public.shared_state enable row level security;

drop policy if exists "prototype read"   on public.shared_state;
drop policy if exists "prototype insert" on public.shared_state;
drop policy if exists "prototype update" on public.shared_state;
create policy "prototype read"   on public.shared_state for select using (true);
create policy "prototype insert" on public.shared_state for insert with check (true);
create policy "prototype update" on public.shared_state for update using (true) with check (true);

-- Realtime: let browsers subscribe to row changes.
alter publication supabase_realtime add table public.shared_state;
