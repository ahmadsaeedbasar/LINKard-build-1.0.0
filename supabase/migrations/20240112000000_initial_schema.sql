-- Initial schema migration for LINKard project
-- This creates the complete database structure

-- Create schemas
CREATE SCHEMA IF NOT EXISTS user_management;
CREATE SCHEMA IF NOT EXISTS content_management;
CREATE SCHEMA IF NOT EXISTS interaction_management;
CREATE SCHEMA IF NOT EXISTS analytics_management;
CREATE SCHEMA IF NOT EXISTS system_management;

-- Grant permissions
GRANT USAGE ON SCHEMA user_management TO authenticated;
GRANT USAGE ON SCHEMA content_management TO authenticated;
GRANT USAGE ON SCHEMA interaction_management TO authenticated;
GRANT USAGE ON SCHEMA analytics_management TO authenticated;
GRANT USAGE ON SCHEMA system_management TO authenticated;

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create user_management.profiles table
CREATE TABLE user_management.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    email TEXT,
    contact_email TEXT,
    phone TEXT,
    address TEXT,
    booking_url TEXT,
    location TEXT,
    website TEXT,
    social_links JSONB DEFAULT '{}',
    categories TEXT[] DEFAULT '{}',
    pricing JSONB DEFAULT '{}',
    analytics JSONB DEFAULT '{}',
    followers_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    role TEXT NOT NULL,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add constraints and indexes to profiles
ALTER TABLE user_management.profiles ADD CONSTRAINT profiles_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
CREATE INDEX idx_profiles_username ON user_management.profiles (username);
CREATE INDEX idx_profiles_role ON user_management.profiles (role);
CREATE INDEX idx_profiles_email ON user_management.profiles (email);

-- Create content_management.portfolio_items table
CREATE TABLE content_management.portfolio_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('video', 'image')),
    thumbnail TEXT,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes to portfolio_items
CREATE INDEX idx_portfolio_items_profile_id ON content_management.portfolio_items (profile_id);
CREATE INDEX idx_portfolio_items_type ON content_management.portfolio_items (type);

-- Create interaction_management.inquiries table
CREATE TABLE interaction_management.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    brand_name TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded')),
    sender_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes to inquiries
CREATE INDEX idx_inquiries_creator_id ON interaction_management.inquiries (creator_id);
CREATE INDEX idx_inquiries_sender_id ON interaction_management.inquiries (sender_id);
CREATE INDEX idx_inquiries_status ON interaction_management.inquiries (status);
CREATE INDEX idx_inquiries_created_at ON interaction_management.inquiries (created_at DESC);

-- Create analytics_management.analytics_events table
CREATE TABLE analytics_management.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes to analytics_events
CREATE INDEX idx_analytics_events_profile_id ON analytics_management.analytics_events (profile_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_management.analytics_events (event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_management.analytics_events (created_at DESC);

-- Create system_management.system_settings table
CREATE TABLE system_management.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE user_management.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_management.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_management.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_management.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_management.system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON user_management.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_management.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_management.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for portfolio_items
CREATE POLICY "Users can view portfolio items" ON content_management.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Users can manage own portfolio items" ON content_management.portfolio_items FOR ALL USING (auth.uid() = profile_id);

-- RLS Policies for inquiries
CREATE POLICY "Creators can view received inquiries" ON interaction_management.inquiries FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Senders can view sent inquiries" ON interaction_management.inquiries FOR SELECT USING (auth.uid() = sender_id);
CREATE POLICY "Users can create inquiries" ON interaction_management.inquiries FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Creators can update inquiries" ON interaction_management.inquiries FOR UPDATE USING (auth.uid() = creator_id);

-- RLS Policies for analytics_events
CREATE POLICY "Users can view own analytics" ON analytics_management.analytics_events FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own analytics" ON analytics_management.analytics_events FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- RLS Policies for system_settings
CREATE POLICY "Authenticated users can read system settings" ON system_management.system_settings FOR SELECT USING (auth.role() = 'authenticated');

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON user_management.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON content_management.portfolio_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON interaction_management.inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();