-- Deal / house alert subscribers (email + WhatsApp)
-- Run in Supabase → SQL Editor

create table if not exists public.deal_subscribers (
  id text primary key,
  email text not null,
  whatsapp text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists deal_subscribers_email_idx
  on public.deal_subscribers (lower(email));

create index if not exists deal_subscribers_created_idx
  on public.deal_subscribers (created_at desc);

alter table public.deal_subscribers enable row level security;

-- No public SELECT. Inserts/reads go through Next.js API with service_role.
