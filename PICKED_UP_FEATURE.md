# Picked Up Feature

## Overview
The "Picked Up" feature allows lenders to mark when an item has been physically picked up by the borrower. The countdown timer now starts from the actual pickup time, not when the request was approved.

## Workflow
1. **Borrower submits request** - Requests an item with a duration (hours, minutes)
2. **Lender approves** - Lender approves the request (item becomes unavailable)
3. **Lender marks "Picked Up"** - When the borrower physically collects the item, the lender clicks "Picked Up"
4. **Countdown starts** - The countdown timer starts from the pickup time and counts down until the return deadline (pickup time + duration)

## Database Changes

### New Column
- `picked_up_at TIMESTAMP` - Stores when the item was actually picked up

### Migration
Run the migration script in your Supabase SQL Editor:

```sql
-- Add picked_up_at column
ALTER TABLE borrow_requests 
ADD COLUMN IF NOT EXISTS picked_up_at TIMESTAMP;

-- Create index
CREATE INDEX IF NOT EXISTS idx_borrow_requests_picked_up_at ON borrow_requests(picked_up_at);
```

Or use the complete migration script: `database/add_picked_up_at.sql`

## API Changes

### New Endpoint
- `POST /api/borrow/:id/mark-picked-up` - Mark an item as picked up (lender only)
  - Calculates `return_deadline_datetime` from `picked_up_at + duration`
  - Updates the borrow request with both `picked_up_at` and `return_deadline_datetime`

### Updated Endpoint
- `POST /api/items/:id/borrow` - No longer calculates `return_deadline_datetime` immediately
  - Only stores duration components (`borrow_duration_hours`, `borrow_duration_minutes`)
  - Return deadline is calculated when the item is marked as picked up

## Frontend Changes

### BorrowRequests Page
- **For Lenders (Owners)**:
  - Shows "Picked Up" button when request is approved but not yet picked up
  - Shows "⏳ Item not picked up yet" message before pickup
  - Shows "✅ Picked up: [timestamp]" after pickup
  - Countdown timer only appears after item is picked up

- **For Borrowers**:
  - Shows "⏳ Waiting for item to be picked up" message when approved but not picked up
  - Shows "✅ Picked up: [timestamp]" after pickup
  - Countdown timer only appears after item is picked up

### MyItems Page
- Countdown timer only shows if item was picked up

## Usage

### For Lenders
1. Approve a borrow request
2. When the borrower comes to collect the item, click the "Picked Up" button
3. The countdown timer will start from that moment
4. The return deadline is automatically calculated as: `picked_up_at + duration`

### For Borrowers
1. Submit a borrow request
2. Wait for lender approval
3. Collect the item from the lender
4. Wait for lender to mark it as "Picked Up"
5. Once marked, the countdown timer will appear showing time until return deadline

## Benefits
- **Accurate timing**: Countdown starts from actual pickup time, not requested time
- **Flexibility**: Lenders can approve requests ahead of time without starting the timer
- **Better tracking**: Clear visibility of when items were actually picked up
- **Fair duration**: Borrowers get the full requested duration from pickup time

## Technical Details

### Return Deadline Calculation
The return deadline is calculated as:
```
return_deadline = picked_up_at + borrow_duration_hours + borrow_duration_minutes
```

### Countdown Timer
- Only displays when `picked_up_at` is set
- Shows time remaining until `return_deadline_datetime`
- Updates in real-time (every second)

### Date Utility Function
The `calculateExactReturnDeadline()` function now prioritizes:
1. `return_deadline_datetime` (if `picked_up_at` exists)
2. Calculated from `picked_up_at + duration` (if `picked_up_at` exists but no deadline)
3. Calculated from `borrow_start_date + duration` (fallback for old requests)
4. `borrow_end_date + end of day` (fallback for very old requests)

