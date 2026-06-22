// One-time setup: seed programmes + run SQL fixes via Supabase admin
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([^#=\s]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PASSWORD     = encodeURIComponent("RKMN@2026;;");
const DB_URL       = `postgresql://postgres:${PASSWORD}@db.ngccdhdnijrupubzbell.supabase.co:5432/postgres`;

const PROGRAMS = [
  { id: "11111111-1111-1111-1111-111111111001", name: "B.Tech Computer Science & Engineering", slug: "btech-cse",        level: "ug", mode: "full_time", is_active: true },
  { id: "11111111-1111-1111-1111-111111111002", name: "B.Tech Electronics & Communication",   slug: "btech-ece",        level: "ug", mode: "full_time", is_active: true },
  { id: "11111111-1111-1111-1111-111111111003", name: "MBA Business Administration",           slug: "mba",              level: "pg", mode: "full_time", is_active: true },
  { id: "11111111-1111-1111-1111-111111111004", name: "M.Tech AI & Machine Learning",          slug: "mtech-ai-ml",      level: "pg", mode: "full_time", is_active: true },
  { id: "11111111-1111-1111-1111-111111111005", name: "B.Sc Data Science",                     slug: "bsc-data-science", level: "ug", mode: "full_time", is_active: true },
  { id: "11111111-1111-1111-1111-111111111006", name: "B.Com (General)",                       slug: "bcom-general",     level: "ug", mode: "full_time", is_active: true },
  { id: "11111111-1111-1111-1111-111111111007", name: "B.A. (Humanities)",                     slug: "ba-humanities",    level: "ug", mode: "full_time", is_active: true },
];

const STORAGE_SQL = `
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('application-documents','application-documents',false,5242880,array['application/pdf','image/jpeg','image/png','image/jpg'])
on conflict (id) do update set file_size_limit=5242880, allowed_mime_types=array['application/pdf','image/jpeg','image/png','image/jpg'];

drop policy if exists "applicant_upload_docs" on storage.objects;
drop policy if exists "applicant_read_own_docs" on storage.objects;
drop policy if exists "applicant_update_docs" on storage.objects;
drop policy if exists "staff_read_all_docs" on storage.objects;

create policy "applicant_upload_docs" on storage.objects for insert to authenticated
with check (bucket_id='application-documents' and (storage.foldername(name))[1]=(select auth.uid()::text));

create policy "applicant_update_docs" on storage.objects for update to authenticated
using (bucket_id='application-documents' and (storage.foldername(name))[1]=(select auth.uid()::text));

create policy "applicant_read_own_docs" on storage.objects for select to authenticated
using (bucket_id='application-documents' and (storage.foldername(name))[1]=(select auth.uid()::text));

create policy "staff_read_all_docs" on storage.objects for select to authenticated
using (bucket_id='application-documents' and exists (
  select 1 from profiles where id=(select auth.uid()) and role in ('admissions_staff','admin','super_admin')
));

create unique index if not exists idx_app_docs_unique on application_documents (application_id, doc_type);
`;

async function seedPrograms(admin) {
  for (const p of PROGRAMS) {
    const { error } = await admin.from("programs").upsert(p, { onConflict: "slug" });
    if (error) console.warn("  programme", p.slug, ":", error.message);
    else console.log("  ✓", p.name);
  }
}

async function runSql() {
  const client = new pg.Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(STORAGE_SQL);
    console.log("  ✓ storage policies + doc unique index");
  } finally {
    await client.end();
  }
}

async function main() {
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  console.log("Seeding programmes…");
  await seedPrograms(admin);
  console.log("Applying storage SQL…");
  try {
    await runSql();
  } catch (e) {
    console.warn("  SQL via direct DB failed:", e.message);
    console.warn("  Storage policies may need manual setup in Supabase dashboard.");
  }
  console.log("Done.");
}

main().catch(e => { console.error(e); process.exit(1); });
