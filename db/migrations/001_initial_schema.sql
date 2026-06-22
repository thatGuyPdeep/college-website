-- ============================================================
-- College Website — Initial Schema
-- Run in Supabase SQL editor or via `supabase db push`
-- ============================================================

-- ENUMS
create type user_role as enum (
  'applicant','faculty_applicant','student','faculty',
  'admissions_staff','hr_staff','content_editor','admin','super_admin'
);
create type application_status as enum ('draft','submitted','under_review','approved','rejected');
create type document_status    as enum ('pending','submitted','approved','rejected');
create type payment_status     as enum ('created','paid','failed','refunded');
create type vacancy_status     as enum ('open','closed');
create type faculty_app_status as enum ('submitted','shortlisted','rejected','interview');
create type program_level      as enum ('ug','pg','diploma','phd');
create type study_mode         as enum ('full_time','part_time','odl');

-- PROFILES (extends auth.users)
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text,
  phone       text,
  role        user_role not null default 'applicant',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table profiles enable row level security;
create policy "self_read"   on profiles for select using (id = (select auth.uid()));
create policy "self_update" on profiles for update using (id = (select auth.uid()));

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- AUTO updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- DEPARTMENTS
create table departments (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  overview    text,
  created_at  timestamptz default now()
);
alter table departments enable row level security;
create policy "public_read_departments" on departments for select using (true);
create policy "editor_write_departments" on departments for all
  using ((select role from profiles where id=(select auth.uid())) in ('content_editor','admin','super_admin'));

-- PROGRAMS
create table programs (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text unique not null,
  department_id uuid references departments(id) on delete set null,
  level         program_level not null,
  mode          study_mode not null default 'full_time',
  duration      text,
  eligibility   text,
  fees          numeric(12,2),
  curriculum    text,
  outcomes      text,
  intake        int,
  is_active     boolean default true,
  created_at    timestamptz default now()
);
alter table programs enable row level security;
create policy "public_read_programs" on programs for select using (is_active = true);
create policy "editor_write_programs" on programs for all
  using ((select role from profiles where id=(select auth.uid())) in ('content_editor','admin','super_admin'));

-- FACULTY
create table faculty (
  id                uuid primary key default gen_random_uuid(),
  full_name         text not null,
  designation       text,
  department_id     uuid references departments(id) on delete set null,
  qualifications    text,
  specialization    text,
  experience_years  int,
  photo_url         text,
  profile           text,
  is_active         boolean default true
);
alter table faculty enable row level security;
create policy "public_read_faculty" on faculty for select using (is_active = true);
create policy "editor_write_faculty" on faculty for all
  using ((select role from profiles where id=(select auth.uid())) in ('content_editor','admin','super_admin'));

-- NEWS & EVENTS
create table news_events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text unique not null,
  category     text,
  body         text,
  cover_url    text,
  published_at timestamptz,
  is_published boolean default false
);
alter table news_events enable row level security;
create policy "public_read_news"  on news_events for select using (is_published = true);
create policy "editor_write_news" on news_events for all
  using ((select role from profiles where id=(select auth.uid())) in ('content_editor','admin','super_admin'));

-- DISCLOSURE ITEMS (UGC/AICTE)
create table disclosure_items (
  id          uuid primary key default gen_random_uuid(),
  section     text not null,
  label       text not null,
  link_url    text,
  file_path   text,
  sort_order  int default 0,
  updated_at  timestamptz default now()
);
alter table disclosure_items enable row level security;
create policy "public_read_disclosure"  on disclosure_items for select using (true);
create policy "editor_write_disclosure" on disclosure_items for all
  using ((select role from profiles where id=(select auth.uid())) in ('content_editor','admin','super_admin'));

-- APPLICATIONS
create table applications (
  id              uuid primary key default gen_random_uuid(),
  applicant_id    uuid not null references auth.users(id) on delete cascade,
  program_id      uuid references programs(id) on delete set null,
  status          application_status not null default 'draft',
  form_data       jsonb not null default '{}',
  current_step    int default 1,
  submitted_at    timestamptz,
  decided_at      timestamptz,
  decision_reason text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index on applications (applicant_id);
create index on applications (status);
alter table applications enable row level security;

create policy "own_read_app" on applications for select
  using (applicant_id = (select auth.uid())
    or (select role from profiles where id=(select auth.uid())) in ('admissions_staff','admin','super_admin'));

create policy "own_insert_app" on applications for insert
  with check (applicant_id = (select auth.uid()));

create policy "own_update_draft" on applications for update
  using (applicant_id = (select auth.uid()) and status = 'draft');

create policy "staff_update_app" on applications for update
  using ((select role from profiles where id=(select auth.uid())) in ('admissions_staff','admin','super_admin'));

create trigger applications_updated_at
  before update on applications
  for each row execute function set_updated_at();

-- APPLICATION DOCUMENTS
create table application_documents (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  doc_type       text not null,
  file_path      text,
  status         document_status not null default 'pending',
  reason         text,
  uploaded_at    timestamptz
);
create index on application_documents (application_id);
alter table application_documents enable row level security;

create policy "own_staff_read_docs" on application_documents for select
  using (exists (
    select 1 from applications a where a.id = application_id
      and (a.applicant_id = (select auth.uid())
        or (select role from profiles where id=(select auth.uid())) in ('admissions_staff','admin','super_admin'))
  ));
create policy "own_insert_docs" on application_documents for insert
  with check (exists (select 1 from applications a where a.id = application_id and a.applicant_id = (select auth.uid())));
create policy "own_update_pending_docs" on application_documents for update
  using (exists (select 1 from applications a where a.id = application_id and a.applicant_id = (select auth.uid())));
create policy "staff_update_docs" on application_documents for update
  using ((select role from profiles where id=(select auth.uid())) in ('admissions_staff','admin','super_admin'));

-- PAYMENTS
create table payments (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  amount         numeric(12,2) not null,
  gateway        text default 'razorpay',
  gateway_ref    text unique,
  status         payment_status not null default 'created',
  created_at     timestamptz default now()
);
alter table payments enable row level security;
create policy "own_read_payment" on payments for select
  using (exists (select 1 from applications a where a.id = application_id and a.applicant_id = (select auth.uid())));

-- VACANCIES
create table vacancies (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  department_id uuid references departments(id) on delete set null,
  designation   text,
  description   text,
  status        vacancy_status not null default 'open',
  posted_at     timestamptz default now(),
  closes_at     timestamptz
);
alter table vacancies enable row level security;
create policy "public_read_vacancies" on vacancies for select using (status = 'open');
create policy "hr_write_vacancies"    on vacancies for all
  using ((select role from profiles where id=(select auth.uid())) in ('hr_staff','admin','super_admin'));

-- FACULTY APPLICATIONS
create table faculty_applications (
  id           uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references auth.users(id) on delete cascade,
  vacancy_id   uuid not null references vacancies(id) on delete cascade,
  experience   jsonb default '{}',
  status       faculty_app_status not null default 'submitted',
  created_at   timestamptz default now(),
  unique(applicant_id, vacancy_id)
);
create index on faculty_applications (vacancy_id);
alter table faculty_applications enable row level security;
create policy "own_hr_read_fapp" on faculty_applications for select
  using (applicant_id = (select auth.uid())
    or (select role from profiles where id=(select auth.uid())) in ('hr_staff','admin','super_admin'));
create policy "own_insert_fapp" on faculty_applications for insert
  with check (applicant_id = (select auth.uid()));
create policy "hr_update_fapp" on faculty_applications for update
  using ((select role from profiles where id=(select auth.uid())) in ('hr_staff','admin','super_admin'));

-- FACULTY APP FILES
create table faculty_app_files (
  id                    uuid primary key default gen_random_uuid(),
  faculty_application_id uuid not null references faculty_applications(id) on delete cascade,
  file_type             text not null,
  file_path             text not null
);
alter table faculty_app_files enable row level security;
create policy "own_hr_read_ffiles" on faculty_app_files for select
  using (exists (
    select 1 from faculty_applications fa where fa.id = faculty_application_id
      and (fa.applicant_id = (select auth.uid())
        or (select role from profiles where id=(select auth.uid())) in ('hr_staff','admin','super_admin'))
  ));

-- NOTIFICATIONS
create table notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  channel     text default 'email',
  template    text not null,
  payload     jsonb default '{}',
  status      text default 'queued',
  created_at  timestamptz default now()
);
alter table notifications enable row level security;
create policy "own_read_notifications" on notifications for select using (user_id = (select auth.uid()));

-- AUDIT LOG
create table audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references auth.users(id) on delete set null,
  action      text not null,
  entity      text,
  entity_id   uuid,
  meta        jsonb default '{}',
  created_at  timestamptz default now()
);
alter table audit_log enable row level security;
create policy "staff_read_audit" on audit_log for select
  using ((select role from profiles where id=(select auth.uid())) in ('admin','super_admin'));

-- AI RAG
create extension if not exists vector;
create table content_chunks (
  id          uuid primary key default gen_random_uuid(),
  source_url  text,
  text        text not null,
  embedding   vector(1536),
  created_at  timestamptz default now()
);
create index on content_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);
alter table content_chunks enable row level security;
create policy "public_read_chunks" on content_chunks for select using (true);

-- ============================================================
-- STORAGE BUCKETS (run in Supabase dashboard or via CLI)
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('public-assets', 'public-assets', true);
-- insert into storage.buckets (id, name, public) values ('admission-docs', 'admission-docs', false);
-- insert into storage.buckets (id, name, public) values ('recruitment-files', 'recruitment-files', false);
-- insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false);
