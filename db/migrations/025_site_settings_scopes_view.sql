-- Site settings (seat matrix overrides, etc.)
create table if not exists site_settings (
  key         text primary key,
  value       jsonb not null default '{}',
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id) on delete set null
);

alter table site_settings enable row level security;

drop policy if exists site_settings_public_read on site_settings;
create policy site_settings_public_read on site_settings
  for select using (true);

drop policy if exists site_settings_staff_write on site_settings;
create policy site_settings_staff_write on site_settings
  for all using (
    (select role from profiles where id = (select auth.uid()))
    in ('admissions_staff', 'content_editor', 'admin', 'super_admin')
  );

-- Extend applications view with programme + department scope fields
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
  a.applicant_id,
  a.program_id,
  p.full_name   as applicant_name,
  p.email       as applicant_email,
  p.phone       as applicant_phone,
  pr.name       as program_name,
  pr.level      as program_level,
  pr.slug       as program_slug,
  d.slug        as department_slug
from applications a
join profiles p on p.id = a.applicant_id
left join programs pr on pr.id = a.program_id
left join departments d on d.id = pr.department_id;
