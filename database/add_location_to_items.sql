-- Add location column to items table
-- This allows users to specify where their item is located

ALTER TABLE items 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Create index for location searches (optional, useful for filtering)
CREATE INDEX IF NOT EXISTS idx_items_location ON items(location);

