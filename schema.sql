-- Professional Database Schema Design for LINKard Project
-- Following database engineering best practices for security, performance, and maintainability

-- Create separate schemas for logical separation
CREATE SCHEMA IF NOT EXISTS user_management;
CREATE SCHEMA IF NOT EXISTS content_management;
CREATE SCHEMA IF NOT EXISTS interaction_management;
CREATE SCHEMA IF NOT EXISTS analytics_management;
CREATE SCHEMA IF NOT EXISTS system_management;

-- Grant usage to authenticated users
GRANT USAGE ON SCHEMA user_management TO authenticated;
GRANT USAGE ON SCHEMA content_management TO authenticated;
GRANT USAGE ON SCHEMA interaction_management TO authenticated;
GRANT USAGE ON SCHEMA analytics_management TO authenticated;
GRANT USAGE ON SCHEMA system_management TO authenticated;

-- ===========================================
-- USER MANAGEMENT SCHEMA
-- ===========================================

-- Profiles table (moved from public)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        ALTER TABLE public.profiles SET SCHEMA user_management;
    END IF;
END $$;

-- Ensure profiles table has all necessary columns
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS booking_url TEXT;
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS pricing JSONB DEFAULT '{}';
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS analytics JSONB DEFAULT '{}';
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0;
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE user_management.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add constraints and indexes (with existence checks)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_username_unique') THEN
        ALTER TABLE user_management.profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_check') THEN
        ALTER TABLE user_management.profiles ADD CONSTRAINT profiles_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_username ON user_management.profiles (username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON user_management.profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON user_management.profiles (email);

-- ===========================================
-- CONTENT MANAGEMENT SCHEMA
-- ===========================================

-- Portfolio items table
CREATE TABLE IF NOT EXISTS content_management.portfolio_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('video', 'image')),
    thumbnail TEXT,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_items_profile_id ON content_management.portfolio_items (profile_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_type ON content_management.portfolio_items (type);

-- ===========================================
-- INTERACTION MANAGEMENT SCHEMA
-- ===========================================

-- Inquiries table (moved from public)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'inquiries') THEN
        ALTER TABLE public.inquiries SET SCHEMA interaction_management;
    END IF;
END $$;

-- Ensure inquiries table has all columns
ALTER TABLE interaction_management.inquiries ADD COLUMN IF NOT EXISTS sender_name TEXT;
ALTER TABLE interaction_management.inquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add constraints (with existence checks)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inquiries_status_check') THEN
        ALTER TABLE interaction_management.inquiries ADD CONSTRAINT inquiries_status_check CHECK (status IN ('unread', 'read', 'responded'));
    END IF;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_inquiries_creator_id ON interaction_management.inquiries (creator_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_sender_id ON interaction_management.inquiries (sender_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON interaction_management.inquiries (status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON interaction_management.inquiries (created_at DESC);

-- ===========================================
-- ANALYTICS MANAGEMENT SCHEMA
-- ===========================================

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_management.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_profile_id ON analytics_management.analytics_events (profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_management.analytics_events (event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_management.analytics_events (created_at DESC);

-- ===========================================
-- SYSTEM MANAGEMENT SCHEMA
-- ===========================================

-- System settings table
CREATE TABLE IF NOT EXISTS system_management.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

-- Profiles RLS
ALTER TABLE user_management.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view all profiles" ON user_management.profiles;
CREATE POLICY "Users can view all profiles" ON user_management.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON user_management.profiles;
CREATE POLICY "Users can update own profile" ON user_management.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_management.profiles;
CREATE POLICY "Users can insert own profile" ON user_management.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Portfolio items RLS
ALTER TABLE content_management.portfolio_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view portfolio items" ON content_management.portfolio_items;
CREATE POLICY "Users can view portfolio items" ON content_management.portfolio_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own portfolio items" ON content_management.portfolio_items;
CREATE POLICY "Users can manage own portfolio items" ON content_management.portfolio_items FOR ALL USING (auth.uid() = profile_id);

-- Inquiries RLS
ALTER TABLE interaction_management.inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Creators can view received inquiries" ON interaction_management.inquiries;
CREATE POLICY "Creators can view received inquiries" ON interaction_management.inquiries FOR SELECT USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Senders can view sent inquiries" ON interaction_management.inquiries;
CREATE POLICY "Senders can view sent inquiries" ON interaction_management.inquiries FOR SELECT USING (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can create inquiries" ON interaction_management.inquiries;
CREATE POLICY "Users can create inquiries" ON interaction_management.inquiries FOR INSERT WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Creators can update inquiries" ON interaction_management.inquiries;
CREATE POLICY "Creators can update inquiries" ON interaction_management.inquiries FOR UPDATE USING (auth.uid() = creator_id);

-- Analytics RLS
ALTER TABLE analytics_management.analytics_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own analytics" ON analytics_management.analytics_events;
CREATE POLICY "Users can view own analytics" ON analytics_management.analytics_events FOR SELECT USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can insert own analytics" ON analytics_management.analytics_events;
CREATE POLICY "Users can insert own analytics" ON analytics_management.analytics_events FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- ===========================================
-- TRIGGERS FOR UPDATED_AT
-- ===========================================

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON user_management.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON user_management.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON content_management.portfolio_items;
CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON content_management.portfolio_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inquiries_updated_at ON interaction_management.inquiries;
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON interaction_management.inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();