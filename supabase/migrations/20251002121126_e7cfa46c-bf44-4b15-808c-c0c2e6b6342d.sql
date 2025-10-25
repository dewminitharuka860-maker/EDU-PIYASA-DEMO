-- Fix RLS policy to allow user creation
-- Drop the restrictive policy
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Create new policies that allow self-insertion during signup
CREATE POLICY "Users can insert their own role during signup"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Also update the view policy to allow users to see their roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));