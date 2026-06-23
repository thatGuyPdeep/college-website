-- Optional PDF attachment metadata for news/notices (SMKV-style notice downloads)
alter table news_events
  add column if not exists attachment_url   text,
  add column if not exists attachment_label text,
  add column if not exists language         text;
