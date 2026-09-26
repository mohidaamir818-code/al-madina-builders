-- Buyer feedback / testimonials (public submit)
-- Run in Supabase → SQL Editor

create table if not exists public.feedbacks (
  id text primary key,
  name text not null,
  text text not null,
  rating integer not null default 5,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists feedbacks_published_idx on public.feedbacks (is_published);
create index if not exists feedbacks_created_idx on public.feedbacks (created_at desc);

alter table public.feedbacks enable row level security;

drop policy if exists "Public read published feedbacks" on public.feedbacks;
create policy "Public read published feedbacks"
  on public.feedbacks for select
  to anon, authenticated
  using (is_published = true);

-- Inserts go through Next.js API with service_role (bypasses RLS).
