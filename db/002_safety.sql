-- Run once in pgAdmin Query Tool for EXISTING MISS DOOD databases.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS idempotency_key uuid;
CREATE UNIQUE INDEX IF NOT EXISTS orders_idempotency_idx ON orders(user_id,idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE TABLE IF NOT EXISTS auth_rate_limits (
 bucket text PRIMARY KEY, attempts integer NOT NULL DEFAULT 0,
 window_start timestamptz NOT NULL DEFAULT now(), blocked_until timestamptz
);
CREATE INDEX IF NOT EXISTS auth_rate_limits_window_idx ON auth_rate_limits(window_start);
