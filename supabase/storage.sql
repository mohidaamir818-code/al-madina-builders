-- Run once in Supabase → SQL Editor
-- Creates separate Storage baskets: pictures + videos

-- 1) Image basket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  10485760, -- 10 MB
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2) Video basket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-videos',
  'property-videos',
  true,
  52428800, -- 50 MB (Free-plan friendly; raise later if needed)
  array['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public can view files (buyer site)
drop policy if exists "Public read property images" on storage.objects;
create policy "Public read property images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'property-images');

drop policy if exists "Public read property videos" on storage.objects;
create policy "Public read property videos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'property-videos');

-- Writes go through Next.js admin API with service_role (bypasses RLS).
-- Optional: allow authenticated uploads if you later use anon client.
drop policy if exists "Service uploads property images" on storage.objects;
create policy "Service uploads property images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images');

drop policy if exists "Service uploads property videos" on storage.objects;
create policy "Service uploads property videos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-videos');

-- Videos column on properties (safe if table already exists)
alter table public.properties
  add column if not exists videos jsonb not null default '[]'::jsonb;
