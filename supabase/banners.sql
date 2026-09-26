-- Site banners (admin-managed heroes / promo strips)
-- Run in Supabase → SQL Editor after schema.sql

create table if not exists public.site_banners (
  id text primary key,
  page_key text not null unique,
  title text not null default '',
  subtitle text not null default '',
  eyebrow text not null default '',
  script_text text not null default '',
  image_url text not null default '',
  mobile_image_url text not null default '',
  buttons jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_banners_page_key_idx on public.site_banners (page_key);
create index if not exists site_banners_is_active_idx on public.site_banners (is_active);

alter table public.site_banners enable row level security;

drop policy if exists "Public read active banners" on public.site_banners;
create policy "Public read active banners"
  on public.site_banners for select
  to anon, authenticated
  using (is_active = true);

-- Writes via service_role (admin API) only
