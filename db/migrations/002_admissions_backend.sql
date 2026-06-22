-- ================================================================
-- Migration 002: Admissions Backend
-- Apply in Supabase SQL Editor after 001_initial_schema.sql
-- ================================================================

-- ── 1. EXTEND application_status ENUM ───────────────────────────
alter type application_status add value if not exists 'waitlisted';

-- ── 2. APPLICATION NUMBER SEQUENCE ──────────────────────────────
-- Generates RKM-2026-00001 style numbers automatically

create sequence if not exists application_number_seq start 1;

alter table applications
  add column if not exists application_no text unique,
  add column if not exists academic_year  text default '2026-27',
  add column if not exists personal_data  jsonb default '{}',
  add column if not exists academic_data  jsonb default '{}',
  add column if not exists program_data   jsonb default '{}',
  add column if not exists docs_checklist jsonb default '{}';

-- Auto-assign application_no on insert
create or replace function assign_application_no()
returns trigger language plpgsql as $$
begin
  if new.application_no is null then
    new.application_no := 'RKM-' || to_char(now(), 'YYYY') || '-' ||
                          lpad(nextval('application_number_seq')::text, 5, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_assign_application_no on applications;
create trigger trg_assign_application_no
  before insert on applications
  for each row execute function assign_application_no();

-- updated_at trigger for applications (if not already created)
drop trigger if exists trg_applications_updated_at on applications;
create trigger trg_applications_updated_at
  before update on applications
  for each row execute function set_updated_at();

-- ── 3. AUDIT LOG ─────────────────────────────────────────────────
create table if not exists audit_logs (
  id             uuid primary key default gen_random_uuid(),
  entity_type    text not null,           -- 'application' | 'document'
  entity_id      uuid not null,
  action         text not null,           -- 'status_change' | 'doc_uploaded' | 'submitted'
  actor_id       uuid references auth.users(id) on delete set null,
  old_value      jsonb,
  new_value      jsonb,
  note           text,
  created_at     timestamptz default now()
);
alter table audit_logs enable row level security;
-- Only admins can read audit logs; service role writes them
create policy "admin_read_audit" on audit_logs
  for select using (
    exists (
      select 1 from profiles
      where id = (select auth.uid())
      and role in ('admin','super_admin','admissions_staff')
    )
  );

-- ── 4. APP NOTIFICATIONS TABLE ───────────────────────────────────
-- Named app_notifications to avoid conflict with Supabase internals
create table if not exists app_notifications (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade,
  type         text not null,          -- 'application_submitted' | 'status_changed' | 'doc_requested'
  title        text not null,
  body         text,
  is_read      boolean default false,
  metadata     jsonb default '{}',
  created_at   timestamptz default now()
);
alter table app_notifications enable row level security;
create policy "own_app_notifications" on app_notifications
  for all using (user_id = (select auth.uid()));

-- ── 5. RLS for APPLICATIONS ──────────────────────────────────────
-- Applicants see only their own; staff see all
drop policy if exists "applicant_own" on applications;
create policy "applicant_own" on applications
  for all using (
    applicant_id = (select auth.uid())
    or exists (
      select 1 from profiles
      where id = (select auth.uid())
      and role in ('admissions_staff','admin','super_admin')
    )
  );

-- ── 6. RLS for APPLICATION_DOCUMENTS ─────────────────────────────
drop policy if exists "applicant_doc_own" on application_documents;
create policy "applicant_doc_own" on application_documents
  for all using (
    exists (
      select 1 from applications a
      where a.id = application_documents.application_id
      and (
        a.applicant_id = (select auth.uid())
        or exists (
          select 1 from profiles p
          where p.id = (select auth.uid())
          and p.role in ('admissions_staff','admin','super_admin')
        )
      )
    )
  );

-- ── 7. STORAGE BUCKET ────────────────────────────────────────────
-- Run in Supabase Dashboard > Storage:
--   Create bucket: "application-documents"  (private)
--   Create bucket: "application-pdfs"       (private)
--
-- Or via SQL (needs pg_net / storage schema access):
-- insert into storage.buckets (id, name, public)
--   values ('application-documents', 'application-documents', false)
--   on conflict do nothing;

-- Storage RLS (run after bucket creation):
-- create policy "applicant_upload" on storage.objects
--   for insert with check (
--     bucket_id = 'application-documents'
--     and (storage.foldername(name))[1] = (select auth.uid()::text)
--   );
-- create policy "applicant_read_own" on storage.objects
--   for select using (
--     bucket_id = 'application-documents'
--     and (storage.foldername(name))[1] = (select auth.uid()::text)
--   );
-- create policy "staff_read_all" on storage.objects
--   for select using (
--     bucket_id = 'application-documents'
--     and exists (
--       select 1 from profiles
--       where id = (select auth.uid())
--       and role in ('admissions_staff','admin','super_admin')
--     )
--   );

-- ── 8. HELPER VIEW: applications with profile + program ──────────
create or replace view v_applications as
select
  a.id,
  a.application_no,
  a.academic_year,
  a.status,
  a.current_step,
  a.personal_data,
  a.academic_data,
  a.program_data,
  a.docs_checklist,
  a.submitted_at,
  a.decided_at,
  a.decision_reason,
  a.created_at,
  a.updated_at,
  p.full_name   as applicant_name,
  p.email       as applicant_email,
  p.phone       as applicant_phone,
  pr.name       as program_name,
  pr.level      as program_level
from applications a
join profiles p on p.id = a.applicant_id
left join programs pr on pr.id = a.program_id;

-- ── 9. INDEXES ───────────────────────────────────────────────────
create index if not exists idx_applications_status      on applications(status);
create index if not exists idx_applications_applicant   on applications(applicant_id);
create index if not exists idx_applications_no          on applications(application_no);
create index if not exists idx_audit_entity             on audit_logs(entity_type, entity_id);
create index if not exists idx_app_notifications_user   on app_notifications(user_id, is_read);
