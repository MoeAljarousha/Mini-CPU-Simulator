-- Add INSERT policy for admin_users to allow signup
CREATE POLICY "Allow users to insert their own admin record during signup" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);