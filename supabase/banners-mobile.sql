-- Add mobile banner image column (run after banners.sql)
-- Supabase → SQL Editor

alter table public.site_banners
  add column if not exists mobile_image_url text not null default '';
