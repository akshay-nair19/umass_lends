-- Add picked_up_at column to borrow_requests table
-- This tracks when the item was actually picked up, which starts the countdown timer

ALTER TABLE borrow_requests 
ADD COLUMN IF NOT EXISTS picked_up_at TIMESTAMP;

-- Create index on picked_up_at for faster queries
CREATE INDEX IF NOT EXISTS idx_borrow_requests_picked_up_at ON borrow_requests(picked_up_at);

