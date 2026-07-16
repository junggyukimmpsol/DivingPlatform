CREATE TABLE IF NOT EXISTS photo_coupon_codes (
  id TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL UNIQUE,
  label TEXT,
  max_uses INTEGER NOT NULL DEFAULT 1,
  used_count INTEGER NOT NULL DEFAULT 0,
  used_at TEXT,
  used_by_email TEXT,
  used_by_phone TEXT,
  submission_id TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE photo_coupon_submissions ADD COLUMN coupon_code_id TEXT;

CREATE INDEX IF NOT EXISTS idx_photo_coupon_codes_hash ON photo_coupon_codes(code_hash);
CREATE INDEX IF NOT EXISTS idx_photo_coupon_codes_used ON photo_coupon_codes(used_count, expires_at);
