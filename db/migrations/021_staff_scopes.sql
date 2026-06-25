create type staff_scope_type as enum ('department', 'programme');

create table if not exists staff_scopes (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references profiles(id) on delete cascade,
  scope_type   staff_scope_type not null,
  scope_value  text not null,
  created_at   timestamptz default now(),
  unique (profile_id, scope_type, scope_value)
);

create index if not exists idx_staff_scopes_profile on staff_scopes(profile_id);

alter table staff_scopes enable row level security;

create policy "staff_read_own_scopes" on staff_scopes for select
  using (profile_id = (select auth.uid()));

create policy "admin_manage_scopes" on staff_scopes for all
  using (
    (select role from profiles where id = (select auth.uid())) in ('admin', 'super_admin')
  );
