CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  email_verified_at TEXT,
  email_verification_token_hash TEXT,
  email_verification_expires_at TEXT,
  marketing_opt_in_at TEXT,
  marketing_opt_in_source TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS diver_profiles (
  user_id TEXT PRIMARY KEY,
  phone TEXT,
  certification_agency TEXT,
  certification_level TEXT,
  certification_image_key TEXT,
  height_cm REAL,
  weight_kg REAL,
  foot_size_mm REAL,
  preferred_suit_size TEXT,
  memo TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS photo_credit_wallets (
  user_id TEXT PRIMARY KEY,
  total_credits INTEGER NOT NULL DEFAULT 5,
  used_credits INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS photo_enhancement_jobs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  original_image_key TEXT NOT NULL,
  original_file_name TEXT NOT NULL,
  original_mime_type TEXT NOT NULL,
  original_size_bytes INTEGER NOT NULL,
  enhanced_image_key TEXT,
  enhanced_mime_type TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_photo_jobs_user_created ON photo_enhancement_jobs(user_id, created_at);

CREATE TABLE IF NOT EXISTS photo_coupon_submissions (
  id TEXT PRIMARY KEY,
  coupon_code_id TEXT,
  reservation_number TEXT,
  buyer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  marketing_opt_in_at TEXT NOT NULL,
  marketing_opt_in_source TEXT NOT NULL DEFAULT 'naver_photo_coupon',
  status TEXT NOT NULL DEFAULT 'queued',
  result_email_sent_at TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (coupon_code_id) REFERENCES photo_coupon_codes(id)
);

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

CREATE TABLE IF NOT EXISTS photo_coupon_jobs (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  original_image_key TEXT NOT NULL,
  original_file_name TEXT NOT NULL,
  original_mime_type TEXT NOT NULL,
  original_size_bytes INTEGER NOT NULL,
  enhanced_image_key TEXT,
  enhanced_mime_type TEXT,
  download_token TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  FOREIGN KEY (submission_id) REFERENCES photo_coupon_submissions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_photo_coupon_email_created ON photo_coupon_submissions(email, created_at);
CREATE INDEX IF NOT EXISTS idx_photo_coupon_jobs_submission ON photo_coupon_jobs(submission_id, created_at);
CREATE INDEX IF NOT EXISTS idx_photo_coupon_codes_hash ON photo_coupon_codes(code_hash);
CREATE INDEX IF NOT EXISTS idx_photo_coupon_codes_used ON photo_coupon_codes(used_count, expires_at);
