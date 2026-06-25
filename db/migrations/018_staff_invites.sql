create table if not exists staff_invites (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  role        user_role not null,
  invited_by  uuid references profiles(id) not null,
  token_hash  text not null unique,
  expires_at  timestamptz not null,
  accepted_at timestamptz,
  created_at  timestamptz default now()
);

create index if not exists idx_staff_invites_email
  on staff_invites(email) where accepted_at is null;

alter table staff_invites enable row level security;
-- No client policies — service role only
