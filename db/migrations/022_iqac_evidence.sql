create table if not exists iqac_documents (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  category     text not null default 'general',
  academic_year text,
  file_url     text,
  link_url     text,
  is_published boolean not null default false,
  uploaded_by  uuid references profiles(id),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index if not exists idx_iqac_docs_year on iqac_documents(academic_year);
create index if not exists idx_iqac_docs_published on iqac_documents(is_published) where is_published = true;

alter table iqac_documents enable row level security;

create policy "public_read_iqac_published" on iqac_documents for select
  using (is_published = true);

create policy "iqac_staff_write" on iqac_documents for all
  using (
    (select role from profiles where id = (select auth.uid()))
    in ('iqac_coordinator', 'admin', 'super_admin', 'principal')
  );

create trigger iqac_documents_updated_at
  before update on iqac_documents
  for each row execute procedure set_updated_at();
