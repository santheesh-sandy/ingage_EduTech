-- Resumes uploaded at sign-up (or later in the Resume builder).
-- Files: private bucket "resumes", one folder per user: <user id>/resume.<pdf|docx|txt>
-- The learner reads/writes only their own folder; staff (public.staff) can read every resume.

alter table public.profiles add column if not exists resume_path text;
alter table public.profiles add column if not exists resume_name text;
alter table public.profiles add column if not exists resume_fields jsonb;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', false, 5242880, array[
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "resumes read own or staff" on storage.objects;
create policy "resumes read own or staff" on storage.objects for select to authenticated
  using (bucket_id = 'resumes' and ((storage.foldername(name))[1] = (select auth.uid())::text or public.is_staff()));

drop policy if exists "resumes insert own" on storage.objects;
create policy "resumes insert own" on storage.objects for insert to authenticated
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "resumes update own" on storage.objects;
create policy "resumes update own" on storage.objects for update to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "resumes delete own" on storage.objects;
create policy "resumes delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text);
