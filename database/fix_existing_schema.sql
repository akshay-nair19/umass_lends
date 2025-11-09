-- Fix Existing Schema - Add Missing Columns and Update Policies
-- Run this if you already have the basic schema set up

-- Step 1: Add location column to items table (if not exists)
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS location TEXT;

CREATE INDEX IF NOT EXISTS idx_items_location ON items(location);

-- Step 2: Add duration and datetime columns to borrow_requests table (if not exists)
ALTER TABLE borrow_requests 
ADD COLUMN IF NOT EXISTS borrow_start_time TIME DEFAULT '00:00:00',
ADD COLUMN IF NOT EXISTS borrow_duration_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS borrow_duration_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS return_deadline_datetime TIMESTAMP,
ADD COLUMN IF NOT EXISTS picked_up_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_borrow_requests_return_deadline ON borrow_requests(return_deadline_datetime);
CREATE INDEX IF NOT EXISTS idx_borrow_requests_picked_up_at ON borrow_requests(picked_up_at);

-- Step 3: Update existing borrow requests with default values
UPDATE borrow_requests 
SET 
  borrow_start_time = COALESCE(borrow_start_time, '00:00:00'),
  borrow_duration_hours = COALESCE(borrow_duration_hours, 0),
  borrow_duration_minutes = COALESCE(borrow_duration_minutes, 0),
  return_deadline_datetime = COALESCE(return_deadline_datetime, (borrow_end_date + INTERVAL '23 hours 59 minutes 59 seconds')::TIMESTAMP)
WHERE borrow_start_time IS NULL 
   OR borrow_duration_hours IS NULL 
   OR borrow_duration_minutes IS NULL 
   OR return_deadline_datetime IS NULL;

-- Step 4: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow all operations on items" ON items;
DROP POLICY IF EXISTS "Allow all operations on borrow_requests" ON borrow_requests;
DROP POLICY IF EXISTS "Allow all operations on messages" ON messages;

-- Step 5: Recreate policies
CREATE POLICY "Allow all operations on items" ON items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on borrow_requests" ON borrow_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on messages" ON messages FOR ALL USING (true) WITH CHECK (true);

-- Step 6: Ensure Realtime is enabled for messages (this will error if already added, which is fine)
DO $$ 
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Table messages is already in supabase_realtime publication';
END $$;

