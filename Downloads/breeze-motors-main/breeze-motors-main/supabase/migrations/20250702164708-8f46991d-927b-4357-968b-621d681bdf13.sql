-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Allow users to insert their own admin record during signup" ON public.admin_users;

-- Create a new policy that allows signup even without full authentication
CREATE POLICY "Allow admin signup" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (
  -- Allow if user is authenticated and inserting their own record
  (auth.uid() = user_id) OR
  -- Allow if this is during signup process (user_id exists in auth.users but not yet fully authenticated)
  (user_id IS NOT NULL AND EXISTS (SELECT 1 FROM auth.users WHERE id = user_id))
);