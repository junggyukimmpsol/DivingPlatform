CREATE TABLE IF NOT EXISTS paid_orders (
  id TEXT PRIMARY KEY,
  payment_id TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL DEFAULT 'portone_nhn_kcp',
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount_krw INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  certification_agency TEXT,
  certification_level TEXT,
  has_certification_image INTEGER NOT NULL DEFAULT 0,
  height_cm TEXT,
  weight_kg TEXT,
  foot_size_mm TEXT,
  preferred_suit_size TEXT,
  memo TEXT,
  user_id TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS paid_order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  location_id TEXT,
  location_name TEXT NOT NULL,
  program TEXT NOT NULL,
  tour_date TEXT NOT NULL,
  guests INTEGER NOT NULL,
  unit_price_krw INTEGER NOT NULL,
  line_total_krw INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES paid_orders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_paid_orders_payment ON paid_orders(payment_id);
CREATE INDEX IF NOT EXISTS idx_paid_orders_status_created ON paid_orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_paid_order_items_order ON paid_order_items(order_id);
