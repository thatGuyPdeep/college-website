-- Per-staff dashboard widget preferences (group order, hidden groups)
alter table profiles
  add column if not exists dashboard_prefs jsonb not null default '{}';

comment on column profiles.dashboard_prefs is
  'Optional KPI widget customisation: { "groupOrder": ["admissions", ...], "hiddenGroups": ["iqac"] }';
