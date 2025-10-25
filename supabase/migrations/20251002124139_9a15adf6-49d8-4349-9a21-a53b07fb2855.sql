-- Fix PUBLIC_USER_DATA security issue
-- Restrict profile visibility so users can only see their own profile
-- But allow admins and teachers to view all profiles for management purposes

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create new restricted policy: users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Allow admins and teachers to view all profiles for student management
CREATE POLICY "Admins and teachers can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));