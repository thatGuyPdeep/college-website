-- ERP modules: attendance, marks, timetable, assignments

CREATE TABLE IF NOT EXISTS attendance_records (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  course_name TEXT,
  date        DATE NOT NULL,
  status      TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_code, date)
);

CREATE TABLE IF NOT EXISTS student_marks (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject        TEXT NOT NULL,
  exam_type      TEXT,
  marks_obtained NUMERIC(6,2),
  max_marks      NUMERIC(6,2),
  semester       INT,
  academic_year  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS timetable_slots (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id   UUID REFERENCES programs(id) ON DELETE SET NULL,
  day_of_week  INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  subject      TEXT NOT NULL,
  room         TEXT,
  faculty_name TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id  UUID REFERENCES programs(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  description TEXT,
  due_at      TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path     TEXT,
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  grade         TEXT,
  UNIQUE (assignment_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_attendance_user ON attendance_records (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_marks_user ON student_marks (user_id, academic_year DESC);
CREATE INDEX IF NOT EXISTS idx_timetable_program ON timetable_slots (program_id, day_of_week);

ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY attendance_own ON attendance_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY marks_own ON student_marks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY timetable_read ON timetable_slots FOR SELECT USING (true);
CREATE POLICY assignments_read ON assignments FOR SELECT USING (true);
CREATE POLICY submissions_own ON assignment_submissions FOR SELECT USING (auth.uid() = user_id);
