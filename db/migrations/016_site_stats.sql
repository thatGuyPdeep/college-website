-- Site-wide counters (visitor count, etc.)
create table if not exists site_stats (
  key        text primary key,
  value      bigint not null default 0,
  updated_at timestamptz not null default now()
);

insert into site_stats (key, value)
values ('page_views', 12450)
on conflict (key) do nothing;

-- Allow service role to read/write; no public direct access
alter table site_stats enable row level security;

create policy "Service role only"
  on site_stats
  for all
  using (false);
