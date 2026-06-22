-- ================================================================
-- Migration 004: Seed programmes, doc upsert constraint, storage RLS
-- ================================================================

-- ── 1. SEED PROGRAMMES (stable UUIDs for apply form) ─────────────
insert into programs (id, name, slug, level, mode, is_active) values
  ('11111111-1111-1111-1111-111111111001', 'B.Tech Computer Science & Engineering', 'btech-cse',              'ug',  'full_time', true),
  ('11111111-1111-1111-1111-111111111002', 'B.Tech Electronics & Communication',   'btech-ece',              'ug',  'full_time', true),
  ('11111111-1111-1111-1111-111111111003', 'MBA Business Administration',           'mba',                    'pg',  'full_time', true),
  ('11111111-1111-1111-1111-111111111004', 'M.Tech AI & Machine Learning',          'mtech-ai-ml',            'pg',  'full_time', true),
  ('11111111-1111-1111-1111-111111111005', 'B.Sc Data Science',                     'bsc-data-science',       'ug',  'full_time', true),
  ('11111111-1111-1111-1111-111111111006', 'B.Com (General)',                       'bcom-general',           'ug',  'full_time', true),
  ('11111111-1111-1111-1111-111111111007', 'B.A. (Humanities)',                     'ba-humanities',          'ug',  'full_time', true)
on conflict (slug) do update set
  name      = excluded.name,
  level     = excluded.level,
  is_active = true;

-- ── 2. UNIQUE CONSTRAINT for document upserts ────────────────────
-- Remove duplicates first (keep row with latest id)
delete from application_documents a
using application_documents b
where a.application_id = b.application_id
  and a.doc_type = b.doc_type
  and a.id < b.id;

create unique index if not exists idx_app_docs_unique
  on application_documents (application_id, doc_type);

-- Allow applicants to upsert their own documents
drop policy if exists "own_upsert_docs" on application_documents;
create policy "own_upsert_docs" on application_documents
  for insert
  with check (
    exists (
      select 1 from applications a
      where a.id = application_id
        and a.applicant_id = (select auth.uid())
        and a.status = 'draft'
    )
  );

-- ── 3. STORAGE RLS for application-documents bucket ──────────────
-- Ensure bucket exists
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'application-documents',
  'application-documents',
  false,
  5242880,
  array['application/pdf','image/jpeg','image/png','image/jpg']
)
on conflict (id) do update set
  file_size_limit    = 5242880,
  allowed_mime_types = array['application/pdf','image/jpeg','image/png','image/jpg'];

-- Drop old policies if re-running
drop policy if exists "applicant_upload_docs"   on storage.objects;
drop policy if exists "applicant_read_own_docs" on storage.objects;
drop policy if exists "applicant_update_docs"   on storage.objects;
drop policy if exists "staff_read_all_docs"     on storage.objects;

-- Applicant can upload to their own folder: {user_id}/{application_id}/...
create policy "applicant_upload_docs" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'application-documents'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "applicant_update_docs" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'application-documents'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "applicant_read_own_docs" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'application-documents'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "staff_read_all_docs" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'application-documents'
    and exists (
      select 1 from profiles
      where id = (select auth.uid())
        and role in ('admissions_staff','admin','super_admin')
    )
  );
