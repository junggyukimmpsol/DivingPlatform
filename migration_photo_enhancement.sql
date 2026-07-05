ALTER TABLE users ADD COLUMN marketing_opt_in_at TEXT;
ALTER TABLE users ADD COLUMN marketing_opt_in_source TEXT;

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
