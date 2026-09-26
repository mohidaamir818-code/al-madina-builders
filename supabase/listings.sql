-- Extra listing tables for admin Map + Interior listings
-- Run in Supabase → SQL Editor after properties schema

create table if not exists public.house_maps (
  id text primary key,
  slug text not null unique,
  title text not null,
  badge text not null default '',
  description text not null default '',
  beds integer not null default 0,
  baths integer not null default 0,
  sqft integer not null default 0,
  floors integer not null default 1,
  price text not null default '',
  price_number text not null default '0',
  images jsonb not null default '[]'::jsonb,
  image text not null default '/images/floorplan-5marla.jpg',
  features jsonb not null default '[]'::jsonb,
  is_draft boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists house_maps_slug_idx on public.house_maps (slug);
create index if not exists house_maps_is_draft_idx on public.house_maps (is_draft);

alter table public.house_maps enable row level security;

drop policy if exists "Public read published house maps" on public.house_maps;
create policy "Public read published house maps"
  on public.house_maps for select
  to anon, authenticated
  using (is_draft = false);

create table if not exists public.interior_designs (
  id text primary key,
  slug text not null unique,
  title text not null,
  category text not null default 'Living Room',
  location text not null default '',
  description text not null default '',
  price text not null default '',
  price_number text not null default '0',
  rating numeric not null default 4.8,
  reviews integer not null default 0,
  images jsonb not null default '[]'::jsonb,
  image text not null default '/images/interior-living.jpg',
  features jsonb not null default '[]'::jsonb,
  is_draft boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists interior_designs_slug_idx on public.interior_designs (slug);
create index if not exists interior_designs_is_draft_idx on public.interior_designs (is_draft);

alter table public.interior_designs enable row level security;

drop policy if exists "Public read published interiors" on public.interior_designs;
create policy "Public read published interiors"
  on public.interior_designs for select
  to anon, authenticated
  using (is_draft = false);
