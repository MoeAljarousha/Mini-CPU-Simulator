-- Drop the problematic circular policy
DROP POLICY IF EXISTS "Only admins can view admin_users" ON public.admin_users;

-- Create a policy that allows users to read their own admin record
CREATE POLICY "Users can view their own admin record" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a separate policy for admins to view all admin records
CREATE POLICY "Admins can view all admin records" 
ON public.admin_users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);