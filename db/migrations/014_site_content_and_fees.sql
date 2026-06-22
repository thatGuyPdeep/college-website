-- Leadership CMS, publication links CMS, student fee records (Phase 2 ERP)

CREATE TABLE IF NOT EXISTS leadership_entries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  image_url    TEXT,
  sort_order   INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS publication_links (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section      TEXT NOT NULL CHECK (section IN ('english', 'indian_language', 'highlight')),
  label        TEXT NOT NULL,
  href         TEXT NOT NULL,
  sort_order   INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_fee_records (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fee_type       TEXT NOT NULL DEFAULT 'tuition',
  description    TEXT,
  amount         NUMERIC(10,2) NOT NULL,
  amount_paid    NUMERIC(10,2) NOT NULL DEFAULT 0,
  due_date       DATE,
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'waived')),
  academic_year  TEXT DEFAULT '2026-27',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leadership_sort ON leadership_entries (is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_publication_section ON publication_links (section, is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_fee_records_user ON student_fee_records (user_id, academic_year);

ALTER TABLE leadership_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fee_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS leadership_public_read ON leadership_entries;
CREATE POLICY leadership_public_read ON leadership_entries
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS leadership_editor_write ON leadership_entries;
CREATE POLICY leadership_editor_write ON leadership_entries
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = (SELECT auth.uid()))
    IN ('content_editor', 'admin', 'super_admin')
  );

DROP POLICY IF EXISTS publication_public_read ON publication_links;
CREATE POLICY publication_public_read ON publication_links
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS publication_editor_write ON publication_links;
CREATE POLICY publication_editor_write ON publication_links
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = (SELECT auth.uid()))
    IN ('content_editor', 'admin', 'super_admin')
  );

DROP POLICY IF EXISTS fee_records_own ON student_fee_records;
CREATE POLICY fee_records_own ON student_fee_records
  FOR SELECT USING (auth.uid() = user_id);
