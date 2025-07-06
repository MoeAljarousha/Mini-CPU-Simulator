-- Emergency cleanup of base64 images causing database timeouts
-- This will replace all base64 image data with placeholder URLs

UPDATE cars 
SET images = ARRAY['https://via.placeholder.com/400x300?text=Car+Image+Loading']::text[]
WHERE array_length(images, 1) > 0 
AND images[1] LIKE 'data:image%';

-- Add index to improve query performance
CREATE INDEX IF NOT EXISTS idx_cars_created_at ON cars(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cars_make_model ON cars(make, model);

-- Update all records to ensure consistent data
UPDATE cars SET updated_at = NOW() WHERE updated_at IS NULL;