# Fix: Missing 'location' Column Error

## Error Message
```
Could not find the 'location' column of 'items' in the schema cache
```

## Problem
Your database is missing the `location` column in the `items` table. This column was added to allow users to specify where their item is located (e.g., dorm, building, area on campus).

## Solution: Run the Migration Script

You need to run the migration script in your Supabase SQL Editor to add the missing column.

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Run the Migration Script
Copy and paste the following SQL into the SQL Editor:

```sql
-- Add location column to items table
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Create index on location for faster queries
CREATE INDEX IF NOT EXISTS idx_items_location ON items(location);
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
WHERE table_name = 'items' 
AND column_name = 'location';
```

You should see a row with:
- `column_name`: `location`
- `data_type`: `text`
- `is_nullable`: `YES`

## Alternative: Run Complete Migration
If you're missing other columns too (like `picked_up_at`), you can run the complete migration script:

**File:** `database/fix_existing_schema.sql`

This will add:
- `location` column to `items` table
- `picked_up_at` column to `borrow_requests` table
- Duration columns to `borrow_requests` table
- All necessary indexes

## After Running the Migration
1. The error should be resolved
2. You should be able to create items with or without a location
3. The location field is optional, so existing items will work fine

## Quick Fix Script
If you just need the location column, use this:

```sql
ALTER TABLE items ADD COLUMN IF NOT EXISTS location TEXT;
CREATE INDEX IF NOT EXISTS idx_items_location ON items(location);
```

