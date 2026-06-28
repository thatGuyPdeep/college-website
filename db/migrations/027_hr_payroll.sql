-- Faculty HR: salary slips, leave balances, leave requests

CREATE TYPE leave_type AS ENUM ('casual', 'earned', 'medical', 'other');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

CREATE TABLE IF NOT EXISTS hr_leave_balances (
  user_id     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  casual      INT NOT NULL DEFAULT 12,
  earned      INT NOT NULL DEFAULT 30,
  medical     INT NOT NULL DEFAULT 15,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hr_salary_slips (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month       INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year        INT NOT NULL CHECK (year >= 2020),
  gross_pay   NUMERIC(12,2) NOT NULL DEFAULT 0,
  deductions  NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_pay     NUMERIC(12,2) NOT NULL DEFAULT 0,
  file_path   TEXT,
  status      TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, month, year)
);

CREATE TABLE IF NOT EXISTS hr_leave_requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  leave_type  leave_type NOT NULL,
  from_date   DATE NOT NULL,
  to_date     DATE NOT NULL,
  days        NUMERIC(4,1) NOT NULL,
  reason      TEXT,
  status      leave_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (to_date >= from_date)
);

CREATE INDEX IF NOT EXISTS idx_hr_salary_user ON hr_salary_slips (user_id, year DESC, month DESC);
CREATE INDEX IF NOT EXISTS idx_hr_leave_user ON hr_leave_requests (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hr_leave_status ON hr_leave_requests (status) WHERE status = 'pending';

ALTER TABLE hr_leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_salary_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_leave_requests ENABLE ROW LEVEL SECURITY;

-- Staff read own records
CREATE POLICY hr_balance_own ON hr_leave_balances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY hr_salary_own ON hr_salary_slips FOR SELECT
  USING (auth.uid() = user_id AND status = 'published');

CREATE POLICY hr_leave_own_read ON hr_leave_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY hr_leave_own_insert ON hr_leave_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- HR / admin manage all
CREATE POLICY hr_balance_staff ON hr_leave_balances FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid())
    IN ('hr_staff', 'accounts_staff', 'admin', 'super_admin')
  );

CREATE POLICY hr_salary_staff ON hr_salary_slips FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid())
    IN ('hr_staff', 'accounts_staff', 'admin', 'super_admin')
  );

CREATE POLICY hr_leave_staff ON hr_leave_requests FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid())
    IN ('hr_staff', 'admin', 'super_admin')
  );
