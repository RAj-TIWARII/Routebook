-- RouteBook — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push` with the CLI).
-- Enables Row Level Security everywhere: public read, authenticated write.

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Core tables
-- ---------------------------------------------------------------------------

create table if not exists countries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  code text not null unique -- ISO 3166-1 alpha-2
);

create table if not exists cities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  country_id uuid references countries(id) on delete cascade
);

create table if not exists journeys (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  location text not null,
  city text not null,
  country text not null,
  country_code text not null,
  date_start date not null,
  date_end date not null,
  cover_image text,
  hero_image text,
  category text not null default 'journey',
  story text default '',
  distance_km numeric default 0,
  places_visited text[] default '{}',
  lat double precision not null,
  lng double precision not null,
  route jsonb, -- array of [lng, lat] pairs
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists photos (
  id uuid primary key default uuid_generate_v4(),
  journey_id uuid references journeys(id) on delete cascade,
  url text not null,
  width int,
  height int,
  camera text,
  taken_on date,
  location text,
  alt text default '',
  created_at timestamptz default now()
);

create table if not exists videos (
  id uuid primary key default uuid_generate_v4(),
  journey_id uuid references journeys(id) on delete cascade,
  title text not null,
  url text not null,
  poster text,
  duration_seconds int,
  created_at timestamptz default now()
);

create table if not exists albums (
  id uuid primary key default uuid_generate_v4(),
  journey_id uuid references journeys(id) on delete cascade,
  name text not null
);

create table if not exists tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique
);

-- Convenience view the frontend queries for map markers
create or replace view locations as
  select
    id,
    location as name,
    city,
    country,
    country_code,
    lat,
    lng,
    date_start as visited_on,
    (select count(*) from photos p where p.journey_id = j.id) as photo_count,
    (select count(*) from videos v where v.journey_id = j.id) as video_count,
    cover_image
  from journeys j;

-- ---------------------------------------------------------------------------
-- Aggregate stats RPC used by the homepage Travel Statistics section
-- ---------------------------------------------------------------------------

create or replace function get_travel_stats()
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'countries_visited', (select count(distinct country) from journeys),
    'cities_visited', (select count(distinct city) from journeys),
    'total_journeys', (select count(*) from journeys),
    'total_distance_km', (select coalesce(sum(distance_km), 0) from journeys),
    'total_photos', (select count(*) from photos),
    'total_videos', (select count(*) from videos)
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security — public can read, only authenticated users can write.
-- This app has a single-owner admin panel, so "authenticated" is sufficient;
-- tighten to a specific user id with `auth.uid() = owner_id` if you add
-- multi-user support later.
-- ---------------------------------------------------------------------------

alter table journeys enable row level security;
alter table photos enable row level security;
alter table videos enable row level security;
alter table albums enable row level security;
alter table tags enable row level security;
alter table countries enable row level security;
alter table cities enable row level security;

create policy "Public read journeys" on journeys for select using (true);
create policy "Public read photos" on photos for select using (true);
create policy "Public read videos" on videos for select using (true);
create policy "Public read albums" on albums for select using (true);
create policy "Public read tags" on tags for select using (true);
create policy "Public read countries" on countries for select using (true);
create policy "Public read cities" on cities for select using (true);

create policy "Authenticated write journeys" on journeys
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated write photos" on photos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated write videos" on videos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated write albums" on albums
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated write tags" on tags
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Keep updated_at fresh
-- ---------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger journeys_set_updated_at
  before update on journeys
  for each row execute function set_updated_at();
