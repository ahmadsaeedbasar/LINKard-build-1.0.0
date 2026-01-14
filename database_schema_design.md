# LINKard Database Schema Design

## Overview
This document outlines a comprehensive, production-level database schema for the LINKard platform, designed to support influencers, clients, bookings, payments, analytics, and notifications with proper separation of concerns.

## Current Schema Analysis
- **user_management**: Contains user profiles with portfolio items stored as JSONB
- **interaction_management**: Handles inquiries between clients and influencers
- **Extensions**: UUID-OSSP for UUID generation
- **Indexes**: Optimized for common queries
- **Triggers**: Automatic updated_at timestamp management

## Proposed Schema Architecture

### 1. user_management Schema
**Existing Tables:**
- `profiles` - User profiles for influencers and clients

**New Tables:**
- `categories` - Influencer categories (Lifestyle, Technology, etc.)
- `platforms` - Social media platforms (Instagram, YouTube, etc.)
- `portfolio_items` - Separate table for portfolio items (normalized from JSONB)

### 2. interaction_management Schema
**Existing Tables:**
- `inquiries` - Initial contact messages

**New Tables:**
- `conversations` - Threaded message conversations
- `messages` - Individual messages within conversations
- `reviews` - Client reviews of influencers
- `favorites` - Client favorite influencers

### 3. booking_management Schema
**New Tables:**
- `campaigns` - Campaign/collaboration details
- `bookings` - Booking requests and confirmations
- `deliverables` - Campaign deliverables and deadlines
- `booking_status_history` - Status change tracking

### 4. payment_management Schema
**New Tables:**
- `transactions` - Payment transactions
- `invoices` - Generated invoices
- `payment_methods` - Stored payment methods
- `refunds` - Refund records

### 5. analytics_management Schema
**New Tables:**
- `profile_views` - Profile view tracking
- `inquiry_analytics` - Inquiry conversion metrics
- `engagement_metrics` - Platform engagement data
- `campaign_analytics` - Campaign performance data

### 6. notification_management Schema
**New Tables:**
- `notifications` - User notifications
- `notification_preferences` - User notification settings
- `notification_templates` - Reusable notification templates

## Detailed Table Specifications

### user_management.profiles
**Current Fields:** (Keep existing)
- id, username, display_name, role, category, location, followers_count, start_price, platform, platform_label, platform_color_class, avatar_url, is_verified, is_featured, bio, available_spaces, social_link, portfolio_items (JSONB), email, contact_email, phone, address, booking_url, created_at, updated_at

**Modifications:**
- Remove portfolio_items (move to separate table)
- Add category_id (FK to categories)
- Add platform_id (FK to platforms)

### user_management.portfolio_items
**New Table:**
- id (UUID, PK)
- profile_id (UUID, FK to profiles)
- title (TEXT)
- type ('video' | 'image')
- thumbnail_url (TEXT)
- content_url (TEXT)
- description (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### interaction_management.conversations
**New Table:**
- id (UUID, PK)
- inquiry_id (UUID, FK to inquiries, nullable for direct conversations)
- client_id (UUID, FK to profiles)
- influencer_id (UUID, FK to profiles)
- status ('active' | 'archived' | 'closed')
- last_message_at (TIMESTAMPTZ)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### interaction_management.messages
**New Table:**
- id (UUID, PK)
- conversation_id (UUID, FK to conversations)
- sender_id (UUID, FK to profiles)
- content (TEXT)
- message_type ('text' | 'image' | 'file')
- is_read (BOOLEAN, default FALSE)
- created_at (TIMESTAMPTZ)

### booking_management.campaigns
**New Table:**
- id (UUID, PK)
- client_id (UUID, FK to profiles)
- influencer_id (UUID, FK to profiles)
- title (TEXT)
- description (TEXT)
- budget (DECIMAL)
- status ('draft' | 'proposed' | 'accepted' | 'in_progress' | 'completed' | 'cancelled')
- start_date (DATE)
- end_date (DATE)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### booking_management.bookings
**New Table:**
- id (UUID, PK)
- campaign_id (UUID, FK to campaigns)
- booking_date (DATE)
- status ('pending' | 'confirmed' | 'completed' | 'cancelled')
- notes (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### payment_management.transactions
**New Table:**
- id (UUID, PK)
- booking_id (UUID, FK to bookings, nullable)
- payer_id (UUID, FK to profiles)
- payee_id (UUID, FK to profiles)
- amount (DECIMAL)
- currency (TEXT, default 'USD')
- status ('pending' | 'completed' | 'failed' | 'refunded')
- transaction_type ('booking_payment' | 'milestone' | 'refund')
- payment_method_id (UUID, FK to payment_methods)
- external_transaction_id (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### analytics_management.profile_views
**New Table:**
- id (UUID, PK)
- profile_id (UUID, FK to profiles)
- viewer_id (UUID, FK to profiles, nullable for anonymous)
- viewed_at (TIMESTAMPTZ)
- source ('search' | 'direct' | 'referral')
- ip_address (INET, nullable)

### notification_management.notifications
**New Table:**
- id (UUID, PK)
- user_id (UUID, FK to profiles)
- type ('inquiry' | 'booking_request' | 'payment' | 'review' | 'system')
- title (TEXT)
- message (TEXT)
- is_read (BOOLEAN, default FALSE)
- action_url (TEXT, nullable)
- created_at (TIMESTAMPTZ)

## Migration Strategy
1. Create new schemas
2. Create new tables with proper constraints and indexes
3. Migrate existing data (portfolio_items from JSONB to separate table)
4. Update foreign key references
5. Add RLS policies for all tables
6. Create indexes for performance
7. Add triggers for updated_at
8. Update application code to use new schema

## Performance Considerations
- Partition large tables (analytics, notifications) by date
- Use appropriate indexes for common queries
- Implement connection pooling
- Add caching layers for frequently accessed data

## Security Considerations
- Implement Row Level Security (RLS) on all tables
- Use proper foreign key constraints
- Sanitize user inputs
- Implement audit logging for sensitive operations

## Next Steps
1. Create migration files for new schema
2. Implement data migration scripts
3. Update application models and queries
4. Add API endpoints for new features
5. Implement frontend components for new functionality