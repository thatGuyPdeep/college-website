-- Contact enquiries + recruitment seeds + file insert policy

create table if not exists contact_enquiries (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null,
  email      text not null,
  phone      text,
  subject    text not null,
  message    text not null,
  status     text default 'new',
  created_at timestamptz default now()
);
alter table contact_enquiries enable row level security;
create policy "staff_read_enquiries" on contact_enquiries for select
  using ((select role from profiles where id=(select auth.uid())) in ('admin','super_admin','admissions_staff'));
create policy "public_insert_enquiry" on contact_enquiries for insert with check (true);

-- Allow applicants to upload recruitment files
drop policy if exists "own_insert_ffiles" on faculty_app_files;
create policy "own_insert_ffiles" on faculty_app_files for insert
  with check (exists (
    select 1 from faculty_applications fa
    where fa.id = faculty_application_id and fa.applicant_id = (select auth.uid())
  ));

-- Seed departments
insert into departments (id, name, slug, overview) values
  ('22222222-2222-2222-2222-222222222001', 'Computer Science', 'computer-science', 'Department of Computer Science & IT'),
  ('22222222-2222-2222-2222-222222222002', 'Electronics & Communication', 'electronics', 'Department of Electronics & Communication Engineering'),
  ('22222222-2222-2222-2222-222222222003', 'Mathematics', 'mathematics', 'Department of Mathematics'),
  ('22222222-2222-2222-2222-222222222004', 'Management', 'management', 'Department of Management Studies')
on conflict (slug) do nothing;

-- Seed open vacancies
insert into vacancies (id, title, department_id, designation, description, status, closes_at) values
  ('33333333-3333-3333-3333-333333333001', 'Professor – Computer Science',
   '22222222-2222-2222-2222-222222222001', 'Professor',
   'Ph.D. in Computer Science with 10+ years teaching/research experience. NET/SET qualified preferred.',
   'open', now() + interval '45 days'),
  ('33333333-3333-3333-3333-333333333002', 'Associate Professor – Electronics & Communication',
   '22222222-2222-2222-2222-222222222002', 'Associate Professor',
   'Ph.D. in ECE with 8+ years experience. Strong publication record and industry collaboration.',
   'open', now() + interval '50 days'),
  ('33333333-3333-3333-3333-333333333003', 'Assistant Professor – Mathematics',
   '22222222-2222-2222-2222-222222222003', 'Assistant Professor',
   'M.Sc./Ph.D. in Mathematics. NET qualified. Experience in UG/PG teaching.',
   'open', now() + interval '30 days'),
  ('33333333-3333-3333-3333-333333333004', 'Assistant Professor – Management',
   '22222222-2222-2222-2222-222222222004', 'Assistant Professor',
   'MBA/Ph.D. with specialization in HR/Marketing/Finance. Industry experience preferred.',
   'open', now() + interval '60 days')
on conflict (id) do update set status = 'open', closes_at = excluded.closes_at;

-- AI chat logs
create table if not exists ai_chat_logs (
  id         uuid primary key default gen_random_uuid(),
  session_id text,
  question   text not null,
  answer     text,
  sources    jsonb default '[]',
  created_at timestamptz default now()
);
alter table ai_chat_logs enable row level security;
create policy "staff_read_ai_logs" on ai_chat_logs for select
  using ((select role from profiles where id=(select auth.uid())) in ('admin','super_admin'));
