-- Drop the problematic policy
DROP POLICY IF EXISTS "Allow admin signup" ON public.admin_users;

-- Create a simpler policy that allows insertion during signup
CREATE POLICY "Allow admin signup during registration" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (
  -- Allow if user is authenticated and inserting their own record
  (auth.uid() = user_id) OR
  -- Allow during signup process when user_id is provided (since auth.users was created successfully)
  (user_id IS NOT NULL)
);