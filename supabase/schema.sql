-- Run this once in Supabase → SQL Editor → New query → Run

create table if not exists public.properties (
  id text primary key,
  slug text not null unique,
  title text not null,
  description text not null default '',
  sale_rent text not null default 'For Sale',
  build_status text not null default 'Completed',
  is_draft boolean not null default false,
  property_type text not null default 'House',
  price text not null default '',
  price_number text not null default '0',
  size text not null default '',
  bedrooms text not null default '0',
  bathrooms text not null default '0',
  kitchens text not null default '0',
  tv_lounge text not null default '0',
  car_parking text not null default '0',
  facing text not null default '',
  total_floors text not null default '',
  condition text not null default '',
  society text not null default '',
  address text not null default '',
  location text not null default '',
  maps_link text not null default '',
  lat double precision,
  lng double precision,
  images jsonb not null default '[]'::jsonb,
  videos jsonb not null default '[]'::jsonb,
  additional_info text not null default '',
  beds integer not null default 0,
  baths integer not null default 0,
  area text not null default '',
  price_display text not null default '',
  image text not null default '/images/listing-house-dusk.jpg',
  status text not null default 'For Sale',
  public_slug text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_slug_idx on public.properties (slug);
create index if not exists properties_is_draft_idx on public.properties (is_draft);

-- Admin server uses service_role key (bypasses RLS). Still enable RLS for safety.
alter table public.properties enable row level security;

-- Public site can READ published (non-draft) properties
create policy "Public read published properties"
  on public.properties
  for select
  to anon, authenticated
  using (is_draft = false);

-- No anon insert/update/delete — only service_role (admin API) writes

-- If table already existed without videos column, run:
-- alter table public.properties add column if not exists videos jsonb not null default '[]'::jsonb;
-- Then also run supabase/storage.sql for image + video baskets.
-- And supabase/listings.sql for house_maps + interior_designs tables.
-- And supabase/feedbacks.sql for buyer reviews / testimonials.
-- And supabase/featured.sql for is_featured (homepage, max 20).

-- And supabase/banners.sql for admin-managed site banners.
