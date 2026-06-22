-- Gallery CMS: photos and videos managed from admin/content

CREATE TABLE IF NOT EXISTS gallery_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type    TEXT NOT NULL CHECK (item_type IN ('photo', 'video')),
  title        TEXT NOT NULL,
  media_ref    TEXT NOT NULL,
  year         TEXT,
  sort_order   INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_published ON gallery_items (is_published, sort_order);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS gallery_public_read ON gallery_items;
CREATE POLICY gallery_public_read ON gallery_items
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS gallery_editor_write ON gallery_items;
CREATE POLICY gallery_editor_write ON gallery_items
  FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = (SELECT auth.uid()))
    IN ('content_editor', 'admin', 'super_admin')
  );
