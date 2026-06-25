alter table profiles
  add column if not exists department_slug text,
  add column if not exists hindi_name text,
  add column if not exists is_active boolean not null default true,
  add column if not exists last_login_at timestamptz;

create index if not exists idx_profiles_role_active
  on profiles(role) where is_active = true;
