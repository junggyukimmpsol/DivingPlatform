CREATE TABLE IF NOT EXISTS photo_coupon_submissions (
  id TEXT PRIMARY KEY,
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
