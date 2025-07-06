-- Create car-images storage bucket if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'car-images') THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);
    END IF;
END $$;

-- Create RLS policies for car-images bucket
CREATE POLICY IF NOT EXISTS "Anyone can view car images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'car-images');

CREATE POLICY IF NOT EXISTS "Admins can upload car images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'car-images' 
  AND (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()))
);

CREATE POLICY IF NOT EXISTS "Admins can update car images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'car-images' 
  AND (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()))
);

CREATE POLICY IF NOT EXISTS "Admins can delete car images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'car-images' 
  AND (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()))
);