-- Staff notification inbox (distinct from applicant app_notifications)

create type staff_notification_type as enum (
  'application_submitted',
  'application_payment',
  'contact_enquiry',
  'faculty_application',
  'content_draft',
  'task_assigned',
  'system'
);

create table if not exists staff_notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id) on delete cascade,
  target_role user_role,
  type        staff_notification_type not null,
  title       text not null,
  body        text,
  href        text,
  entity_type text,
  entity_id   uuid,
  read_at     timestamptz,
  created_at  timestamptz default now(),
  constraint staff_notif_target check (user_id is not null or target_role is not null)
);

create index if not exists idx_staff_notif_user_unread
  on staff_notifications(user_id, read_at) where read_at is null;

create index if not exists idx_staff_notif_role_unread
  on staff_notifications(target_role, read_at) where read_at is null and target_role is not null;

alter table staff_notifications enable row level security;

create policy "staff_read_notifications" on staff_notifications for select
  using (
    user_id = (select auth.uid())
    or (
      target_role is not null
      and target_role = (select role from profiles where id = (select auth.uid()))
    )
  );

create policy "staff_update_own_notifications" on staff_notifications for update
  using (
    user_id = (select auth.uid())
    or (
      target_role is not null
      and target_role = (select role from profiles where id = (select auth.uid()))
    )
  )
  with check (
    user_id = (select auth.uid())
    or (
      target_role is not null
      and target_role = (select role from profiles where id = (select auth.uid()))
    )
  );
