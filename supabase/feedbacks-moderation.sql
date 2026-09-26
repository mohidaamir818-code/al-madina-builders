-- New reviews wait for admin approval before homepage
-- Safe to run even if feedbacks table already exists

alter table public.feedbacks
  alter column is_published set default false;
