-- 1. Insert Admin User into auth.users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, confirmation_token, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001', 
    'admin@transformer.com', 
    crypt('admin123', gen_salt('bf')), 
    now(), 
    'authenticated', 
    '', 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Master Admin"}', 
    false, 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Regular User into auth.users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, confirmation_token, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000002', 
    'customer@transformer.com', 
    crypt('user123', gen_salt('bf')), 
    now(), 
    'authenticated', 
    '', 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"John Customer"}', 
    false, 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

-- 3. Map to public.profiles
INSERT INTO public.profiles (id, full_name, role)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Master Admin', 'admin'),
    ('00000000-0000-0000-0000-000000000002', 'John Customer', 'user')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;

-- 4. Add an identity for each user (Fixing the provider_id null constraint)
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES 
    (
      gen_random_uuid(), 
      '00000000-0000-0000-0000-000000000001', 
      format('{"sub":"%s","email":"%s"}', '00000000-0000-0000-0000-000000000001', 'admin@transformer.com')::jsonb, 
      'email', 
      'admin@transformer.com', -- provider_id is the email for email provider
      now(), now(), now()
    ),
    (
      gen_random_uuid(), 
      '00000000-0000-0000-0000-000000000002', 
      format('{"sub":"%s","email":"%s"}', '00000000-0000-0000-0000-000000000002', 'customer@transformer.com')::jsonb, 
      'email', 
      'customer@transformer.com', 
      now(), now(), now()
    )
ON CONFLICT DO NOTHING;
