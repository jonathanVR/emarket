-- Run this in Supabase SQL Editor if the project already exists.
-- Stores the WhatsApp number so you can change it without Vercel redeploys.

create table if not exists public.store_settings (
  id integer primary key check (id = 1),
  whatsapp_number text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.store_settings (id, whatsapp_number)
values (1, '')
on conflict (id) do nothing;

alter table public.store_settings enable row level security;

drop policy if exists "Public can read store settings"
  on public.store_settings;
create policy "Public can read store settings"
  on public.store_settings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can update store settings"
  on public.store_settings;
create policy "Authenticated can update store settings"
  on public.store_settings
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can insert store settings"
  on public.store_settings;
create policy "Authenticated can insert store settings"
  on public.store_settings
  for insert
  to authenticated
  with check (true);
