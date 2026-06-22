-- OTP codes table for custom email OTP auth
create table if not exists otp_codes (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  code        text not null,
  expires_at  timestamptz not null,
  used        boolean default false,
  created_at  timestamptz default now()
);

-- No RLS needed — only accessible via service_role (admin client)
-- Clean up expired codes automatically after 1 hour
create index if not exists idx_otp_email on otp_codes(email, created_at);
create index if not exists idx_otp_lookup on otp_codes(email, code, used, expires_at);
