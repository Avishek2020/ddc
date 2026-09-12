-- ============================================================
--  DDC website — legal pages (Privacy Policy + Terms)
--  Run in Supabase SQL Editor AFTER schema.sql.
-- ============================================================

-- reuse or (re)create the shared updated_at trigger function
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create table if not exists public.legal_pages (
  slug       text primary key,          -- 'privacy' | 'terms'
  title      jsonb not null,            -- {"de":"...","en":"..."}
  body       jsonb not null,            -- {"de":"<markdown>","en":"<markdown>"}
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_legal_updated on public.legal_pages;
create trigger trg_legal_updated
  before update on public.legal_pages
  for each row execute function public.set_updated_at();

-- Locked down; the Node server (service key) bypasses RLS.
alter table public.legal_pages enable row level security;
