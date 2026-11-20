-- ingage EduTech: learner data on the server (was browser-only), mentor doubts, staff roles, shared chat rate limit.
-- Every table has Row Level Security: learners see only their own rows; staff (mentors/admins) can read all and answer doubts.

-- ---------- staff (mentors and admins) ----------
create table if not exists public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'mentor' check (role in ('mentor', 'admin')),
  created_at timestamptz not null default now()
);
alter table public.staff enable row level security;
drop policy if exists "staff read own row" on public.staff;
create policy "staff read own row" on public.staff for select to authenticated using (user_id = (select auth.uid()));
-- rows are added by the project owner (SQL editor / service role) only

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.staff s where s.user_id = (select auth.uid()));
$$;
revoke execute on function public.is_staff() from public, anon;
grant execute on function public.is_staff() to authenticated;

-- ---------- learner profile (collected at sign-up, used by the chatbot) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text check (char_length(full_name) <= 120),
  phone text check (char_length(phone) <= 20),
  situation text check (situation in ('school', 'college', 'graduate', 'working', 'career_break', 'other')),
  goal text check (char_length(goal) <= 300),
  hours_per_week smallint check (hours_per_week between 0 and 80),
  education text check (char_length(education) <= 120),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "profile select own or staff" on public.profiles;
create policy "profile select own or staff" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_staff()));
drop policy if exists "profile insert own" on public.profiles;
create policy "profile insert own" on public.profiles for insert to authenticated with check (id = (select auth.uid()));
drop policy if exists "profile update own" on public.profiles;
create policy "profile update own" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- create a profile row for every new account
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (new.id, new.email,
          left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'), 120),
          left(new.raw_user_meta_data ->> 'phone', 20))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ---------- learner progress (enrollments + LMS state, previously localStorage) ----------
create table if not exists public.learner_state (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  enrollments jsonb not null default '{}'::jsonb,
  lms jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint learner_state_size check (pg_column_size(enrollments) + pg_column_size(lms) < 500000)
);
alter table public.learner_state enable row level security;
drop policy if exists "state select own or staff" on public.learner_state;
create policy "state select own or staff" on public.learner_state for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_staff()));
drop policy if exists "state insert own" on public.learner_state;
create policy "state insert own" on public.learner_state for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "state update own" on public.learner_state;
create policy "state update own" on public.learner_state for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- ---------- mentor doubts ----------
create table if not exists public.doubts (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  course text check (char_length(course) <= 120),
  question text not null check (char_length(question) between 1 and 2000),
  source text not null default 'chat' check (source in ('chat', 'lms')),
  answer text check (char_length(answer) <= 4000),
  answered_at timestamptz,
  answered_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists doubts_user_idx on public.doubts (user_id, created_at desc);
create index if not exists doubts_open_idx on public.doubts (created_at desc) where answer is null;
alter table public.doubts enable row level security;
drop policy if exists "doubt select own or staff" on public.doubts;
create policy "doubt select own or staff" on public.doubts for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_staff()));
drop policy if exists "doubt insert own" on public.doubts;
create policy "doubt insert own" on public.doubts for insert to authenticated
  with check (user_id = (select auth.uid()) and answer is null and answered_by is null);
drop policy if exists "doubt answer staff" on public.doubts;
create policy "doubt answer staff" on public.doubts for update to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

-- ---------- shared chat rate limit (same limit across all Edge Function instances and restarts) ----------
create table if not exists public.chat_rate (
  key text primary key,
  window_start timestamptz not null default now(),
  hits integer not null default 0
);
alter table public.chat_rate enable row level security; -- no policies: only the service role (Edge Function) touches it

create or replace function public.chat_hit(p_key text, p_limit integer) returns boolean
language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  insert into public.chat_rate as r (key, window_start, hits) values (left(p_key, 200), now(), 1)
  on conflict (key) do update set
    hits = case when r.window_start < now() - interval '60 seconds' then 1 else r.hits + 1 end,
    window_start = case when r.window_start < now() - interval '60 seconds' then now() else r.window_start end
  returning hits into n;
  if random() < 0.01 then delete from public.chat_rate where window_start < now() - interval '10 minutes'; end if;
  return n <= p_limit;
end $$;
revoke execute on function public.chat_hit(text, integer) from public, anon, authenticated;
grant execute on function public.chat_hit(text, integer) to service_role;

-- ---------- privileges (this project does not grant table access by default) ----------
revoke all on public.staff, public.profiles, public.learner_state, public.doubts, public.chat_rate from anon, authenticated;
grant select on public.staff to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.learner_state to authenticated;
grant select, insert on public.doubts to authenticated;
grant update (answer, answered_at, answered_by) on public.doubts to authenticated; -- RLS limits this to staff
grant all on public.staff, public.profiles, public.learner_state, public.doubts, public.chat_rate to service_role;
