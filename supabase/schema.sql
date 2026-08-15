-- ============================================================
-- VIC Housing — Supabase Schema
-- Run this in your Supabase SQL editor after creating a project
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  organization text not null default 'OTHER',
  is_un_staff boolean not null default false,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now()
);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, organization, is_un_staff, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'organization', 'OTHER'),
    coalesce((new.raw_user_meta_data->>'is_un_staff')::boolean, false),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- LISTINGS
-- ============================================================
create table if not exists public.listings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text default '',
  type text not null check (type in ('rent', 'sell')),
  status text not null default 'active' check (status in ('active', 'pending', 'closed')),
  price numeric not null,
  property_type text not null default 'apartment' check (property_type in ('apartment', 'house', 'studio', 'penthouse', 'townhouse')),
  bedrooms integer not null default 1,
  bathrooms integer not null default 1,
  area_sqm numeric not null,
  floor integer,
  total_floors integer,
  address text not null,
  district text not null,
  latitude numeric,
  longitude numeric,
  available_from date not null,
  furnished boolean not null default false,
  parking boolean not null default false,
  balcony boolean not null default false,
  elevator boolean not null default false,
  pets_allowed boolean not null default false,
  images text[] default '{}',
  amenities text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_type_idx on public.listings(type);
create index if not exists listings_status_idx on public.listings(status);
create index if not exists listings_district_idx on public.listings(district);
create index if not exists listings_user_id_idx on public.listings(user_id);
create index if not exists listings_price_idx on public.listings(price);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger listings_updated_at
  before update on public.listings
  for each row execute function update_updated_at();

-- ============================================================
-- VIEWINGS
-- ============================================================
create table if not exists public.viewings (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  requester_id uuid references public.profiles(id) on delete cascade not null,
  proposed_date date not null,
  proposed_time text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists viewings_listing_id_idx on public.viewings(listing_id);
create index if not exists viewings_requester_id_idx on public.viewings(requester_id);

-- ============================================================
-- CONVERSATIONS
-- ============================================================
create table if not exists public.conversations (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique (listing_id, buyer_id, seller_id)
);

create index if not exists conversations_buyer_id_idx on public.conversations(buyer_id);
create index if not exists conversations_seller_id_idx on public.conversations(seller_id);

-- ============================================================
-- MESSAGES
-- ============================================================
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  type text not null default 'chat' check (type in ('chat', 'email')),
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_id_idx on public.messages(conversation_id);
create index if not exists messages_sender_id_idx on public.messages(sender_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.viewings enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- PROFILES
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- LISTINGS: anyone can read, authenticated users can create, owners can update/delete
create policy "Listings viewable by everyone" on public.listings
  for select using (true);

create policy "Authenticated users can create listings" on public.listings
  for insert with check (auth.uid() = user_id);

create policy "Owners can update their listings" on public.listings
  for update using (auth.uid() = user_id);

create policy "Owners can delete their listings" on public.listings
  for delete using (auth.uid() = user_id);

-- VIEWINGS: UN staff can create, parties involved can read
create policy "Parties can view their viewings" on public.viewings
  for select using (
    auth.uid() = requester_id or
    exists (
      select 1 from public.listings
      where id = listing_id and user_id = auth.uid()
    )
  );

create policy "Authenticated users can request viewings" on public.viewings
  for insert with check (auth.uid() = requester_id);

create policy "Listing owners can update viewing status" on public.viewings
  for update using (
    exists (
      select 1 from public.listings
      where id = listing_id and user_id = auth.uid()
    )
  );

-- CONVERSATIONS: buyer and seller can read
create policy "Participants can view conversations" on public.conversations
  for select using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Authenticated users can create conversations" on public.conversations
  for insert with check (auth.uid() = buyer_id);

-- MESSAGES: participants can read and send
create policy "Participants can view messages" on public.messages
  for select using (
    exists (
      select 1 from public.conversations
      where id = conversation_id
      and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
  );

create policy "Participants can send messages" on public.messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.conversations
      where id = conversation_id
      and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
  );

-- ============================================================
-- REALTIME (enable for messages)
-- ============================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.viewings;

-- ============================================================
-- SAMPLE DATA (optional — comment out in production)
-- ============================================================
-- Insert a few sample listings for demo purposes
-- (Replace user_id with a real user ID from your auth.users table)

/*
insert into public.listings (user_id, title, description, type, price, property_type, bedrooms, bathrooms, area_sqm, floor, total_floors, address, district, available_from, furnished, parking, balcony, elevator, pets_allowed)
values
  ('YOUR-USER-ID', 'Elegant 3BR apartment near VIC', 'Stunning fully furnished apartment 5 minutes walk from the VIC campus. Bright south-facing living room, modern kitchen, two full bathrooms.', 'rent', 2200, 'apartment', 3, 2, 105, 4, 8, 'Wagramer Straße 25, 1220 Wien', '22nd — Donaustadt', '2026-09-01', true, true, true, true, false),
  ('YOUR-USER-ID', 'Penthouse with Danube views', 'Exceptional penthouse apartment with panoramic views over the Danube and VIC towers. 180m² across one floor, private terrace, concierge building.', 'sell', 1250000, 'penthouse', 4, 3, 180, 12, 12, 'Donizettiweg 6, 1220 Wien', '22nd — Donaustadt', '2026-10-01', true, true, true, true, true),
  ('YOUR-USER-ID', 'Modern studio in Alsergrund', 'Compact but beautifully designed studio apartment in the 9th district, ideal for single diplomats. Close to U4 and U6.', 'rent', 950, 'studio', 1, 1, 38, 2, 5, 'Alserbachstraße 12, 1090 Wien', '9th — Alsergrund', '2026-09-15', true, false, false, true, false);
*/
