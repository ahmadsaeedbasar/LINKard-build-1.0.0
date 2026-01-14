-- Complete LINKard Database Schema
-- This migration creates the entire production-ready database schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS user_management;
CREATE SCHEMA IF NOT EXISTS interaction_management;
CREATE SCHEMA IF NOT EXISTS booking_management;
CREATE SCHEMA IF NOT EXISTS payment_management;
CREATE SCHEMA IF NOT EXISTS analytics_management;
CREATE SCHEMA IF NOT EXISTS notification_management;

-- Categories table
CREATE TABLE IF NOT EXISTS user_management.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platforms table
CREATE TABLE IF NOT EXISTS user_management.platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    color_class TEXT,
    icon_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (updated)
CREATE TABLE IF NOT EXISTS user_management.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('influencer', 'client')),
    category_id UUID REFERENCES user_management.categories(id),
    platform_id UUID REFERENCES user_management.platforms(id),
    location TEXT,
    followers_count INTEGER DEFAULT 0,
    start_price DECIMAL(10,2),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    bio TEXT,
    available_spaces TEXT[],
    social_link TEXT,
    email TEXT,
    contact_email TEXT,
    phone TEXT,
    address TEXT,
    booking_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio items table
CREATE TABLE IF NOT EXISTS user_management.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('video', 'image')),
    thumbnail_url TEXT NOT NULL,
    content_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS interaction_management.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID, -- Nullable for direct conversations
    client_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed')),
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS interaction_management.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES interaction_management.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS interaction_management.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites table
CREATE TABLE IF NOT EXISTS interaction_management.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(client_id, influencer_id)
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS booking_management.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    budget DECIMAL(10,2),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'proposed', 'accepted', 'in_progress', 'completed', 'cancelled')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS booking_management.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES booking_management.campaigns(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deliverables table
CREATE TABLE IF NOT EXISTS booking_management.deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES booking_management.campaigns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking status history table
CREATE TABLE IF NOT EXISTS booking_management.booking_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES booking_management.bookings(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID NOT NULL REFERENCES user_management.profiles(id),
    change_reason TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS payment_management.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('card', 'bank_account', 'paypal')),
    provider TEXT NOT NULL, -- stripe, paypal, etc.
    last_four TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS payment_management.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES booking_management.bookings(id) ON DELETE SET NULL,
    payer_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    payee_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_type TEXT DEFAULT 'booking_payment' CHECK (transaction_type IN ('booking_payment', 'milestone', 'refund')),
    payment_method_id UUID REFERENCES payment_management.payment_methods(id),
    external_transaction_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS payment_management.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES payment_management.transactions(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue', 'cancelled')),
    due_date DATE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refunds table
CREATE TABLE IF NOT EXISTS payment_management.refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES payment_management.transactions(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profile views table
CREATE TABLE IF NOT EXISTS analytics_management.profile_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES user_management.profiles(id) ON DELETE SET NULL, -- NULL for anonymous
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    source TEXT DEFAULT 'direct' CHECK (source IN ('search', 'direct', 'referral')),
    ip_address INET,
    user_agent TEXT
);

-- Inquiry analytics table
CREATE TABLE IF NOT EXISTS analytics_management.inquiry_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    inquiries_received INTEGER DEFAULT 0,
    inquiries_responded INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, date)
);

-- Engagement metrics table
CREATE TABLE IF NOT EXISTS analytics_management.engagement_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    date DATE NOT NULL,
    followers_count INTEGER,
    likes_count INTEGER,
    comments_count INTEGER,
    shares_count INTEGER,
    engagement_rate DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, platform, date)
);

-- Campaign analytics table
CREATE TABLE IF NOT EXISTS analytics_management.campaign_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES booking_management.campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(campaign_id, date)
);

-- Notification templates table
CREATE TABLE IF NOT EXISTS notification_management.notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('inquiry', 'booking_request', 'payment', 'review', 'system')),
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notification_management.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('inquiry', 'booking_request', 'payment', 'review', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification preferences table
CREATE TABLE IF NOT EXISTS notification_management.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_management.profiles(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, notification_type)
);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON user_management.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON user_management.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_category_id ON user_management.profiles(category_id);
CREATE INDEX IF NOT EXISTS idx_profiles_platform_id ON user_management.profiles(platform_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON user_management.profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_is_featured ON user_management.profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_profile_id ON user_management.portfolio_items(profile_id);

CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON interaction_management.conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_influencer_id ON interaction_management.conversations(influencer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON interaction_management.conversations(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON interaction_management.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON interaction_management.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON interaction_management.reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON interaction_management.reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_favorites_client_id ON interaction_management.favorites(client_id);
CREATE INDEX IF NOT EXISTS idx_favorites_influencer_id ON interaction_management.favorites(influencer_id);

CREATE INDEX IF NOT EXISTS idx_campaigns_client_id ON booking_management.campaigns(client_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_influencer_id ON booking_management.campaigns(influencer_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON booking_management.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_bookings_campaign_id ON booking_management.bookings(campaign_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON booking_management.bookings(status);
CREATE INDEX IF NOT EXISTS idx_deliverables_campaign_id ON booking_management.deliverables(campaign_id);
CREATE INDEX IF NOT EXISTS idx_booking_status_history_booking_id ON booking_management.booking_status_history(booking_id);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_management.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_booking_id ON payment_management.transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payer_id ON payment_management.transactions(payer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payee_id ON payment_management.transactions(payee_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON payment_management.transactions(status);
CREATE INDEX IF NOT EXISTS idx_invoices_transaction_id ON payment_management.invoices(transaction_id);
CREATE INDEX IF NOT EXISTS idx_refunds_transaction_id ON payment_management.refunds(transaction_id);

CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON analytics_management.profile_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer_id ON analytics_management.profile_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON analytics_management.profile_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_inquiry_analytics_profile_id ON analytics_management.inquiry_analytics(profile_id);
CREATE INDEX IF NOT EXISTS idx_inquiry_analytics_date ON analytics_management.inquiry_analytics(date);
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_profile_id ON analytics_management.engagement_metrics(profile_id);
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_date ON analytics_management.engagement_metrics(date);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_campaign_id ON analytics_management.campaign_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_date ON analytics_management.campaign_analytics(date);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notification_management.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notification_management.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notification_management.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_management.notification_preferences(user_id);

-- Create triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON user_management.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON user_management.portfolio_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON interaction_management.conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON booking_management.campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON booking_management.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliverables_updated_at BEFORE UPDATE ON booking_management.deliverables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON payment_management.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_management.notification_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_management.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_management.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_management.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_management.platforms ENABLE ROW LEVEL SECURITY;

ALTER TABLE interaction_management.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_management.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_management.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_management.favorites ENABLE ROW LEVEL SECURITY;

ALTER TABLE booking_management.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_management.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_management.deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_management.booking_status_history ENABLE ROW LEVEL SECURITY;

ALTER TABLE payment_management.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_management.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_management.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_management.refunds ENABLE ROW LEVEL SECURITY;

ALTER TABLE analytics_management.profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_management.inquiry_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_management.engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_management.campaign_analytics ENABLE ROW LEVEL SECURITY;

ALTER TABLE notification_management.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_management.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_management.notification_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view all profiles" ON user_management.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON user_management.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_management.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view all portfolio items" ON user_management.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Users can manage their own portfolio items" ON user_management.portfolio_items FOR ALL USING (
    profile_id IN (SELECT id FROM user_management.profiles WHERE id = auth.uid())
);

CREATE POLICY "Anyone can view categories" ON user_management.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view platforms" ON user_management.platforms FOR SELECT USING (true);

CREATE POLICY "Users can view their conversations" ON interaction_management.conversations FOR SELECT USING (
    client_id = auth.uid() OR influencer_id = auth.uid()
);
CREATE POLICY "Users can create conversations" ON interaction_management.conversations FOR INSERT WITH CHECK (
    client_id = auth.uid() OR influencer_id = auth.uid()
);

CREATE POLICY "Users can view messages in their conversations" ON interaction_management.messages FOR SELECT USING (
    conversation_id IN (
        SELECT id FROM interaction_management.conversations
        WHERE client_id = auth.uid() OR influencer_id = auth.uid()
    )
);
CREATE POLICY "Users can send messages in their conversations" ON interaction_management.messages FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
        SELECT id FROM interaction_management.conversations
        WHERE client_id = auth.uid() OR influencer_id = auth.uid()
    )
);

CREATE POLICY "Anyone can view reviews" ON interaction_management.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON interaction_management.reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Users can view all favorites" ON interaction_management.favorites FOR SELECT USING (true);
CREATE POLICY "Users can manage their favorites" ON interaction_management.favorites FOR ALL USING (client_id = auth.uid());

CREATE POLICY "Users can view their campaigns" ON booking_management.campaigns FOR SELECT USING (
    client_id = auth.uid() OR influencer_id = auth.uid()
);
CREATE POLICY "Clients can create campaigns" ON booking_management.campaigns FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Users can update their campaigns" ON booking_management.campaigns FOR UPDATE USING (
    client_id = auth.uid() OR influencer_id = auth.uid()
);

CREATE POLICY "Users can view their bookings" ON booking_management.bookings FOR SELECT USING (
    campaign_id IN (
        SELECT id FROM booking_management.campaigns
        WHERE client_id = auth.uid() OR influencer_id = auth.uid()
    )
);
CREATE POLICY "Users can manage bookings in their campaigns" ON booking_management.bookings FOR ALL USING (
    campaign_id IN (
        SELECT id FROM booking_management.campaigns
        WHERE client_id = auth.uid() OR influencer_id = auth.uid()
    )
);

CREATE POLICY "Users can manage their payment methods" ON payment_management.payment_methods FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their transactions" ON payment_management.transactions FOR SELECT USING (
    payer_id = auth.uid() OR payee_id = auth.uid()
);

CREATE POLICY "Users can view their notifications" ON notification_management.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their notifications" ON notification_management.notifications FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can manage their notification preferences" ON notification_management.notification_preferences FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their profile analytics" ON analytics_management.profile_views FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can view their inquiry analytics" ON analytics_management.inquiry_analytics FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can view their engagement metrics" ON analytics_management.engagement_metrics FOR SELECT USING (profile_id = auth.uid());

-- Insert default data
INSERT INTO user_management.categories (name, description) VALUES
('Lifestyle', 'Lifestyle and personal content creators'),
('Technology', 'Tech reviewers and gadget influencers'),
('Travel', 'Travel bloggers and destination experts'),
('Gaming', 'Gaming content creators and streamers'),
('Finance', 'Financial advisors and money experts'),
('Fashion', 'Fashion and beauty influencers'),
('Food', 'Food bloggers and culinary experts'),
('Fitness', 'Fitness trainers and health coaches'),
('Music', 'Musicians and music content creators'),
('Art', 'Artists and creative professionals')
ON CONFLICT (name) DO NOTHING;

INSERT INTO user_management.platforms (name, display_name, color_class, icon_url) VALUES
('instagram', 'Instagram', 'bg-gradient-to-r from-purple-500 to-pink-500', NULL),
('youtube', 'YouTube', 'bg-red-500', NULL),
('twitter', 'Twitter', 'bg-blue-400', NULL),
('tiktok', 'TikTok', 'bg-black', NULL),
('linkedin', 'LinkedIn', 'bg-blue-600', NULL),
('facebook', 'Facebook', 'bg-blue-500', NULL),
('twitch', 'Twitch', 'bg-purple-600', NULL),
('snapchat', 'Snapchat', 'bg-yellow-400', NULL)
ON CONFLICT (name) DO NOTHING;

INSERT INTO notification_management.notification_templates (name, type, subject, body, variables) VALUES
('inquiry_received', 'inquiry', 'New Inquiry from {{client_name}}', 'Hi {{influencer_name}}, you have received a new inquiry from {{client_name}}. Check your dashboard to respond.', '{"client_name": "string", "influencer_name": "string"}'),
('booking_request', 'booking_request', 'New Booking Request', 'Hi {{influencer_name}}, {{client_name}} has requested to book your services for a campaign.', '{"client_name": "string", "influencer_name": "string"}'),
('payment_received', 'payment', 'Payment Received', 'Hi {{user_name}}, you have received a payment of ${{amount}} for your services.', '{"user_name": "string", "amount": "number"}'),
('review_received', 'review', 'New Review', 'Hi {{user_name}}, you have received a new {{rating}}-star review from {{reviewer_name}}.', '{"user_name": "string", "rating": "number", "reviewer_name": "string"}'),
('campaign_completed', 'system', 'Campaign Completed', 'Hi {{user_name}}, your campaign "{{campaign_title}}" has been marked as completed.', '{"user_name": "string", "campaign_title": "string"}')
ON CONFLICT (name) DO NOTHING;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('portfolio', 'portfolio', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4']),
('documents', 'documents', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Portfolio items are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to their portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their portfolio items" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their portfolio items" ON storage.objects;
DROP POLICY IF EXISTS "Users can access their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Portfolio items are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio');

CREATE POLICY "Users can upload to their portfolio" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their portfolio items" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their portfolio items" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can access their own documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" ON storage.objects
  FOR UPDATE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);