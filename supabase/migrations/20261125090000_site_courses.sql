-- ingage EduTech: courses added or edited in Admin → Courses, shared with every visitor.
-- Before this, Admin course changes were saved only in the admin's own browser, so learners never saw them.
-- One row per course (id = the course number). "data" holds the course exactly as the Admin editor saves it
-- (title, category, picture, fee, modules, lessons, MCQs, careers…). A course removed in Admin is kept with deleted = true.
-- Everyone (signed in or not) can read; only staff (a row in public.staff, checked by is_staff()) can add, change or remove.

create table if not exists public.site_courses (
  id integer primary key check (id > 0),
  data jsonb not null default '{}'::jsonb,
  deleted boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid()
);
alter table public.site_courses enable row level security;

drop policy if exists "courses readable by everyone" on public.site_courses;
create policy "courses readable by everyone" on public.site_courses for select to anon, authenticated using (true);

drop policy if exists "courses insert staff" on public.site_courses;
create policy "courses insert staff" on public.site_courses for insert to authenticated with check ((select public.is_staff()));

drop policy if exists "courses update staff" on public.site_courses;
create policy "courses update staff" on public.site_courses for update to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

drop policy if exists "courses delete staff" on public.site_courses;
create policy "courses delete staff" on public.site_courses for delete to authenticated using ((select public.is_staff()));

revoke all on public.site_courses from anon, authenticated;
grant select on public.site_courses to anon, authenticated;
grant insert, update, delete on public.site_courses to authenticated; -- RLS limits writes to staff
grant all on public.site_courses to service_role;
