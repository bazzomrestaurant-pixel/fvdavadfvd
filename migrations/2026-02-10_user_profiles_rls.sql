-- Migration: Create/adjust user_profiles and enable RLS
-- Ensures user_profiles references public.users and sets up Row Level Security policies

BEGIN;

-- 1) helper: update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2) helper: is_admin() to check if current actor is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  );
$$;

-- 3) Create/ensure table structure
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'cashier',
  name TEXT NULL,
  phone TEXT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT user_profiles_role_check CHECK ( role = ANY (ARRAY['admin','chief','cashier']) )
);

-- Ensure index on email for fast lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- 4) Ensure FK references public.users (app-level mirror of auth.users)
-- (If public.users doesn't exist, earlier migration should create it.)
ALTER TABLE public.user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_id_fkey
  FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 5) Trigger to update updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 6) Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 7) Policies
-- Admins: full access
CREATE POLICY IF NOT EXISTS "Admins full access" ON public.user_profiles
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Users: read and update their own profile
CREATE POLICY IF NOT EXISTS "Users can select own profile" ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = NEW.id);

CREATE POLICY IF NOT EXISTS "Users can update own profile" ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = NEW.id);

-- Do not allow regular users to delete profiles via RLS (admins/service role only)
-- Optionally, admins can delete via the "Admins full access" policy above.

COMMIT;
