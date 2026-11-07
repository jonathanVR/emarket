-- Run once in Supabase SQL Editor on an existing project.
-- Adds up to 5 images per product and migrates the old single image_url.

alter table public.products
  add column if not exists image_urls text[] not null default '{}';

update public.products
set image_urls = array[image_url]
where image_url is not null
  and image_url <> ''
  and (
    image_urls is null
    or cardinality(image_urls) = 0
  );

alter table public.products
  drop constraint if exists products_image_urls_max_5;

alter table public.products
  add constraint products_image_urls_max_5
  check (cardinality(image_urls) <= 5);
