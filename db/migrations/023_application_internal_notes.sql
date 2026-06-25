create table if not exists application_internal_notes (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references applications(id) on delete cascade,
  author_id       uuid not null references profiles(id),
  body            text not null,
  created_at      timestamptz default now()
);

create index if not exists idx_app_notes_application on application_internal_notes(application_id);

alter table application_internal_notes enable row level security;

create policy "staff_read_app_notes" on application_internal_notes for select
  using (
    (select role from profiles where id = (select auth.uid()))
    in ('admissions_staff', 'admin', 'super_admin', 'hod', 'principal')
  );

create policy "staff_insert_app_notes" on application_internal_notes for insert
  with check (
    author_id = (select auth.uid())
    and (select role from profiles where id = (select auth.uid()))
    in ('admissions_staff', 'admin', 'super_admin', 'hod', 'principal')
  );

create table if not exists staff_tasks (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  assigned_to   uuid not null references profiles(id) on delete cascade,
  assigned_by   uuid not null references profiles(id),
  entity_type   text,
  entity_id     uuid,
  due_at        timestamptz,
  completed_at  timestamptz,
  created_at    timestamptz default now()
);

create index if not exists idx_staff_tasks_assignee on staff_tasks(assigned_to, completed_at);

alter table staff_tasks enable row level security;

create policy "staff_read_own_tasks" on staff_tasks for select
  using (
    assigned_to = (select auth.uid())
    or assigned_by = (select auth.uid())
    or (select role from profiles where id = (select auth.uid())) in ('admin', 'super_admin', 'principal')
  );

create policy "staff_manage_tasks" on staff_tasks for all
  using (
    assigned_by = (select auth.uid())
    or (select role from profiles where id = (select auth.uid())) in ('admin', 'super_admin', 'principal')
  );

-- Scheduled content publish
alter table news_events
  add column if not exists scheduled_publish_at timestamptz;
