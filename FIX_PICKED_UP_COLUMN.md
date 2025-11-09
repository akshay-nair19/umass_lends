# Fix: Missing 'picked_up_at' Column Error

## Error Message
```
Could not find the 'picked_up_at' column of 'borrow_requests' in the schema cache
```

## Problem
Your database is missing the `picked_up_at` column in the `borrow_requests` table. This column was added for the "Picked Up" feature, which allows lenders to mark when an item has been physically picked up by the borrower.

## Solution: Run the Migration Script

You need to run the migration script in your Supabase SQL Editor to add the missing column.

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Run the Migration Script
Copy and paste the following SQL into the SQL Editor:

```sql
-- Add picked_up_at column to borrow_requests table
ALTER TABLE borrow_requests 
ADD COLUMN IF NOT EXISTS picked_up_at TIMESTAMP;

-- Create index on picked_up_at for faster queries
CREATE INDEX IF NOT EXISTS idx_borrow_requests_picked_up_at ON borrow_requests(picked_up_at);
```

### Step 3: Execute the Script
1. Click the "Run" button (or press Ctrl+Enter / Cmd+Enter)
2. Wait for the script to complete
3. You should see a success message

### Step 4: Verify the Column Was Added
Run this query to verify:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'borrow_requests' 
AND column_name = 'picked_up_at';
```

You should see a row with:
- `column_name`: `picked_up_at`
- `data_type`: `timestamp without time zone`
- `is_nullable`: `YES`

## Complete Migration Script
If you're missing multiple columns, you can run the complete migration script that adds all missing columns at once:

**File:** `database/fix_existing_schema.sql`

Or run this complete script:

```sql
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
```

## After Running the Migration
1. The error should be resolved
2. The "Picked Up" feature will work correctly
3. Lenders will be able to mark items as picked up
4. The countdown timer will start from the pickup time

## Quick Fix Script
If you just need the `picked_up_at` column, use this:

```sql
ALTER TABLE borrow_requests ADD COLUMN IF NOT EXISTS picked_up_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_borrow_requests_picked_up_at ON borrow_requests(picked_up_at);
```

