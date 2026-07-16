UPDATE photo_coupon_codes
SET max_uses = 5,
    updated_at = CURRENT_TIMESTAMP
WHERE max_uses < 5;

UPDATE photo_coupon_codes
SET used_count = MIN(
      max_uses,
      COALESCE(
        (
          SELECT COUNT(*)
          FROM photo_coupon_submissions
          JOIN photo_coupon_jobs
            ON photo_coupon_jobs.submission_id = photo_coupon_submissions.id
          WHERE photo_coupon_submissions.coupon_code_id = photo_coupon_codes.id
        ),
        used_count
      )
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (
  SELECT coupon_code_id
  FROM photo_coupon_submissions
  WHERE coupon_code_id IS NOT NULL
);
