-- Migration: Fix user_profiles FK to reference public.users
-- Creates a minimal public.users table if missing and re-attaches the FK.

BEGIN;

-- Create minimal users table (app-level mirror of auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Drop existing FK constraint if present
ALTER TABLE IF EXISTS public.user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- Add FK constraint referencing public.users
ALTER TABLE IF EXISTS public.user_profiles
  ADD CONSTRAINT user_profiles_id_fkey
  FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;

COMMIT;
