-- ============================================================
--  DDC website — Supabase schema
--  Run this in:  Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- needed for gen_random_uuid()
create extension if not exists pgcrypto;

-- ---- Editable website content -------------------------------------------
-- One row per content key. "value" is JSON and can hold any of:
--   a plain string            e.g.  "FJ Donner"
--   a bilingual object        e.g.  {"de":"...", "en":"..."}
--   a list (e.g. phases)      e.g.  [{"image":"","title":{...},"desc":{...}}, ...]
create table if not exists public.site_content (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---- Contact-form submissions -------------------------------------------
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  company    text,
  message    text not null,
  read       boolean not null default false,
  replied    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_at_idx
  on public.messages (created_at desc);

-- ---- keep updated_at fresh on content edits -----------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_site_content_updated on public.site_content;
create trigger trg_site_content_updated
  before update on public.site_content
  for each row execute function public.set_updated_at();

-- ---- Security -----------------------------------------------------------
-- Enable Row Level Security and add NO public policies.
-- The Node server talks to Supabase with the SERVICE ROLE (secret) key,
-- which bypasses RLS. The public/anon (publishable) key therefore cannot
-- read or write these tables directly — all access goes through your server.
alter table public.site_content enable row level security;
alter table public.messages     enable row level security;
