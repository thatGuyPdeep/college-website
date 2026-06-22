-- Payment webhook idempotency columns + rate limit events

ALTER TABLE payments ADD COLUMN IF NOT EXISTS razorpay_order_id   TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;

UPDATE payments
SET razorpay_order_id = gateway_ref
WHERE razorpay_order_id IS NULL AND gateway_ref IS NOT NULL AND status = 'created';

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_razorpay_order
  ON payments (razorpay_order_id) WHERE razorpay_order_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS rate_limit_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_bucket_time
  ON rate_limit_events (bucket_key, created_at DESC);
