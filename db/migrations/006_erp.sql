-- Phase 2 ERP foundation: notices and student enrolment links

CREATE TABLE IF NOT EXISTS erp_notices (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  body         TEXT,
  audience     TEXT NOT NULL DEFAULT 'all' CHECK (audience IN ('all', 'student', 'faculty')),
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_enrolments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id   UUID REFERENCES programs(id),
  roll_number  TEXT,
  semester     INT DEFAULT 1,
  academic_year TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, program_id)
);

CREATE INDEX IF NOT EXISTS idx_erp_notices_audience ON erp_notices (audience, is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_enrolments_user ON student_enrolments (user_id);

ALTER TABLE erp_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrolments ENABLE ROW LEVEL SECURITY;

-- Published notices readable by anyone authenticated
CREATE POLICY erp_notices_read ON erp_notices FOR SELECT
  USING (is_published = true);

-- Students read own enrolment
CREATE POLICY student_enrolments_own ON student_enrolments FOR SELECT
  USING (auth.uid() = user_id);

-- Seed sample notice
INSERT INTO erp_notices (title, body, audience)
SELECT
  'Welcome to Student Portal',
  'Exam schedules, attendance, and assignments will appear here as the ERP module is rolled out.',
  'student'
WHERE NOT EXISTS (SELECT 1 FROM erp_notices LIMIT 1);
