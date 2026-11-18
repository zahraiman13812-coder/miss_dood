-- MISS DOOD standalone PostgreSQL 15+ schema (not Supabase).
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS users (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text NOT NULL UNIQUE,
 password_hash text NOT NULL, full_name text NOT NULL DEFAULT '',
 role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','admin')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash text PRIMARY KEY, user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS products (
 slug text PRIMARY KEY CHECK(slug ~ '^[a-z0-9][a-z0-9-]{0,119}$'),
 category text NOT NULL, brand text NOT NULL DEFAULT '', name text NOT NULL,
 description text NOT NULL DEFAULT '', image text NOT NULL DEFAULT '',
 price_toman bigint CHECK(price_toman IS NULL OR price_toman >= 0),
 stock integer NOT NULL DEFAULT 0 CHECK(stock >= 0),
 specs jsonb NOT NULL DEFAULT '[]' CHECK(jsonb_typeof(specs)='array'),
 active boolean NOT NULL DEFAULT true, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS shipping_rules (
 city text PRIMARY KEY, fee bigint NOT NULL CHECK(fee >= 0),
 days text NOT NULL, active boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS orders (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id),
 status text NOT NULL DEFAULT 'received' CHECK(status IN ('received','processing','shipped','delivered','cancelled')),
 recipient_name text NOT NULL, recipient_phone text NOT NULL,
 shipping_address text NOT NULL, shipping_city text NOT NULL,
 subtotal bigint NOT NULL CHECK(subtotal >= 0), shipping_fee bigint NOT NULL CHECK(shipping_fee >= 0),
 total bigint NOT NULL CHECK(total = subtotal + shipping_fee), note text,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_user_idx ON orders(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status,created_at DESC);
CREATE TABLE IF NOT EXISTS order_items (
 id bigserial PRIMARY KEY, order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
 product_slug text NOT NULL, product_name text NOT NULL,
 unit_price bigint NOT NULL CHECK(unit_price >= 0), quantity integer NOT NULL CHECK(quantity > 0),
 amount bigint NOT NULL CHECK(amount = unit_price*quantity)
);
CREATE TABLE IF NOT EXISTS favorites (
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 product_slug text NOT NULL REFERENCES products(slug) ON DELETE CASCADE,
 PRIMARY KEY(user_id,product_slug)
);
CREATE TABLE IF NOT EXISTS support_tickets (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id),
 subject text NOT NULL, status text NOT NULL DEFAULT 'open' CHECK(status IN ('open','answered','closed')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS support_messages (
 id bigserial PRIMARY KEY, ticket_id uuid NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
 sender_id uuid NOT NULL REFERENCES users(id), body text NOT NULL CHECK(char_length(body) BETWEEN 1 AND 5000),
 created_at timestamptz NOT NULL DEFAULT now()
);

-- Prevent duplicate checkout submissions (one client-generated key per user/order).
ALTER TABLE orders ADD COLUMN IF NOT EXISTS idempotency_key uuid;
CREATE UNIQUE INDEX IF NOT EXISTS orders_idempotency_idx ON orders(user_id,idempotency_key) WHERE idempotency_key IS NOT NULL;
-- Per-identifier rate limiting; avoid storing raw email/IP in this table.
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  bucket text PRIMARY KEY, attempts integer NOT NULL DEFAULT 0,
  window_start timestamptz NOT NULL DEFAULT now(), blocked_until timestamptz
);
CREATE INDEX IF NOT EXISTS auth_rate_limits_window_idx ON auth_rate_limits(window_start);
