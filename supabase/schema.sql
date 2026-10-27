-- CoffeeBot Grounds Up · shared state + simulated machine ingest
-- Safe to run more than once. Paste the whole file into the Supabase SQL editor
-- (Dashboard → SQL Editor → New query → Run).

-- 1. One row per shared slice -------------------------------------------------
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

-- Realtime: let browsers subscribe to row changes (skip if already added).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'shared_state'
  ) then
    alter publication supabase_realtime add table public.shared_state;
  end if;
end $$;

-- 2. Machine ingest: brew(machine) ------------------------------------------------
-- A machine (or anything playing one) reports a single brewed cup. The row for that
-- machine is locked, incremented and written in one transaction, so two reports that
-- arrive at the same instant both count. Returns the new value for the row.
-- Callers (the app, scripts/emit-brews.mjs, a real gateway) need only execute rights.
create or replace function public.brew(machine text)
returns jsonb
language plpgsql
security definer          -- runs with the owner's rights: callers only need execute
set search_path = public  -- standard hardening for security definer functions
as $$
declare
  k   text := 'live_' || machine;
  cur jsonb;
  nxt jsonb;
begin
  if machine !~ '^[a-z0-9_-]{1,32}$' then
    raise exception 'unknown machine id: %', machine;
  end if;

  insert into public.shared_state (key, value)
  values (k, '{"cups": 0, "recent": []}'::jsonb)
  on conflict (key) do nothing;

  select value into cur from public.shared_state where key = k for update;

  nxt := jsonb_build_object(
    'cups', coalesce((cur ->> 'cups')::int, 0) + 1,
    'recent', (
      -- newest first, keep the last five
      select coalesce(jsonb_agg(v order by i), '[]'::jsonb)
      from (
        select v, i
        from jsonb_array_elements(
          jsonb_build_array((extract(epoch from clock_timestamp()) * 1000)::bigint)
          || coalesce(cur -> 'recent', '[]'::jsonb)
        ) with ordinality as t(v, i)
        order by i
        limit 5
      ) s
    )
  );

  update public.shared_state set value = nxt, updated_at = now() where key = k;
  return nxt;
end $$;

grant execute on function public.brew(text) to anon, authenticated;
