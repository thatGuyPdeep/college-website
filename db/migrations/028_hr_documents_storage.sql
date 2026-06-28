-- Storage bucket for HR documents (salary slip PDFs)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hr-documents',
  'hr-documents',
  false,
  5242880,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['application/pdf'];

-- HR staff + owner read via signed URLs (API uses service role)
DROP POLICY IF EXISTS hr_docs_staff_read ON storage.objects;
CREATE POLICY hr_docs_staff_read ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'hr-documents'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR (SELECT role FROM profiles WHERE id = auth.uid())
         IN ('hr_staff', 'accounts_staff', 'admin', 'super_admin')
    )
  );
