-- Add columns to store exact return datetime and duration components
-- This allows precise countdown timers without rounding to end of day

ALTER TABLE borrow_requests 
ADD COLUMN IF NOT EXISTS borrow_start_time TIME DEFAULT '00:00:00',
ADD COLUMN IF NOT EXISTS borrow_duration_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS borrow_duration_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS return_deadline_datetime TIMESTAMP;

-- Create index on return_deadline_datetime for faster queries
CREATE INDEX IF NOT EXISTS idx_borrow_requests_return_deadline ON borrow_requests(return_deadline_datetime);

-- Update existing rows to have default values
UPDATE borrow_requests 
SET 
  borrow_start_time = '00:00:00',
  borrow_duration_hours = 0,
  borrow_duration_minutes = 0,
  return_deadline_datetime = (borrow_end_date + INTERVAL '23 hours 59 minutes 59 seconds')::TIMESTAMP
WHERE return_deadline_datetime IS NULL;

