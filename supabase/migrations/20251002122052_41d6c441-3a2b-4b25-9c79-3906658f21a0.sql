-- Update admin user profile role
UPDATE public.profiles 
SET role = 'admin'
WHERE id IN (
  SELECT ur.user_id 
  FROM public.user_roles ur 
  WHERE ur.role = 'admin'
);