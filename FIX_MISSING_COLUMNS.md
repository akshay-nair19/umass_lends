# Fix: Missing Database Columns Error

## Error Message
```
Could not find the 'borrow_duration_hours' column of 'borrow_requests' in the schema cache
```

## Problem
Your database is missing the new columns that were added for the duration-based borrow requests feature. These columns allow users to specify exact borrowing durations (hours, minutes) instead of just dates.

## Solution: Run the Migration Script

You need to run the migration script in your Supabase SQL Editor to add the missing columns.

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Run the Migration Script
Copy and paste the following SQL into the SQL Editor:

```sql
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
```

### Step 3: Execute the Script
1. Click the "Run" button (or press Ctrl+Enter)
2. Wait for the script to complete
3. You should see a success message

### Step 4: Verify the Columns Were Added
Run this query to verify:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'borrow_requests' 
  AND column_name IN ('borrow_start_time', 'borrow_duration_hours', 'borrow_duration_minutes', 'return_deadline_datetime');
```

You should see all 4 columns listed.

### Step 5: Test Again
1. Restart your backend server (if it's running)
2. Try submitting a borrow request again
3. The error should be gone!

## Alternative: Run the Migration File Directly

The migration script is also available in:
- File: `database/add_exact_datetime.sql`

You can copy the contents of this file and run it in Supabase SQL Editor.

## What These Columns Do

- **borrow_start_time**: The time of day when borrowing starts (e.g., "14:30:00")
- **borrow_duration_hours**: Number of hours to borrow (0-23)
- **borrow_duration_minutes**: Number of minutes to borrow (0-59)
- **return_deadline_datetime**: The exact datetime when the item must be returned (used for countdown timer)

## Notes

- The migration uses `IF NOT EXISTS`, so it's safe to run multiple times
- Existing borrow requests will be updated with default values
- The migration won't break any existing functionality

