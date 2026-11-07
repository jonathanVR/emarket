-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

create extension if not exists "pgcrypto";

create type public.product_status as enum ('available', 'sold');

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  compare_at_price numeric(12, 2) check (
    compare_at_price is null or compare_at_price >= 0
  ),
  size text not null default '',
  measurements text not null default '',
  category text not null default 'General',
  status public.product_status not null default 'available',
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists products_status_idx
  on public.products (status);

create index if not exists products_category_idx
  on public.products (category);

create index if not exists products_created_at_idx
  on public.products (created_at desc);

alter table public.products enable row level security;

create policy "Public can read products"
  on public.products
  for select
  to anon, authenticated
  using (true);

create policy "Authenticated can insert products"
  on public.products
  for insert
  to authenticated
  with check (true);

create policy "Authenticated can update products"
  on public.products
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete products"
  on public.products
  for delete
  to authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "Authenticated can upload product images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Authenticated can update product images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

create policy "Authenticated can delete product images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'product-images');

create table if not exists public.store_settings (
  id integer primary key check (id = 1),
  whatsapp_number text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.store_settings (id, whatsapp_number)
values (1, '')
on conflict (id) do nothing;

alter table public.store_settings enable row level security;

create policy "Public can read store settings"
  on public.store_settings
  for select
  to anon, authenticated
  using (true);

create policy "Authenticated can update store settings"
  on public.store_settings
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can insert store settings"
  on public.store_settings
  for insert
  to authenticated
  with check (true);
