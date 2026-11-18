-- Brand Clothing schema for Supabase project rolzdqtwerwbyowyezri.
-- Safe to run more than once: it creates missing tables/columns and
-- (re)applies grants, RLS policies and realtime publication.

begin;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid()
);
alter table public.products add column if not exists name text not null default '';
alter table public.products add column if not exists price numeric not null default 0;
alter table public.products add column if not exists old_price numeric;
alter table public.products add column if not exists category text not null default 'clothes';
alter table public.products add column if not exists special boolean not null default false;
alter table public.products add column if not exists description text not null default '';
alter table public.products add column if not exists image text not null default '';
alter table public.products add column if not exists created_at timestamptz not null default now();

create table if not exists public.vip_codes (
  id uuid primary key default gen_random_uuid()
);
alter table public.vip_codes add column if not exists code text not null default '';
alter table public.vip_codes add column if not exists percent integer not null default 10;
alter table public.vip_codes add column if not exists active boolean not null default true;
alter table public.vip_codes add column if not exists created_at timestamptz not null default now();
create unique index if not exists vip_codes_code_key on public.vip_codes (upper(code));

create table if not exists public.store_settings (
  id integer primary key default 1
);
alter table public.store_settings add column if not exists data jsonb not null default '{}'::jsonb;
alter table public.store_settings add column if not exists updated_at timestamptz not null default now();

-- Visitors may only read. All writes go through the server (service role)
-- after the admin password is verified.
alter table public.products enable row level security;
alter table public.vip_codes enable row level security;
alter table public.store_settings enable row level security;

revoke insert, update, delete on public.products, public.vip_codes, public.store_settings from anon, authenticated;
grant select on public.products, public.vip_codes, public.store_settings to anon, authenticated;
grant all on public.products, public.vip_codes, public.store_settings to service_role;

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products for select to anon, authenticated using (true);

drop policy if exists "public read vip codes" on public.vip_codes;
create policy "public read vip codes" on public.vip_codes for select to anon, authenticated using (true);

drop policy if exists "public read settings" on public.store_settings;
create policy "public read settings" on public.store_settings for select to anon, authenticated using (true);

commit;

-- Realtime: push changes to every visitor instantly.
do $$
begin
  begin alter publication supabase_realtime add table public.products; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.vip_codes; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.store_settings; exception when duplicate_object then null; end;
end $$;
