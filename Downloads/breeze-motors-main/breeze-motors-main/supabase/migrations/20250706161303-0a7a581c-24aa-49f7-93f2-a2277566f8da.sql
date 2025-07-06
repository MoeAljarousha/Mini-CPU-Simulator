-- Create car-images storage bucket if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'car-images') THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);
    END IF;
END $$;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Anyone can view car images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload car images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update car images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete car images" ON storage.objects;

-- Create RLS policies for car-images bucket
CREATE POLICY "Anyone can view car images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'car-images');

CREATE POLICY "Admins can upload car images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'car-images' 
  AND (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()))
);

CREATE POLICY "Admins can update car images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'car-images' 
  AND (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()))
);

CREATE POLICY "Admins can delete car images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'car-images' 
  AND (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()))
);