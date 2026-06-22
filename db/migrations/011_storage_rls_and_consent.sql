-- Storage: recruitment CVs, payment receipts, ERP submission RLS

-- ── recruitment-files ───────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recruitment-files',
  'recruitment-files',
  false,
  5242880,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['application/pdf'];

-- ── receipts (admission / payment PDFs) ─────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'receipts',
  'receipts',
  false,
  10485760,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf'];

-- ── erp-submissions RLS (bucket from 010) ─────────────────────
DROP POLICY IF EXISTS "erp_staff_read_submissions" ON storage.objects;
DROP POLICY IF EXISTS "erp_student_read_own_submissions" ON storage.objects;

CREATE POLICY "erp_student_read_own_submissions" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'erp-submissions'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

CREATE POLICY "erp_staff_read_submissions" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'erp-submissions'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('faculty', 'admin', 'super_admin')
    )
  );

-- ── recruitment-files RLS ───────────────────────────────────────
DROP POLICY IF EXISTS "recruitment_applicant_upload" ON storage.objects;
DROP POLICY IF EXISTS "recruitment_applicant_read_own" ON storage.objects;
DROP POLICY IF EXISTS "recruitment_hr_read" ON storage.objects;

CREATE POLICY "recruitment_applicant_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'recruitment-files'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

CREATE POLICY "recruitment_applicant_read_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'recruitment-files'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

CREATE POLICY "recruitment_hr_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'recruitment-files'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('hr_staff', 'admin', 'super_admin')
    )
  );

-- ── receipts: staff + owner read (writes via service role) ───────
DROP POLICY IF EXISTS "receipts_owner_read" ON storage.objects;
DROP POLICY IF EXISTS "receipts_staff_read" ON storage.objects;

CREATE POLICY "receipts_owner_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

CREATE POLICY "receipts_staff_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'receipts'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('admissions_staff', 'admin', 'super_admin')
    )
  );

-- ── DPDP consent timestamps ─────────────────────────────────────
ALTER TABLE contact_enquiries
  ADD COLUMN IF NOT EXISTS dpdp_consent_at TIMESTAMPTZ;

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS dpdp_consent_at TIMESTAMPTZ;
