-- ─── Reconnect DB Schema ─────────────────────────────────────────────────────

-- Enable UUID
create extension if not exists "pgcrypto";

-- ─── Profiles ────────────────────────────────────────────────────────────────

create table if not exists profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text,
  locale          text not null default 'en' check (locale in ('en', 'es')),
  notify_reminders boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name, locale)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    'en'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── Journeys ────────────────────────────────────────────────────────────────

create table if not exists journeys (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  started_at   timestamptz not null default now(),
  completed_at timestamptz,
  current_day  int not null default 1 check (current_day between 1 and 14)
);

alter table journeys enable row level security;

create policy "Users can manage own journeys"
  on journeys for all using (auth.uid() = user_id);

-- ─── Entries ─────────────────────────────────────────────────────────────────

create table if not exists entries (
  id           uuid primary key default gen_random_uuid(),
  journey_id   uuid not null references journeys(id) on delete cascade,
  user_id      uuid not null references profiles(id) on delete cascade,
  day_number   int not null check (day_number between 1 and 14),
  type         text not null check (type in ('morning', 'evening')),
  content      text,
  mood_score   int check (mood_score between 1 and 5),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (journey_id, day_number, type)
);

alter table entries enable row level security;

create policy "Users can manage own entries"
  on entries for all using (auth.uid() = user_id);

-- ─── Check-ins ────────────────────────────────────────────────────────────────

create table if not exists check_ins (
  id           uuid primary key default gen_random_uuid(),
  journey_id   uuid not null references journeys(id) on delete cascade,
  user_id      uuid not null references profiles(id) on delete cascade,
  day_number   int not null check (day_number between 1 and 14),
  completed_at timestamptz not null default now(),
  unique (journey_id, day_number)
);

alter table check_ins enable row level security;

create policy "Users can manage own check_ins"
  on check_ins for all using (auth.uid() = user_id);
