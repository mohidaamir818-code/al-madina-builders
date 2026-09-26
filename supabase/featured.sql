-- Featured flags (max 20 featured listings enforced in app)
-- Run in Supabase → SQL Editor
--
-- IMPORTANT: pehle `listings.sql` chalao (wo `house_maps` table banata hai).
-- Phir ye file chalao. Agar listings.sql pehle chal chuka ho to ye safe hai.

alter table public.properties
  add column if not exists is_featured boolean not null default false;

create index if not exists properties_is_featured_idx on public.properties (is_featured);

-- house_maps tab hi update jab table exist karti ho
do $$
begin
  if to_regclass('public.house_maps') is not null then
    alter table public.house_maps
      add column if not exists is_featured boolean not null default false;
    create index if not exists house_maps_is_featured_idx on public.house_maps (is_featured);
  end if;
end $$;
