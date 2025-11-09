# Database Setup Instructions

## If You Already Have Tables (Most Common Case)

If you're getting errors like "policy already exists" or "column already exists", you likely already have the basic schema set up. Use this script instead:

### Run: `database/fix_existing_schema.sql`

This script will:
- ✅ Add missing columns (location, duration fields) safely
- ✅ Drop and recreate policies to avoid conflicts
- ✅ Update existing data with default values
- ✅ Handle Realtime setup gracefully

**Steps:**
1. Open Supabase SQL Editor
2. Copy and paste the contents of `database/fix_existing_schema.sql`
3. Click "Run"
4. Done!

---

## If Starting Fresh (New Database)

If you're setting up a completely new database, use:

### Run: `database/schema_complete.sql`

This is the complete schema with all columns and features included.

**Steps:**
1. Open Supabase SQL Editor
2. Copy and paste the contents of `database/schema_complete.sql`
3. Click "Run"
4. Done!

---

## What's Included

### Tables:
- ✅ `users` - User accounts
- ✅ `items` - Items available for borrowing (includes `location` column)
- ✅ `borrow_requests` - Borrow requests (includes duration and datetime columns)
- ✅ `messages` - Messages between users

### Features:
- ✅ Location field for items
- ✅ Duration-based borrow requests (hours, minutes)
- ✅ Exact return deadline datetime
- ✅ Countdown timer support
- ✅ Real-time messaging
- ✅ Row Level Security (RLS) enabled
- ✅ All necessary indexes

### Policies:
- ✅ Currently allows all operations (will be restricted when auth is fully configured)

---

## Troubleshooting

### Error: "policy already exists"
**Solution:** Run `database/fix_existing_schema.sql` instead, which drops existing policies first.

### Error: "column already exists"
**Solution:** The `IF NOT EXISTS` clause should handle this, but if you still get errors, the column already exists and you can ignore the error.

### Error: "table already exists"
**Solution:** This is fine! The script uses `CREATE TABLE IF NOT EXISTS`, so it won't recreate existing tables.

### Error: "relation does not exist"
**Solution:** Make sure you've run the basic schema first. Start with `database/schema_complete.sql` if you're unsure.

---

## Verification

After running the script, verify everything is set up correctly:

```sql
-- Check if all columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'items' 
  AND column_name IN ('location');

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'borrow_requests' 
  AND column_name IN ('borrow_start_time', 'borrow_duration_hours', 'borrow_duration_minutes', 'return_deadline_datetime');

-- Check if policies exist
SELECT * FROM pg_policies WHERE tablename IN ('items', 'borrow_requests', 'messages');
```

You should see all the columns and policies listed.

