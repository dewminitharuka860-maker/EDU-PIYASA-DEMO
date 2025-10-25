-- Function to promote a user to admin role by email
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = user_email;
  
  IF user_uuid IS NULL THEN
    RETURN 'User not found with email: ' || user_email;
  END IF;
  
  -- Update profile role to admin
  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = user_uuid;
  
  -- Add admin role to user_roles if not exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_uuid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN 'User ' || user_email || ' promoted to admin successfully!';
END;
$$;