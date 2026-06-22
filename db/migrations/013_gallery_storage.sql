-- Gallery photo uploads (CMS)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-photos',
  'gallery-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "gallery_public_read" ON storage.objects;
CREATE POLICY "gallery_public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'gallery-photos');

DROP POLICY IF EXISTS "gallery_editor_upload" ON storage.objects;
CREATE POLICY "gallery_editor_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'gallery-photos'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('content_editor', 'admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "gallery_editor_delete" ON storage.objects;
CREATE POLICY "gallery_editor_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'gallery-photos'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('content_editor', 'admin', 'super_admin')
    )
  );
