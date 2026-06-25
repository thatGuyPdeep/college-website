#!/usr/bin/env node
/** One-off: create recruitment-files storage bucket + RLS. */
import pg from "pg";
import "dotenv/config";

const { Client } = pg;

const password = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD ?? "RKMN@2026;;");
const ref = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1] ?? "ngccdhdnijrupubzbell";
const connection = `postgresql://postgres:${password}@db.${ref}.supabase.co:5432/postgres`;

const statements = [
  `INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
   VALUES ('recruitment-files', 'recruitment-files', false, 5242880, ARRAY['application/pdf'])
   ON CONFLICT (id) DO UPDATE SET
     file_size_limit = 5242880,
     allowed_mime_types = ARRAY['application/pdf']`,
  `DROP POLICY IF EXISTS "recruitment_applicant_upload" ON storage.objects`,
  `DROP POLICY IF EXISTS "recruitment_applicant_read_own" ON storage.objects`,
  `DROP POLICY IF EXISTS "recruitment_hr_read" ON storage.objects`,
  `CREATE POLICY "recruitment_applicant_upload" ON storage.objects
     FOR INSERT TO authenticated
     WITH CHECK (
       bucket_id = 'recruitment-files'
       AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
     )`,
  `CREATE POLICY "recruitment_applicant_read_own" ON storage.objects
     FOR SELECT TO authenticated
     USING (
       bucket_id = 'recruitment-files'
       AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
     )`,
  `CREATE POLICY "recruitment_hr_read" ON storage.objects
     FOR SELECT TO authenticated
     USING (
       bucket_id = 'recruitment-files'
       AND EXISTS (
         SELECT 1 FROM profiles
         WHERE id = (SELECT auth.uid())
           AND role IN ('hr_staff', 'admin', 'super_admin')
       )
     )`,
];

const client = new Client({ connectionString: connection, ssl: { rejectUnauthorized: false } });
await client.connect();

for (const stmt of statements) {
  try {
    await client.query(stmt);
    console.log("OK");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

const { rows } = await client.query(
  "SELECT id FROM storage.buckets WHERE id = 'recruitment-files'"
);
console.log(rows.length ? "recruitment-files bucket ready" : "bucket missing");
await client.end();
