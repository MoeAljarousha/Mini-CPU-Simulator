-- Add index for faster ordering
CREATE INDEX IF NOT EXISTS idx_cars_created_at ON cars(created_at DESC);

-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Car images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'car-images');

CREATE POLICY "Admins can upload car images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'car-images' AND (EXISTS (
  SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
)));