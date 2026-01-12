-- =====================================================
-- LINKard Database Schema Migration
-- Safe migration for existing database
-- =====================================================

-- Create schemas if they don't exist
CREATE SCHEMA IF NOT EXISTS user_management;
CREATE SCHEMA IF NOT EXISTS interaction_management;

-- =====================================================
-- User Management Tables
-- =====================================================

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_management.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT,
  display_name TEXT,
  role TEXT,
  category TEXT,
  location TEXT,
  followers_count TEXT,
  start_price TEXT,
  platform TEXT,
  platform_label TEXT,
  platform_color_class TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  bio TEXT,
  available_spaces TEXT[],
  social_link TEXT,
  portfolio_items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add unique constraint on username if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'profiles_username_key' AND constraint_schema = 'user_management') THEN
    ALTER TABLE user_management.profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
  END IF;
EXCEPTION WHEN others THEN
  -- Constraint might already exist, continue
END $$;

-- Add missing columns (safe to run multiple times)
ALTER TABLE user_management.profiles
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS followers_count TEXT,
ADD COLUMN IF NOT EXISTS start_price TEXT,
ADD COLUMN IF NOT EXISTS platform TEXT,
ADD COLUMN IF NOT EXISTS platform_label TEXT,
ADD COLUMN IF NOT EXISTS platform_color_class TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS available_spaces TEXT[],
ADD COLUMN IF NOT EXISTS social_link TEXT,
ADD COLUMN IF NOT EXISTS portfolio_items JSONB,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;

-- Create indexes (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_profiles_username ON user_management.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON user_management.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_platform ON user_management.profiles(platform);
CREATE INDEX IF NOT EXISTS idx_profiles_is_featured ON user_management.profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON user_management.profiles(is_verified);

-- Enable RLS
ALTER TABLE user_management.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_management.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_management.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_management.profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON user_management.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON user_management.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_management.profiles
  FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- Interaction Management Tables
-- =====================================================

-- Create inquiries table if it doesn't exist
CREATE TABLE IF NOT EXISTS interaction_management.inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  brand_name TEXT NOT NULL,
  sender_name TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add foreign key constraints (safe)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'inquiries_creator_id_fkey' AND constraint_schema = 'interaction_management') THEN
    ALTER TABLE interaction_management.inquiries ADD CONSTRAINT inquiries_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES user_management.profiles(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'inquiries_sender_id_fkey' AND constraint_schema = 'interaction_management') THEN
    ALTER TABLE interaction_management.inquiries ADD CONSTRAINT inquiries_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES user_management.profiles(id) ON DELETE CASCADE;
  END IF;
EXCEPTION WHEN others THEN
  -- Constraints might already exist, continue
END $$;

-- Add check constraint (safe)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'inquiries_status_check' AND constraint_schema = 'interaction_management') THEN
    ALTER TABLE interaction_management.inquiries ADD CONSTRAINT inquiries_status_check CHECK (status IN ('unread', 'read', 'responded', 'archived'));
  END IF;
EXCEPTION WHEN others THEN
  -- Constraint might already exist, continue
END $$;

-- Create indexes for inquiries
CREATE INDEX IF NOT EXISTS idx_inquiries_creator_id ON interaction_management.inquiries(creator_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_sender_id ON interaction_management.inquiries(sender_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON interaction_management.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON interaction_management.inquiries(created_at DESC);

-- Enable RLS for inquiries
ALTER TABLE interaction_management.inquiries ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Users can view inquiries they sent or received" ON interaction_management.inquiries;
DROP POLICY IF EXISTS "Users can insert inquiries they send" ON interaction_management.inquiries;
DROP POLICY IF EXISTS "Creators can update inquiries they received" ON interaction_management.inquiries;

CREATE POLICY "Users can view inquiries they sent or received" ON interaction_management.inquiries
  FOR SELECT USING (auth.uid() = creator_id OR auth.uid() = sender_id);

CREATE POLICY "Users can insert inquiries they send" ON interaction_management.inquiries
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Creators can update inquiries they received" ON interaction_management.inquiries
  FOR UPDATE USING (auth.uid() = creator_id);

-- =====================================================
-- Utility Functions
-- =====================================================

-- Create functions
CREATE OR REPLACE FUNCTION user_management.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION interaction_management.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop triggers if exist and recreate
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON user_management.profiles;
DROP TRIGGER IF EXISTS handle_updated_at_inquiries ON interaction_management.inquiries;

CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON user_management.profiles
  FOR EACH ROW EXECUTE PROCEDURE user_management.handle_updated_at();

CREATE TRIGGER handle_updated_at_inquiries
  BEFORE UPDATE ON interaction_management.inquiries
  FOR EACH ROW EXECUTE PROCEDURE interaction_management.handle_updated_at();

-- =====================================================
-- Comments for documentation
-- =====================================================

COMMENT ON SCHEMA user_management IS 'Schema for user profile management';
COMMENT ON SCHEMA interaction_management IS 'Schema for user interactions like inquiries';

COMMENT ON TABLE user_management.profiles IS 'User profiles for influencers and clients';
COMMENT ON TABLE interaction_management.inquiries IS 'Inquiries sent between clients and influencers';